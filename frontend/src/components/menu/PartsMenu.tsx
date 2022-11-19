import { PartButton } from './PartButton';

const parts = ['AND', 'OR', 'XOR', 'NOR', '0', '1', 'light', 'switch'];

export function PartsMenu() {

  const onClick = (label: string) => {
    console.log(label + " added.");
  };

  return (
    <div className="w-60 h-full shadow-md bg-white px-2 absolute">
      <div className="grid grid-cols-2 mt-12 text-center gap-4">
        {parts.map((part) => {
          return (
            <div key={part}>
              <PartButton label={part} onClicked={onClick}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
