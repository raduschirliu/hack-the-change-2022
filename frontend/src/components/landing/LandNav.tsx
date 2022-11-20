import { ReactComponent as Hand } from '@material-design-icons/svg/filled/back_hand.svg';
import { ReactComponent as Wire } from '@material-design-icons/svg/filled/edit.svg';
import { ReactComponent as Delete } from '@material-design-icons/svg/filled/delete.svg';
import { ReactComponent as Play } from '@material-design-icons/svg/filled/play_arrow.svg';
import { isPropertySignature } from 'typescript';
import logo from '../../res/logo.png';
import { Link } from 'react-router-dom';
import { clearUser } from '../../app/reducers/user';
import { useAppDispatch } from '../../app/hooks';

export function LandNav() {
  return (
    <nav
      className="
        relative
        w-full
        flex flex-row flex-wrap
        items-center
        justify-between
        py-3
        bg-white
        text-gray-500
        shadow-lg
        navbar navbar-expand-lg navbar-light
        gap-x-4
      "
    >
      <img
        src={logo}
        alt="our logo :)"
        className="object-scale-down h-12 ml-4"
        title="Home"
      />
      <p className="-ml-2 text-3xl text-cyan-600 font-semibold">Wired Minds</p>
      <div className="ml-auto mr-4 flex-col space-y-1 space-x-2">
        <Link to="/sign-in">
          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="px-5 bg-violet-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-cyan-400 hover:shadow-lg transition duration-150 ease-in-out"
            title="Logout"
          >
            Login
          </button>
        </Link>
        <Link to="/sign-up">
          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="px-5 bg-violet-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-cyan-400 hover:shadow-lg transition duration-150 ease-in-out"
            title="Logout"
          >
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
