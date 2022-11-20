import { CircuitDocument } from '../../types';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';

interface IProps {
  documentList: CircuitDocument[] | undefined;
  loading: boolean;
  error: AxiosError<any, any> | null;
}

export function CircuitList({ documentList, loading, error }: IProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
        {loading || documentList === undefined ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error! {error.message}</p>
        ) : (
          documentList.map((doc, index) => (
            // <Link key={index} to={`/document/${doc.uuid}`}>
            //   {doc.name + '\n'}
            // </Link>
            <Link
              key={index}
              to={`/document/${doc.uuid}`}
              className="
                block
                px-6
                py-2
                border-b border-gray-200
                w-full
                hover:bg-gray-100 hover:text-gray-500
                focus:outline-none focus:ring-0 focus:bg-gray-200 focus:text-gray-600
                transition
                duration-500
                cursor-pointer
              "
            >
              {doc.name}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
