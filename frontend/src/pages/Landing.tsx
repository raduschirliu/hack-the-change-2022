import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div>
      <Link to={'/sign-up'}>Sign Up</Link>
      <Link to={'/sign-in'}>Sign In</Link>
    </div>
  );
};

export default Landing;
