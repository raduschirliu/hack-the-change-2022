import elementDefinitions from '../../circuit/circuitElementDefinitions';
import { CircuitElementDefinition } from '../../types';

interface IProps {
  circuitElement: CircuitElementDefinition;
  onClicked: (label: string) => void;
}

const buttonClasses =
  'hover:opacity-70 inline-block w-full py-10 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out';

export function PartButton({ circuitElement, onClicked }: IProps) {
  // const colorClass = `bg-[${circuitElement.color}]`;

  return (
    <button
      type="button"
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      className={buttonClasses}
      title={circuitElement.label}
      style={{ backgroundColor: circuitElement.color }}
      onClick={() => {
        onClicked(circuitElement.typeId);
      }}
    >
      {circuitElement.label}
      {/* if we want SVGs in the future: make a map from button label to svg, call it in here */}
      {/* <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download"
        className="w-3 mx-auto" role="img" xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512">
        <path fill="currentColor"
          d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z">
        </path>
      </svg> */}
    </button>
  );
}
