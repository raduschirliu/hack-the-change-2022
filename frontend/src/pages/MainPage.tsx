import { Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { useState } from 'react';

const documentsUrl = `${process.env['REACT_APP_API_URL']}/api/documents`;

export default function RootPage() {
  const [{ data, loading, error }] = useAxios(documentsUrl);
  const [userId, setUserId] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

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
        {data.map((index: any, doc: any) => (
          <Link key={index} to={`/document/${doc.id}`}>
            {doc.id}
          </Link>
        ))}
      </div>
    </div>
  );
}
