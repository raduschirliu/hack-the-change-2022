import { ReactComponent as Hand } from '@material-design-icons/svg/filled/back_hand.svg';
import { ReactComponent as Wire } from '@material-design-icons/svg/filled/edit.svg';
import { ReactComponent as Delete } from '@material-design-icons/svg/filled/delete.svg';
import { ReactComponent as Play } from '@material-design-icons/svg/filled/play_arrow.svg';
import { isPropertySignature } from 'typescript';
import logo from '../../res/logo.png';
import { Link } from 'react-router-dom';

interface IProps {
  documentId: string;
}

export function ToolsMenu({ documentId }: IProps) {
  return (
    <nav
      className="
        relative
        w-full
        flex flex-row flex-wrap
        items-center
        justify-between
        py-3
        bg-gray-100
        text-gray-500
        hover:text-gray-700
        focus:text-gray-700
        shadow-lg
        navbar navbar-expand-lg navbar-light
        gap-x-4
      "
    >
      <Link to="/">
        <img
          src={logo}
          alt="our logo :)"
          className="object-scale-down h-16 ml-4"
          title="Home"
        />
      </Link>
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className="ml-4 inline-block px-5 py-5 bg-gray-300 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        title="Move"
      >
        <Hand className="fill-white" />
      </button>
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className="ml-2 inline-block px-5 py-5 bg-gray-300 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        title="Wire Drawer"
      >
        <Wire className="fill-white" />
      </button>
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className="ml-2 inline-block px-5 py-5 bg-gray-300 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        title="Delete"
      >
        <Delete className="fill-white" />
      </button>
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className="ml-2 inline-block px-5 py-5 bg-gray-300 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        title="Run Simulation"
      >
        <Play className="fill-white" />
      </button>
      <div className="ml-auto mr-4 flex-col space-y-1">
        <p>Document ID: {documentId}</p>
        <div className="flex justify-end">
          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="px-5 bg-gray-300 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
