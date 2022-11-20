import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectAuth } from '../app/reducers/user';

interface IProtectedPageProps {
  children: JSX.Element;
}

const ProtectedPage: React.FC<IProtectedPageProps> = (
  props: IProtectedPageProps
) => {
  const user = useAppSelector(selectAuth);

  return user === undefined ? <Navigate to={'/sign-in'} /> : props.children;
};

export default ProtectedPage;
