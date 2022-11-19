import useAxios from 'axios-hooks';

const documentsUrl = `http://${process.env['REACT_APP_API_URL']}/api/documents`;

export default function RootPage() {
  const [{ data, loading, error }] = useAxios(documentsUrl);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  return (
    <div>
      <h1>Documents</h1>
      <ul>
        {data.map((index: any, doc: any) => (
          <li key={index}>{doc.id}</li>
        ))}
      </ul>
    </div>
  );
}
