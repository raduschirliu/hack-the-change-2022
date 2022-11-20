import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectActiveTool } from '../../app/reducers/documentSlice';
import CircuitEditor from '../../circuit/circuitEditor';

import { CircuitElement } from '../../types';

interface CircuitCanvasProps {
  circuitState: CircuitElement[];
}

export default function CircuitCanvas({ circuitState }: CircuitCanvasProps) {
  const twoDivRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<CircuitEditor | null>(null);
  const activeTool = useAppSelector(selectActiveTool);
  const dispatch = useAppDispatch();

  // Append Two div to the dom
  useEffect(() => {
    if (editorRef.current || !twoDivRef.current) return;

    editorRef.current = new CircuitEditor(twoDivRef.current);
  }, [twoDivRef]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setActiveTool(activeTool);
    }
  }, [editorRef, activeTool]);

  return <div className="w-full h-full" ref={twoDivRef}></div>;
}
