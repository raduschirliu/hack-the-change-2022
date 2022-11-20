import { CircuitDocument } from '../types';
import { Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { useCallback, useState } from 'react';
import { JoinNav } from '../components/join/JoinNav';
import { CircuitList } from '../components/join/CircuitList';
import { useAppDispatch } from '../app/hooks';
import { clearUser } from '../app/reducers/user';
import { LandNav } from '../components/landing/LandNav';
import circuitPic from '../res/circuit.png';

const getDocumentsUrl = `${process.env['REACT_APP_API_URL']}/api/documents`;

{
  /* <Link to={'/sign-up'}>Sign Up</Link>
<Link to={'/sign-in'}>Sign In</Link> */
}

export default function Landing() {
  return (
    <div>
      <LandNav />
      {/* <!-- Jumbotron --> */}
      <div className="h-full p-6 shadow-lg rounded-lg bg-blue-100 text-gray-700">
        <div className="flex flex-row justify-center">
          <img src={circuitPic} alt="circuit" className="w-1/3 p-5" />
          <div className="flex flex-col justify-center max-w-md">
            <h2 className="text-center font-semibold text-3xl mb-5">
              Welcome to our multi-player digital circuit builder!
              <br />
              <br />
              Made for teaching kids the beginnings of electrical engineering.
            </h2>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />
        {/* Create new circuit */}
        <p className="text-center">A description of our app here...</p>
        <hr className="my-6 border-gray-300" />
        <p className="text-xs">Made with ❤️ by webbrothers</p>
      </div>
      {/* <!-- End jumbotron --> */}
    </div>
  );
}
