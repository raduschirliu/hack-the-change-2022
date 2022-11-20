import { CircuitDocument } from '../types';
import { Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { useCallback, useState } from 'react';
import { JoinNav } from '../components/join/JoinNav';
import { CircuitList } from '../components/join/CircuitList';
import { useAppDispatch } from '../app/hooks';
import { clearUser } from '../app/reducers/user';

const getDocumentsUrl = `${process.env['REACT_APP_API_URL']}/api/documents`;

export default function JoinPage() {
  const [
    { data: documents, loading: documentsLoading, error: documentsError },
  ] = useAxios<CircuitDocument[]>(getDocumentsUrl);

  const [circuitName, setCircuitName] = useState('');

  return (
    <div>
      <JoinNav />
      {/* <!-- Jumbotron --> */}
      <div className="h-full p-6 shadow-lg rounded-lg bg-cyan-50 text-gray-700">
        <h2 className="text-center font-semibold text-3xl mb-5">
          Welcome back to Wired Minds!
        </h2>
        <hr className="my-6 border-gray-300" />
        {/* Create new circuit */}
        <p className="text-center">Start a new multiplayer circuit...</p>
        <br />
        <div className="flex justify-center">
          <div className="mb-3 w-96">
            <input
              type="text"
              className="
                form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                m-0
                focus:text-gray-700 focus:bg-white focus:border-violet-600 focus:outline-none
              "
              id="exampleText0"
              placeholder="Name of your new circuit"
              value={circuitName}
              onChange={(e) => setCircuitName(e.target.value)}
            />
            <div className="mt-1.5 flex justify-center">
              <button
                type="button"
                className="block px-6 py-2.5 bg-violet-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-cyan-400 hover:shadow-lg focus:bg-cyan-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-cyan-400 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => {
                  // TODO: make axios request to make document
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-300" />
        {/* Join existing circuit */}
        <p className="text-center">Or open an existing circuit...</p>
        <br />
        <CircuitList
          documentList={documents}
          loading={documentsLoading}
          error={documentsError}
        />
        <hr className="my-6 border-gray-300" />
        <p className="text-xs">Made with ❤️ by webbrothers</p>
      </div>
      {/* <!-- End jumbotron --> */}
    </div>
  );
}
