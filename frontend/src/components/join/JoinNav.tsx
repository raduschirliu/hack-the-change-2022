import { ReactComponent as Hand } from '@material-design-icons/svg/filled/back_hand.svg';
import { ReactComponent as Wire } from '@material-design-icons/svg/filled/edit.svg';
import { ReactComponent as Delete } from '@material-design-icons/svg/filled/delete.svg';
import { ReactComponent as Play } from '@material-design-icons/svg/filled/play_arrow.svg';
import { isPropertySignature } from 'typescript';
import logo from '../../res/logo.png';
import { Link } from 'react-router-dom';
import { clearUser } from '../../app/reducers/user';
import { useAppDispatch } from '../../app/hooks';


export function JoinNav() {
    
  const dispatch = useAppDispatch();

    const onLogoutPress = () => {
        console.log('Logout req');
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
        bg-white
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
          className="object-scale-down h-12 ml-4"
          title="Home"
        />
      </Link>
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
