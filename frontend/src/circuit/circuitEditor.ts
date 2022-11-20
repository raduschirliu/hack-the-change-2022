import {
  CircuitElement,
  CircuitElementIO,
  CircuitElementIOMap,
  CircuitElementRemove,
  CircuitElementUpdate,
  RecursivePartial,
} from '../types';
import {
  CircuitElementIoPortTuple,
  buildWireConnection,
} from './circuitElement';
import elementDefinitions, {
  WIRE_INPUT_ID,
  WIRE_OUTPUT_ID,
} from './circuitElementDefinitions';

import { Group } from 'two.js/src/group';
import { Shape } from 'two.js/src/shape';
import Two from 'two.js';
import { Vector } from 'two.js/src/vector';
import { ZUI } from 'two.js/extras/jsm/zui';
import { merge } from 'lodash';

export enum CursorMode {
  Default = 'default',
  Move = 'move',
  Pointer = 'pointer',
  Grab = 'grab',
  Grabbing = 'grabbing',
}

export enum EditorTool {
  Move = 'move',
  Connect = 'connect',
  Erase = 'erase',
  Simulate = 'simulate',
}

enum EditorToolState {
  // Move tool selected
  Move = 'move',

  // Camera panning around
  Panning = 'panning',

  // Element being moved
  MovingElement = 'movingElement',

  // Connect tool selected
  Connect = 'connect',
  // Element being connected
  ConnectingElement = 'connectingElement',

  // Currently connecting two ports
  Connecting = 'connecting',

  // Erase tool selected
  Erase = 'erase',

  // Simulate tool selected
  Simulate = 'simulate',
}

type EditorToolData =
  | {
      state:
        | EditorToolState.Move
        | EditorToolState.Erase
        | EditorToolState.Panning
        | EditorToolState.Connect;
    }
  | {
      state: EditorToolState.MovingElement;
      element: CircuitElement;
    }
  | {
      state: EditorToolState.ConnectingElement;
      element: CircuitElement;
      io: CircuitElementIO;
    };

const IO_PORT_RADIUS = 10;
const GRID_SIZE_PX = 10;
const MOUSE_LEFT_BUTTON = 0;
const MOUSE_MIDDLE_BUTTON = 1;
const MOUSE_RIGHT_BUTTON = 2;

class CircuitEditor {
  /* Callbacks */
  public onCircuitUpdated: (update: CircuitElementUpdate) => void = (
    update
  ) => {};
  public onCircuitRemoved: (remove: CircuitElementRemove) => void = (
    remove
  ) => {};

  private two: Two;
  private grid: Group;
  private stage: Group;
  private overlay: Group;
  private mousePos: Vector = new Two.Vector(0, 0);
  private zui: ZUI;
  private elements: CircuitElement[] = [];
  private elementShapes: {
    [key: string]: {
      group: Group;
      [key: string]: Shape;
    };
  } = {};
  private activeTool: EditorTool = EditorTool.Move;
  private toolData: EditorToolData = { state: EditorToolState.Move };

  get toolState(): EditorToolState {
    return this.toolData.state;
  }

  get domElement(): HTMLCanvasElement {
    return this.two.renderer.domElement;
  }

  constructor(divRef: HTMLDivElement) {
    this.two = new Two({ fitted: true, type: Two.Types.canvas }).appendTo(
      divRef
    );

    this.grid = this.two.makeGroup();
    this.stage = this.two.makeGroup();
    this.overlay = this.two.makeGroup();

    this.zui = new ZUI(this.stage);
    this.zui.addLimits(0.06, 8);

    console.log('Initialized circuit editor');

    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));

    this.draw();

    // TODO: Add support for touch inputs
    // domElement.addEventListener('touchstart', touchstart, false);
    // domElement.addEventListener('touchmove', touchmove, false);
    // domElement.addEventListener('touchend', touchend, false);
    // domElement.addEventListener('touchcancel', touchend, false);
  }

  /**
   * Called every animation frame to draw the canvas
   */
  draw() {
    this.two.update();
    this.two.render();

    this.updateCursorMode();

    requestAnimationFrame(this.draw.bind(this));
  }

  setElements(elements: CircuitElement[]) {
    // Make a deep copy of the elements we get
    this.elements = JSON.parse(JSON.stringify(elements));

    // Remove shapes not needed anymore
    let elementKeys = this.elements.map((element) => element.id);
    let shapesToRemove = Object.keys(this.elementShapes).filter(
      (key) => !elementKeys.includes(key)
    );

    for (const key of shapesToRemove) {
      console.log(key);
      if (this.elementShapes[key]) {
        this.elementShapes[key].group.remove();
        delete this.elementShapes[key];
      }
    }

    // Build all the element shapes
    this.elements.forEach((element) => this.buildElement(element));
  }

  private setState(newState: EditorToolState) {
    if (newState === this.toolState) return;

    switch (newState) {
      case EditorToolState.Move:
        this.toolData = {
          state: EditorToolState.Move,
        };
        break;

      case EditorToolState.Erase:
        this.toolData = {
          state: EditorToolState.Erase,
        };
        break;

      case EditorToolState.Connect:
        this.toolData = {
          state: EditorToolState.Connect,
        };
        break;

      default:
        console.error('Unimplemented state: ', newState);
        break;
    }
  }

  private startMovingElement(element: CircuitElement) {
    if (this.toolState !== EditorToolState.Move) {
      console.error('Invalid state transition to MoveElement');
      return;
    }

    console.log('Start moving', element);

    this.toolData = {
      state: EditorToolState.MovingElement,
      element,
    };
  }

  private stopMovingElement() {
    if (this.toolData.state !== EditorToolState.MovingElement) {
      console.error('Cannot stop moving element if not currently moving');
      return;
    }

    this.onCircuitUpdated(
      this.buildUpdateMsg(this.toolData.element, {
        params: {
          x: this.toolData.element.params.x,
          y: this.toolData.element.params.y,
        },
      })
    );

    this.updateElementShape(this.toolData.element);
    console.log('Stopped moving element, submitted data');

    this.toolData = {
      state: EditorToolState.Move,
    };
  }

  private startPanning() {
    if (this.toolState === EditorToolState.MovingElement) {
      console.error('Cannot pan if moving element');
      return;
    }

    this.toolData = {
      state: EditorToolState.Panning,
    };
  }

  private stopPanning() {
    if (this.toolState !== EditorToolState.Panning) {
      console.error('Not currently panning, cannot stop');
      return;
    }

    // Revert to default for active tool
    this.setActiveTool(this.activeTool);
  }

  private startConnectingElement(
    element: CircuitElement,
    io: CircuitElementIO
  ) {
    if (this.toolState !== EditorToolState.Connect) {
      console.error('Cannot start connecting if not in Connect state');
      return;
    }

    console.log('Start connecting', element, io);

    this.toolData = {
      state: EditorToolState.ConnectingElement,
      element,
      io,
    };
  }

  private buildUpdateMsg(
    element: CircuitElement,
    changes: RecursivePartial<CircuitElement>
  ): CircuitElementUpdate {
    return merge(element, changes);
  }

  private stopConnectingElement(element: CircuitElement, io: CircuitElementIO) {
    if (this.toolData.state !== EditorToolState.ConnectingElement) {
      console.error('Cannot stop connecting if not currently connecting');
      return;
    }

    if (this.toolData.element.id === element.id) {
      console.error('Cannot connect to self');
      this.setState(EditorToolState.Connect);
      return;
    }

    if (this.toolData.io.type === io.type) {
      console.error('Cannot connect to same type of IO');
      this.setState(EditorToolState.Connect);
      return;
    }

    // Start element/IO port
    const start: CircuitElementIoPortTuple = {
      element: this.toolData.element,
      ioPort: this.toolData.io,
    };

    // End element/IO port
    const end: CircuitElementIoPortTuple = {
      element,
      ioPort: io,
    };

    // Source element (the one which is providing the signal to its output)
    let src;
    // Sink element (the one receiving the signal to its input)
    let sink;

    if (start.ioPort.type === 'input') {
      sink = start;
      src = end;
    } else {
      sink = end;
      src = start;
    }

    // Creating wire to connect: src.output -> wire -> sink.input
    const wire = buildWireConnection(src, sink);

    if (!wire) {
      console.error('Failed to create wire');
      return;
    }

    // Connect src output -> wire input
    this.onCircuitUpdated(
      this.buildUpdateMsg(src.element, {
        params: {
          outputs: {
            [src.ioPort.id]: {
              elementId: wire.id,
              ioPortId: WIRE_INPUT_ID,
            },
          },
        },
      })
    );

    // Connect sink input <- wire output
    this.onCircuitUpdated(
      this.buildUpdateMsg(sink.element, {
        params: {
          inputs: {
            [sink.ioPort.id]: {
              elementId: wire.id,
              ioPortId: WIRE_OUTPUT_ID,
            },
          },
        },
      })
    );

    console.log('Connected elements, submitted data');
    this.setState(EditorToolState.Connect);
  }

  /**
   * Set the active editor tool
   */
  setActiveTool(tool: EditorTool) {
    console.log('Set active tool', tool);

    switch (tool) {
      case EditorTool.Move:
        this.setState(EditorToolState.Move);
        break;

      case EditorTool.Erase:
        this.setState(EditorToolState.Erase);
        break;

      case EditorTool.Connect:
        this.setState(EditorToolState.Connect);
        break;

      case EditorTool.Simulate:
        this.setState(EditorToolState.Simulate);
        break;

      default:
        console.error('Invalid tool', tool);
        break;
    }
  }

  /**
   * Determine what the cursor should be set to
   */
  updateCursorMode() {
    const cursorTarget = this.getElementAtMouse();
    let cursor = CursorMode.Default;

    switch (this.toolState) {
      case EditorToolState.Erase:
        if (cursorTarget) {
          cursor = CursorMode.Pointer;
        }
        break;

      case EditorToolState.Move:
        if (cursorTarget) {
          cursor = CursorMode.Grab;
        }
        break;

      case EditorToolState.MovingElement:
        cursor = CursorMode.Grabbing;
        break;

      case EditorToolState.Connect:
      case EditorToolState.ConnectingElement:
        const ioTarget = this.getIoPortAtMouse();
        if (ioTarget) {
          cursor = CursorMode.Pointer;
        }
        break;
    }

    this.domElement.style.cursor = cursor;
  }

  /**
   * Draw a single circuit element
   */
  buildElement(element: CircuitElement) {
    const definition = elementDefinitions[element.typeId];

    // If the shape already exists, update it instead of making a new one
    if (element.id in this.elementShapes) {
      this.updateElementShape(element);
      return;
    }

    const group = this.two.makeGroup();
    group.position = new Two.Vector(element.params.x, element.params.y);
    this.elementShapes[element.id] = {
      group,
    };

    // Main component
    const rect = new Two.Rectangle(0, 0, definition.width, definition.height);
    rect.fill = definition.color;
    group.add(rect);

    // Label
    const labelText = definition.label.replace('put', '').toUpperCase();
    const label = new Two.Text(labelText, 0, 0);
    label.fill = '#fff';
    label.size = 18;
    label.family = 'monospace';
    label.alignment = 'center';
    label.baseline = 'middle';
    group.add(label);

    // Inputs
    definition.inputs.forEach((input) => {
      // Need radius for circle
      const path = new Two.Circle(
        input.xOffset,
        input.yOffset,
        IO_PORT_RADIUS / 2
      );
      path.fill = 'green';
      group.add(path);
      this.elementShapes[element.id][input.id] = path;
    });

    // Outputs
    definition.outputs.forEach((output) => {
      // Need radius for circle
      const path = new Two.Circle(
        output.xOffset,
        output.yOffset,
        IO_PORT_RADIUS / 2
      );
      path.fill = 'blue';
      group.add(path);
      this.elementShapes[element.id][output.id] = path;
    });

    // Add to stage and to element map
    this.stage.add(group);
  }

  /**
   * Update the Two.JS shape representation of an element
   * @param element The element to update
   */
  updateElementShape(element: CircuitElement) {
    const group = this.elementShapes[element.id].group;
    group.position.set(element.params.x, element.params.y);

    // TODO(radu): Update location of connections
  }

  /**
   * Remove an element from the circuit
   * @param element Element to remove
   */
  removeElement(element: CircuitElement | null) {
    if (!element) return;

    this.onCircuitRemoved({
      id: element.id,
    });

    // TODO(radu): Also remove connection lines
    // TODO: Remove all connections to this element
  }

  /**
   * Reset the camera back to (0, 0)
   */
  resetCamera() {
    this.zui.reset();
    this.zui.updateSurface();
    console.log('reset camera');
  }

  /**
   * Convert mouse coordinates from page to canvas
   * @param event Mouse event to get coordinates from
   * @returns Mouse coordinates within the canvas boundary
   */
  convertMousePos(event: MouseEvent): Vector {
    const rect: DOMRect = this.two.renderer.domElement.getBoundingClientRect();
    return new Two.Vector(event.clientX - rect.left, event.clientY - rect.top);
  }

  getIoPortAtMouse() {
    const pos = this.zui.clientToSurface(this.mousePos.x, this.mousePos.y);

    for (const element of this.elements) {
      const definition = elementDefinitions[element.typeId];
      const ioPorts = [...definition.inputs, ...definition.outputs];

      for (const port of ioPorts) {
        const portPos = new Two.Vector(
          element.params.x + port.xOffset,
          element.params.y + port.yOffset
        );

        if (portPos.distanceTo(pos) < IO_PORT_RADIUS) {
          return {
            element,
            port: port,
          };
        }
      }
    }
  }

  /**
   * Find the first circuit element under the user's mouse
   * @returns The CircuitElement under the user's mouse, if any
   */
  getElementAtMouse(): CircuitElement | null {
    const pos = this.zui.clientToSurface(this.mousePos.x, this.mousePos.y);

    for (const element of this.elements) {
      const definition = elementDefinitions[element.typeId];
      const bounds = {
        left: element.params.x - definition.width / 2,
        right: element.params.x + definition.width / 2,
        top: element.params.y - definition.height / 2,
        bottom: element.params.y + definition.height / 2,
      };

      if (
        pos.x >= bounds.left &&
        pos.x <= bounds.right &&
        pos.y >= bounds.top &&
        pos.y <= bounds.bottom
      ) {
        return element;
      }
    }

    return null;
  }

  onMouseDown(event: MouseEvent) {
    const pos = this.convertMousePos(event);

    if (event.button === MOUSE_LEFT_BUTTON) {
      if (this.toolState === EditorToolState.Move) {
        const target = this.getElementAtMouse();

        if (target) {
          this.startMovingElement(target);
        } else {
          this.startPanning();
        }
      } else if (this.toolState === EditorToolState.Erase) {
        const target = this.getElementAtMouse();
        this.removeElement(target);
      } else if (this.toolState === EditorToolState.Connect) {
        const target = this.getIoPortAtMouse();
        if (target) {
          this.startConnectingElement(target.element, target.port);
        } else {
          this.startPanning();
        }
      } else if (this.toolState === EditorToolState.Simulate) {
        // TODO(radu): Determine when clicking on element and toggling
      }
    }
  }

  onMouseUp(event: MouseEvent) {
    if (event.button === MOUSE_LEFT_BUTTON) {
      if (this.toolState === EditorToolState.Panning) {
        this.stopPanning();
      } else if (this.toolState === EditorToolState.MovingElement) {
        this.stopMovingElement();
      } else if (this.toolState === EditorToolState.ConnectingElement) {
        const target = this.getIoPortAtMouse();
        if (target) {
          this.stopConnectingElement(target.element, target.port);
        }
      }
    }
  }

  onMouseMove(event: MouseEvent) {
    const newPos = this.convertMousePos(event);
    const deltaPos = Two.Vector.sub(newPos, this.mousePos);

    if (this.toolState === EditorToolState.Panning) {
      this.zui.translateSurface(deltaPos.x, deltaPos.y);
    } else if (this.toolData.state === EditorToolState.MovingElement) {
      this.toolData.element.params.x += deltaPos.x;
      this.toolData.element.params.y += deltaPos.y;
      this.updateElementShape(this.toolData.element);
    } else if (this.toolData.state === EditorToolState.ConnectingElement) {
      // TODO: Draw connection line
    }

    this.mousePos = newPos;
  }

  onMouseWheel(event: WheelEvent) {}

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'r') {
      this.resetCamera();
    }
  }
}

export default CircuitEditor;
