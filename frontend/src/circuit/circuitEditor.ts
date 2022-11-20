import Two from 'two.js';
import { Group } from 'two.js/src/group';
import { Vector } from 'two.js/src/vector';
import { ZUI } from 'two.js/extras/jsm/zui';
import {
  CircuitElement,
  CircuitElementRemove,
  CircuitElementUpdate,
} from '../types';
import elementDefinitions from './circuitElementDefinitions';

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

  // Connect too selected
  Connect = 'connect',

  // Erase tool selected
  Erase = 'erase',

  // Simulate tool selected
  Simulate = 'simulate',
}

type EditorToolData =
  | {
      state: EditorToolState.Move;
    }
  | {
      state: EditorToolState.MovingElement;
      element: CircuitElement;
    }
  | {
      state: EditorToolState.Erase;
    }
  | {
      state: EditorToolState.Panning;
    };

const IO_RADIUS = 5;
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
  private elementShapes: { [key: string]: Group } = {};
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
        this.elementShapes[key].remove();
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

    this.onCircuitUpdated({
      targetId: this.toolData.element.id,
      params: {
        x: this.toolData.element.params.x,
        y: this.toolData.element.params.y,
      },
    });

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

  /**
   * Set the active editor tool
   */
  setActiveTool(tool: EditorTool) {
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

    // Main component
    const rect = new Two.Rectangle(0, 0, definition.width, definition.height);
    rect.fill = definition.color;
    group.add(rect);

    // Inputs
    definition.inputs.forEach((input) => {
      const path = new Two.Circle(input.xOffset, input.yOffset, IO_RADIUS);
      path.fill = 'green';
      group.add(path);
    });

    // Outputs
    definition.outputs.forEach((output) => {
      const path = new Two.Circle(output.xOffset, output.yOffset, IO_RADIUS);
      path.fill = 'blue';
      group.add(path);
    });

    // Add to stage and to element map
    this.stage.add(group);
    this.elementShapes[element.id] = group;
  }

  /**
   * Update the Two.JS shape representation of an element
   * @param element The element to update
   */
  updateElementShape(element: CircuitElement) {
    const shape = this.elementShapes[element.id];
    shape.position.set(element.params.x, element.params.y);
  }

  /**
   * Remove an element from the circuit
   * @param element Element to remove
   */
  removeElement(element: CircuitElement | null) {
    if (!element) return;

    this.onCircuitRemoved({
      targetId: element.id,
    });
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
    // TODO(radu): write this
  }

  /**
   * Find the first circuit element under the user's mouse
   * @returns The CircuitElement under the user's mouse, if any
   */
  getElementAtMouse(): CircuitElement | null {
    const pos = this.zui.clientToSurface(this.mousePos.x, this.mousePos.y);

    for (const [, element] of Object.entries(this.elements)) {
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
        // TODO(radu): Determine if there is an IO pin under the mouse and start the connect action
      }
    }
  }

  onMouseUp(event: MouseEvent) {
    if (event.button === MOUSE_LEFT_BUTTON) {
      if (this.toolState === EditorToolState.Panning) {
        this.stopPanning();
      } else if (this.toolState === EditorToolState.MovingElement) {
        this.stopMovingElement();
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
