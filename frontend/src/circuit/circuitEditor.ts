import {
  CircuitElement,
  CircuitElementIO,
  CircuitElementRemove,
  CircuitElementUpdate,
  CircuitElementIOMap,
  RecursivePartial,
} from '../types';

import { merge } from 'lodash';
import { Group } from 'two.js/src/group';
import Two from 'two.js';
import { Vector } from 'two.js/src/vector';
import { ZUI } from 'two.js/extras/jsm/zui';
import elementDefinitions, {
  WIRE_INPUT_ID,
  WIRE_OUTPUT_ID,
  WIRE_TYPE_ID,
} from './circuitElementDefinitions';
import { Shape } from 'two.js/src/shape';
import {
  buildWireConnection,
  CircuitElementIoPortTuple,
  getWireId,
} from './circuitElement';
import { Path } from 'two.js/src/path';
import { Anchor } from 'two.js/src/anchor';

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
      wirePath: Path;
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
  private wirePaths: { [key: string]: Path } = {};
  private activeTool: EditorTool = EditorTool.Move;
  private toolData: EditorToolData = { state: EditorToolState.Move };

  get surfaceMousePos(): Vector {
    return this.zui.clientToSurface(this.mousePos.x, this.mousePos.y);
  }

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
    this.elements.forEach((element) => {
      if (element.typeId === WIRE_TYPE_ID) {
        this.updateWireShape(element);
      } else {
        this.updateElementShape(element);
      }
    });
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

    const srcIoPos = new Vector(
      element.params.x + io.xOffset,
      element.params.y + io.yOffset
    );
    const wirePath = new Two.Line(
      srcIoPos.x,
      srcIoPos.y,
      this.surfaceMousePos.x,
      this.surfaceMousePos.y
    );
    wirePath.fill = elementDefinitions[WIRE_TYPE_ID].color;
    this.stage.add(wirePath);

    this.toolData = {
      state: EditorToolState.ConnectingElement,
      element,
      io,
      wirePath,
    };

    console.log('Start connecting', element, io);
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

    // Check if wire already exists between these ports
    const wireKey = getWireId(src, sink);
    if (wireKey in this.wirePaths) {
      console.error('Cannot have two identical wires');
      this.setState(EditorToolState.Connect);
      return;
    }

    // Creating wire to connect: src.output -> wire -> sink.input
    const wire = buildWireConnection(src, sink);

    if (!wire) {
      console.error('Failed to create wire');
      return;
    }

    // Create wire shape and remote temp
    this.toolData.wirePath.remove();
    this.buildWire(wire);

    // Send new wire element
    this.onCircuitUpdated(wire);

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

  getWireConnectionTuples(wire: CircuitElement): {
    src: CircuitElementIoPortTuple;
    sink: CircuitElementIoPortTuple;
  } | null {
    // Src / input
    const input = wire.params.inputs[WIRE_INPUT_ID]!;
    let srcElement = this.elements.find((e) => e.id === input.elementId);

    if (!srcElement) {
      console.error('Failed to find tuple for wire', wire);
      return null;
    }

    let srcElementIo = elementDefinitions[srcElement.typeId].inputs.find(
      (i) => i.id === input.ioPortId
    );

    if (!srcElementIo) {
      console.error('Failed to find tuple for wire', wire);
      return null;
    }

    let src: CircuitElementIoPortTuple = {
      element: srcElement,
      ioPort: srcElementIo,
    };

    // Sink / output
    const output = wire.params.outputs[WIRE_OUTPUT_ID]!;
    let sinkElement = this.elements.find((e) => e.id === output.elementId);

    if (!sinkElement) {
      console.error('Failed to find tuple for wire', wire);
      return null;
    }

    let sinkElementIo = elementDefinitions[sinkElement.typeId].outputs.find(
      (i) => i.id === input.ioPortId
    );

    if (!sinkElementIo) {
      console.error('Failed to find tuple for wire', wire);
      return null;
    }

    let sink: CircuitElementIoPortTuple = {
      element: sinkElement,
      ioPort: sinkElementIo,
    };

    return {
      src,
      sink,
    };
  }

  /**
   * Build the canvas shapes for a single wire circuit element
   */
  buildWire(wire: CircuitElement) {
    // Check if wire already exists
    if (!(wire.id in this.wirePaths)) {
      const path = new Two.Line();
      path.fill = elementDefinitions[WIRE_TYPE_ID].color;
      this.stage.add(path);
    }

    // Update line path start/end positions
    const tuples = this.getWireConnectionTuples(wire);

    if (!tuples) {
      console.error('Failed to build wire', wire);
      return;
    }

    const { src, sink } = tuples;
    const path = this.wirePaths[wire.id];
    const startPos = new Vector(
      src.element.params.x + src.ioPort.xOffset,
      src.element.params.y + src.ioPort.yOffset
    );
    const endPos = new Vector(
      sink.element.params.x + sink.ioPort.xOffset,
      sink.element.params.y + sink.ioPort.yOffset
    );

    path.vertices = [
      new Anchor(startPos.x, startPos.y),
      new Anchor(endPos.x, endPos.y),
    ];

    console.log('built new wire shape');
  }

  /**
   * Build the canvas shapes for a single (non-wire) circuit element
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

  updateTempWireShape(newPos: Vector) {
    if (this.toolData.state !== EditorToolState.ConnectingElement) {
      console.error('Cannot update wire shape when not in connecting state');
      return;
    }

    const surfacePos: Vector = this.zui.clientToSurface(newPos.x, newPos.y);
    let endPoint: Anchor = this.toolData.wirePath.vertices[1];
    endPoint.set(surfacePos.x, surfacePos.y);
  }

  updateWireShape(element: CircuitElement) {
    if (element.typeId !== WIRE_TYPE_ID) {
      console.error('Cannot use updateWireShape for non-wire elements');
      return;
    }

    // TODO(radu): Update wire shape path
  }

  /**
   * Update the Two.JS shape representation of an element
   * @param element The element to update
   */
  updateElementShape(element: CircuitElement) {
    if (element.typeId === WIRE_TYPE_ID) {
      console.error('Cannot use updateElementShape for wire elements');
      return;
    }

    // Check if element shape needs to be created
    if (!(element.id in this.elementShapes)) {
      this.buildElement(element);
    }

    // Update the position for the shape
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
      this.updateTempWireShape(newPos);
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
