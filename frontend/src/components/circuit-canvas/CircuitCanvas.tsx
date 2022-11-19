import { CircuitElement } from '../../types';

interface CircuitCanvasProps {
  circuitState: CircuitElement[];
}

export default function CircuitCanvas({ circuitState }: CircuitCanvasProps) {
  return <p>canvas</p>;
}
