import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';

// @ts-ignore
type Group = Two.Group;
// @ts-ignore
type Vector = Two.Vector;

const GRID_SIZE_PX = 10;
const MOUSE_LEFT_BUTTON = 0;
const MOUSE_MIDDLE_BUTTON = 1;
const MOUSE_RIGHT_BUTTON = 2;

class CircuitEditor {
  private two: Two;
  private grid: Group;
  private stage: Group;
  private overlay: Group;
  private mousePos: Vector = new Two.Vector(0, 0);
  private isMoving: boolean = false;
  private zui: ZUI;

  constructor(divRef: HTMLDivElement) {
    this.two = new Two({ fitted: true, type: Two.Types.canvas }).appendTo(
      divRef
    );

    this.grid = this.two.makeGroup();
    this.stage = this.two.makeGroup();
    this.overlay = this.two.makeGroup();

    this.zui = new ZUI(this.stage);
    this.zui.addLimits(0.06, 8);

    console.log('initialized');

    const domElement: HTMLDivElement = this.two.renderer.domElement;
    domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));

    this.draw();

    // TODO: Add support for touch inputs
    // domElement.addEventListener('touchstart', touchstart, false);
    // domElement.addEventListener('touchmove', touchmove, false);
    // domElement.addEventListener('touchend', touchend, false);
    // domElement.addEventListener('touchcancel', touchend, false);
  }

  // Redraw the canvas
  draw() {
    this.two.update();
    this.two.render();

    requestAnimationFrame(this.draw.bind(this));
  }

  // Reset the camera back at (0, 0)
  resetCamera() {
    this.zui.reset();
    this.zui.updateSurface();
    console.log('reset');
  }

  convertMousePos(event: MouseEvent): Vector {
    const rect: DOMRect = this.two.renderer.domElement.getBoundingClientRect();

    return new Two.Vector(event.clientX - rect.left, event.clientY - rect.top);
  }

  onMouseDown(event: MouseEvent) {
    const pos = this.convertMousePos(event);

    if (event.button === MOUSE_LEFT_BUTTON) {
      // Left click
      const surfacePos = this.zui.clientToSurface(pos.x, pos.y);
      const shape = new Two.Rectangle(surfacePos.x, surfacePos.y, 50, 50);
      shape.stroke = 'red';
      this.stage.add(shape);
    } else if (event.button === MOUSE_MIDDLE_BUTTON) {
      // Middle click
      this.isMoving = true;
    }
  }

  onMouseUp(event: MouseEvent) {
    if (event.button === MOUSE_MIDDLE_BUTTON) {
      // Middle mouse
      this.isMoving = false;
    }
  }

  onMouseMove(event: MouseEvent) {
    const newPos = this.convertMousePos(event);
    const deltaPos = Two.Vector.sub(newPos, this.mousePos);

    if (this.isMoving) {
      this.zui.translateSurface(deltaPos.x, deltaPos.y);
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
