import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function CallbackHandler() {
  const navigate = useNavigate();
  const { handleCallback } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/?error=' + error);
      return;
    }

    if (code) {
      handleCallback(code)
        .then(() => {
          navigate('/dashboard');
        })
        .catch((error: any) => {
          console.error('Callback error:', error);
          navigate('/?error=callback_failed');
        });
    } else {
      navigate('/?error=no_code');
    }
  }, [handleCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}