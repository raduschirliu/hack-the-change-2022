import { CircuitDocument } from '../types';
import { Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { clearUser } from '../app/reducers/user';

const documentsUrl = `${process.env['REACT_APP_API_URL']}/api/documents`;

export default function RootPage() {
  const dispatch = useAppDispatch();
  const [{ data, loading, error }] = useAxios<CircuitDocument[]>(documentsUrl);
  const [userId, setUserId] = useState('');

  const onLogoutPress = () => {
    console.log('Logout req');
    dispatch(clearUser());
  };

  return (
    <div>
      <h1>Circuit App</h1>
      <p>Made with ❤️ by webbrothers</p>
      <label>
        User
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </label>
      <h3>Documents</h3>
      <div>
        {loading || data === undefined ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error! {error.message}</p>
        ) : (
          data.map((doc, index) => (
            <div key={index}>
              <Link key={index} to={`/document/${doc.uuid}`}>
                {doc.uuid}
              </Link>
            </div>
          ))
        )}
      </div>
      <button onClick={onLogoutPress}>Log Out</button>
    </div>
  );
}
