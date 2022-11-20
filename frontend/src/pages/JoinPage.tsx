import { CircuitDocument } from '../types';
import { Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { useState } from 'react';

const documentsUrl = `${process.env['REACT_APP_API_URL']}/api/documents`;

export default function JoinPage() {
  const [{ data, loading, error }] = useAxios<CircuitDocument[]>(documentsUrl);
  const [userId, setUserId] = useState('');

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
            <Link key={index} to={`/document/${doc.uuid}`}>
              {doc.uuid}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
