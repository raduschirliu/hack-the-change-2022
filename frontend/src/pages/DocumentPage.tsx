import CircuitCanvas from '../components/circuit-canvas/CircuitCanvas';

export default function DocumentPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-row bg-red-400">
        <p>hello im a nav bar</p>
        <p>hello im a nav bar</p>
        <p className="ml-auto justify-end">right side</p>
      </div>
      <CircuitCanvas />
    </div>
  );
}
