
import React from 'react';
import { LogoIcon, GoogleIcon } from './IconComponents';
import type { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {

  const handleGoogleLogin = () => {
    // In a real application, this would be the callback from a Google Sign-In library.
    // For this demo, we'll create a mock user object.
    const mockUser: User = {
      name: 'BCA Student',
      email: 'student@bca.edu',
      // Using a placeholder avatar service for a consistent profile picture
      picture: `https://ui-avatars.com/api/?name=BCA+Student&background=3b82f6&color=fff&size=128`,
    };
    onLogin(mockUser);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm p-8 text-center bg-surface rounded-2xl shadow-2xl shadow-primary/10">
        <div className="flex flex-col items-center">
          <LogoIcon className="w-20 h-20 text-primary" />
          <h1 className="mt-4 text-4xl font-bold text-text-primary">BCA Genius</h1>
          <p className="mt-2 text-text-secondary">Your AI Partner for Computer Science</p>
        </div>
        <div className="mt-12">
          <button
            onClick={handleGoogleLogin}
            className="group w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-300"
          >
            <GoogleIcon className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
        <p className="mt-8 text-xs text-text-secondary">
          Sign in to begin your personalized learning session.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;