import React, { useEffect, useRef } from 'react';
import CircuitEditor from './CircuitEditor';

export default function CircuitCanvas() {
  const twoDivRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<CircuitEditor | null>(null);

  // Append Two div to the dom
  useEffect(() => {
    if (editorRef.current || !twoDivRef.current) return;

    editorRef.current = new CircuitEditor(twoDivRef.current);
  }, [twoDivRef]);

  return <div className="w-full h-full" ref={twoDivRef}></div>;
}
