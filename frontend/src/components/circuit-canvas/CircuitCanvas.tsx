import React, { useEffect, useRef } from 'react';
import Two from 'two.js';
import { ZUI } from 'two.js/extras/jsm/zui';

// @ts-ignore
type Group = Two.Group;
// @ts-ignore
type Vector = Two.Vector;

interface ITwoRef {
  two: Two;
  stage: Group;
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

  function setupStage() {
    if (!twoRef.current) return;
    const two = twoRef.current.two;

    const zui = new ZUI(twoRef.current.stage);
    const mouse = new Two.Vector();
    const touches = {};
    const distance = 0;
    const dragging = false;
    zui.addLimits(0.06, 8);
  }

  function convertMousePos(event: MouseEvent): Vector {
    if (!twoRef.current) return;
    const rect: DOMRect =
      twoRef.current.two.renderer.domElement.getBoundingClientRect();

    return new Two.Vector(event.clientX - rect.left, event.clientY - rect.top);
  }

  function onMouseDown(event: MouseEvent) {
    if (!twoRef.current) return;

    const pos = convertMousePos(event);

    if (event.button === 0) {
      const shape = new Two.Rectangle(pos.x, pos.y, 50, 50);
      shape.stroke = 'red';
      twoRef.current.stage.add(shape);
    }
  }

  function onMouseMove(event: MouseEvent) {}

  function onMouseWheel(event: WheelEvent) {}

  // Append Two div to the dom
  useEffect(() => {
    if (twoRef.current || !twoDivRef.current) return;

    const two = new Two({ fitted: true }).appendTo(twoDivRef.current);
    const stage = two.makeGroup();

    twoRef.current = {
      two,
      stage,
    };

    requestAnimationFrame(draw);

    console.log('initialized');

    const domElement: HTMLDivElement = two.renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('wheel', onMouseWheel);

    // TODO: Add support for touch inputs
    // domElement.addEventListener('touchstart', touchstart, false);
    // domElement.addEventListener('touchmove', touchmove, false);
    // domElement.addEventListener('touchend', touchend, false);
    // domElement.addEventListener('touchcancel', touchend, false);

    setupStage();
  }, []);

  return <div className="w-full h-full" ref={twoDivRef}></div>;
}
