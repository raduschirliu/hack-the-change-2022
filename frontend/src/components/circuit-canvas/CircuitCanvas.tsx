import React, { useEffect, useRef } from 'react';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';

// @ts-ignore
type Group = Two.Group;
// @ts-ignore
type Vector = Two.Vector;

const MOUSE_LEFT_BUTTON = 0;
const MOUSE_MIDDLE_BUTTON = 1;

interface ITwoRef {
  two: Two;
  stage: Group;
  overlay: Group;
  mousePos: Vector;
  isMoving: boolean;
  zui: ZUI;
}

export default function CircuitCanvas() {
  const twoDivRef = useRef<HTMLDivElement | null>(null);
  let twoRef = useRef<ITwoRef | null>(null);

  // Redraw the canvas
  function draw() {
    if (!twoRef.current) return;
    const two = twoRef.current.two;

    two.update();
    two.render();

    requestAnimationFrame(draw);
  }

  function convertMousePos(event: MouseEvent): Vector {
    if (!twoRef.current) return;
    const rect: DOMRect =
      twoRef.current.two.renderer.domElement.getBoundingClientRect();

    return new Two.Vector(event.clientX - rect.left, event.clientY - rect.top);
  }

  function onMouseDown(event: MouseEvent) {
    if (!twoRef.current) return;
    const state = twoRef.current;

    const pos = convertMousePos(event);

    if (event.button === MOUSE_LEFT_BUTTON) {
      // Left click
      const surfacePos = state.zui.clientToSurface(pos.x, pos.y);
      const shape = new Two.Rectangle(surfacePos.x, surfacePos.y, 50, 50);
      shape.stroke = 'red';
      state.stage.add(shape);
    } else if (event.button === MOUSE_MIDDLE_BUTTON) {
      // Middle click
      state.isMoving = true;
    }
  }

  function onMouseUp(event: MouseEvent) {
    if (!twoRef.current) return;
    const state = twoRef.current;

    if (event.button === MOUSE_MIDDLE_BUTTON) {
      // Middle mouse
      state.isMoving = false;
    }
  }

  function onMouseMove(event: MouseEvent) {
    if (!twoRef.current) return;
    const state = twoRef.current;

    const newPos = convertMousePos(event);
    const deltaPos = Two.Vector.sub(newPos, state.mousePos);

    if (state.isMoving) {
      state.zui.translateSurface(deltaPos.x, deltaPos.y);
    }

    state.mousePos = newPos;
  }

  function onMouseWheel(event: WheelEvent) {}

  function onKeyDown(event: KeyboardEvent) {
    if (!twoRef.current) return;
    const state = twoRef.current.zui;

    if (event.key === 'r') {
      state.reset();
      state.updateSurface();
      console.log('reset');
    }
  }

  // Append Two div to the dom
  useEffect(() => {
    if (twoRef.current || !twoDivRef.current) return;

    const two = new Two({ fitted: true, type: Two.Types.canvas }).appendTo(twoDivRef.current);
    const stage = two.makeGroup();
    const overlay = two.makeGroup();

    const zui = new ZUI(stage);
    zui.addLimits(0.06, 8);

    twoRef.current = {
      two,
      stage,
      overlay,
      mousePos: new Two.Vector(0, 0),
      isMoving: false,
      zui,
    };

    requestAnimationFrame(draw);

    console.log('initialized');

    const domElement: HTMLDivElement = two.renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('wheel', onMouseWheel);
    window.addEventListener('keydown', onKeyDown);

    // TODO: Add support for touch inputs
    // domElement.addEventListener('touchstart', touchstart, false);
    // domElement.addEventListener('touchmove', touchmove, false);
    // domElement.addEventListener('touchend', touchend, false);
    // domElement.addEventListener('touchcancel', touchend, false);
  }, []);

  return <div className="w-full h-full" ref={twoDivRef}></div>;
}
