import { PartButton } from './PartButton';
import elementDefinitions from '../../circuit/circuitElementDefinitions';

export function PartsMenu() {
  const onClick = (id: string) => {
    console.log(id + ' added.');
  };

  return (
    <div className="w-full h-full shadow-md bg-white px-2">
      <div className="grid grid-cols-2 mt-12 text-center gap-4">
        {Object.entries(elementDefinitions).map(([id, part]) => {
          return (
            <div key={id}>
              <PartButton circuitElement={part} onClicked={onClick} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
