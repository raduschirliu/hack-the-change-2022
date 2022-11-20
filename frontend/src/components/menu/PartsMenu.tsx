import { PartButton } from './PartButton';
import elementDefinitions from '../../circuit/circuitElementDefinitions';
import { buildCircuitElement } from '../../circuit/circuitElement';
import { addCircuitElement } from '../../app/reducers/documentSlice';
import { useAppDispatch } from '../../app/hooks';

export function PartsMenu() {
  const dispatch = useAppDispatch();

  const onClick = (id: string) => {
    const elem = buildCircuitElement(id);

    if (!elem) {
      console.error('Invalid element created for type ', id);
      return;
    }

    dispatch(addCircuitElement(elem));
  };

  return (
    <div className="w-full h-full shadow-md bg-white px-2">
      <div className="grid grid-cols-2 mt-12 text-center gap-4">
        {Object.entries(elementDefinitions).map(([id, part]) => {
          if (!part.visibleInToolbox) return null;

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
