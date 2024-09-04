import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';

const AuthButtons = ({ isAuthenticated }) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/signin'); // Adjust the path if needed
  };

  const handleSignup = () => {
    router.push('/signup'); // Adjust the path if needed
  };

  return (
    <>
      {isAuthenticated ? (
        <Button color="inherit" onClick={() => router.push('/profile')}>Profile Settings</Button>
      ) : (
        <>
          <Button color="inherit" onClick={handleLogin}>Log In</Button>
          <Button color="inherit" onClick={handleSignup}>Sign Up</Button>
        </>
      )}
    </>
  );
};

export default AuthButtons;
