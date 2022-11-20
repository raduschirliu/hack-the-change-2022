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
    <div className="bg-cyan-100">
      <LandNav />
      {/* <!-- Jumbotron --> */}
      <div className="h-screen p-6 shadow-lg rounded-lg bg-cyan-100 text-gray-700">
        <div className="flex flex-row justify-center">
          <img src={circuitPic} alt="circuit" className="w-1/3 p-5" />
          <div className="flex flex-col justify-center max-w-md">
            <h2 className="text-center text-3xl mb-5">
              Welcome to our multiplayer digital circuit builder!
              <br />
              <br />A simple and fun way for teaching the beginnings of
              electrical engineering.
            </h2>
          </div>
        </div>
        <hr className="my-6 border-gray-300" />
        <div className="flex flex-row justify-center space-x-16">
          <div className="flex flex-col items-center w-1/3 space-y-2">
            <h1 className="font-semibold text-xl">Made for Kids and Teens</h1>
            <p>
              We created Wired Minds with elementary and juniour high students
              in mind. Our simple block connection design makes concepts easy to
              grasp and fun to try out! Recently, there have been tons of
              resources available for early Software Engineering learning. Our
              hope is to provide a similar set of resources for Electrical
              Engineering, continuing to inspire interest in STEM careers from
              an early age.
            </p>
          </div>
          <div className="flex flex-col items-center w-1/3 space-y-2">
            <h1 className="font-semibold text-xl">Made for Teachers</h1>
            <p>
              Wired Minds replaces the need for costly and fragile circuitry
              kits and can be ran for FREE on any computer (including
              ChromeBooks). Our online circuitry builder also allows students to
              "take home" their circuits, keeping the learning going beyond the
              classroom. Best of all, unlike competitors, Wired Minds allows for
              unlimited users to collaborate on one document, enabling
              collaboration and group-work!
            </p>
          </div>
        </div>
        <hr className="my-6 border-gray-300" />
        <div className="flex justify-center">
          <p className="text-xs">Made with ❤️ by webbrothers</p>
        </div>
      </div>
      {/* <!-- End jumbotron --> */}
    </div>
  );
}
