import React, { useEffect, useRef } from 'react';
import CircuitEditor from './CircuitEditor';

import { CircuitElement } from '../../types';

interface CircuitCanvasProps {
  circuitState: CircuitElement[];
  addComponent: (type: string) => void;
  setToolMode: (toolMode: string) => void;
}

export default function CircuitCanvas({
  circuitState,
  addComponent,
  setToolMode,
}: CircuitCanvasProps) {
  const twoDivRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<CircuitEditor | null>(null);

  // Append Two div to the dom
  useEffect(() => {
    if (editorRef.current || !twoDivRef.current) return;

    editorRef.current = new CircuitEditor(twoDivRef.current);
  }, [twoDivRef]);

  return <div className="w-full h-full" ref={twoDivRef}></div>;
}
