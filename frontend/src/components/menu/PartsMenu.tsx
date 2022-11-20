import { PartButton } from './PartButton';
import elementDefinitions from '../../circuit/circuitElementDefinitions';
import { buildCircuitElement } from '../../circuit/circuitElement';
import { addCircuitElement } from '../../app/reducers/documentSlice';
import { useAppDispatch } from '../../app/hooks';
import { ClientMessageCreateData } from '../../types';

interface IPartsMenuProps {
  createCallback: (update: ClientMessageCreateData) => void;
}

const PartsMenu: React.FC<IPartsMenuProps> = (props: IPartsMenuProps) => {
  const dispatch = useAppDispatch();

  const onClick = (id: string) => {
    const elem = buildCircuitElement(id);

    if (!elem) {
      console.error('Invalid element created for type ', id);
      return;
    }

    dispatch(addCircuitElement(elem));
    props.createCallback(elem);
  };

  return (
    <div className="w-full h-full shadow-md bg-cyan-50 px-2">
      <div className="grid grid-cols-2 mt-12 text-center gap-4">
        {Object.entries(elementDefinitions).map(([id, part]) => {
          if (part.visibleInToolbox === undefined || !part.visibleInToolbox)
            return null;

          return (
            <div key={id}>
              <PartButton circuitElement={part} onClicked={onClick} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartsMenu;
