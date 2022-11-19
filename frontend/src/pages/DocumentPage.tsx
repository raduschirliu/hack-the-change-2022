import CircuitCanvas from '../components/circuit-canvas/CircuitCanvas';

export default function DocumentPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex bg-red-400">
        <p>hello im a nav bar</p>
      </div>
      <CircuitCanvas />
    </div>
  );
}
