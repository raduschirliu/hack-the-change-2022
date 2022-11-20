import {
  selectActiveTool,
  setActiveTool,
} from '../../app/reducers/documentSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { ReactComponent as Delete } from '@material-design-icons/svg/filled/delete.svg';
import { EditorTool } from '../../circuit/circuitEditor';
import { ReactComponent as Hand } from '@material-design-icons/svg/filled/back_hand.svg';
import { Link } from 'react-router-dom';
import { ReactComponent as Play } from '@material-design-icons/svg/filled/play_arrow.svg';
import { ReactComponent as Wire } from '@material-design-icons/svg/filled/edit.svg';
import { clearUser } from '../../app/reducers/user';
import logo from '../../res/logo.png';

interface IProps {
  documentId: string;
  onPlayClick: () => void;
}

const buttonClasses =
  'ml-4 inline-block px-5 py-5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-violet-500 hover:shadow-lg focus:bg-violet-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-violet-500 active:shadow-lg transition duration-150 ease-in-out';

export function ToolsMenu({ documentId, onPlayClick }: IProps) {
  const activeTool = useAppSelector(selectActiveTool);
  const dispatch = useAppDispatch();

  function getButtonClass(tool: EditorTool): string {
    return `${buttonClasses} ${
      tool === activeTool ? 'bg-violet-500' : 'bg-gray-300'
    }`;
  }

  const onLogoutPress = () => {
    dispatch(clearUser());
  };

  return (
    <nav
      className="
        relative
        w-full
        flex flex-row flex-wrap
        items-center
        justify-between
        py-3
        bg-cyan-50
        text-gray-500
        hover:text-gray-700
        focus:text-gray-700
        shadow-md
        navbar navbar-expand-lg navbar-light
        gap-x-4
      "
    >
      <Link to="/home">
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
        className={getButtonClass(EditorTool.Move)}
        title="Move"
        onClick={() => dispatch(setActiveTool(EditorTool.Move))}
      >
        <Hand className="fill-white" />
      </button>
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className={getButtonClass(EditorTool.Connect)}
        title="Wire Drawer"
        onClick={() => dispatch(setActiveTool(EditorTool.Connect))}
      >
        <Wire className="fill-white" />
      </button>
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className={getButtonClass(EditorTool.Erase)}
        title="Delete"
        onClick={() => dispatch(setActiveTool(EditorTool.Erase))}
      >
        <Delete className="fill-white" />
      </button>
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        title="Run Simulation"
        className={getButtonClass(EditorTool.Simulate)}
        // onClick={() => dispatch(setActiveTool(EditorTool.Simulate))}
        onClick={onPlayClick}
      >
        <Play className="fill-white" />
      </button>
      <div className="ml-auto mr-4 flex-col space-y-1">
        <button
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="px-5 bg-gray-300 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-violet-500 hover:shadow-lg transition duration-150 ease-in-out"
          title="Logout"
          onClick={onLogoutPress}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
