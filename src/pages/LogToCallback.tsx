import { useHandleSignInCallback } from '@logto/react';
import { useNavigate } from 'react-router';

const  LogToCallback = () => {
  const navigator = useNavigate();
  const { isLoading } = useHandleSignInCallback(() => {
    // Navigate to root path when finished
    navigator('/');
  });

  // When it's working in progress
  if (isLoading) {
    return <div>Redirecting...</div>;
  }

  return null;
}

export default LogToCallback;
