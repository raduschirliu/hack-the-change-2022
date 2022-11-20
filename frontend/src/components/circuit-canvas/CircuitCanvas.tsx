import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectActiveTool,
  selectElements,
  updateCircuitElements,
} from '../../app/reducers/documentSlice';
import CircuitEditor from '../../circuit/circuitEditor';

import { CircuitElement, CircuitElementUpdate } from '../../types';

interface CircuitCanvasProps {
  circuitState: CircuitElement[];
}

export default function CircuitCanvas({ circuitState }: CircuitCanvasProps) {
  const twoDivRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<CircuitEditor | null>(null);
  const activeTool = useAppSelector(selectActiveTool);
  const elements = useAppSelector(selectElements);
  const dispatch = useAppDispatch();

  // Append Two div to the dom
  useEffect(() => {
    if (editorRef.current || !twoDivRef.current) return;

    editorRef.current = new CircuitEditor(twoDivRef.current);
    editorRef.current.onCircuitUpdated = (update: CircuitElementUpdate) => {
      console.log('dispatched update', update);
      dispatch(updateCircuitElements([update]));
    };
  }, [twoDivRef, dispatch]);

  // Send active tool to the editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setActiveTool(activeTool);
    }
  }, [editorRef, activeTool]);

  // Send updated elements to the editor
  useEffect(() => {
    if (editorRef.current) {
      // TODO: Does this need to be a deep compare or is this ok?
      editorRef.current.setElements(elements);
    }
  }, [editorRef, elements]);

  return <div className="w-full h-full" ref={twoDivRef}></div>;
}
