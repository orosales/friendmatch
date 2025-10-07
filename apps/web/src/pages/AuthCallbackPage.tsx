import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Simple JWT decoder (for demo purposes)
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const provider = searchParams.get('provider');

        if (!token) {
          throw new Error('No authentication token received');
        }

        // Decode the JWT token to get the user id (sub) and fetch full user from API
        const tokenPayload = decodeJWT(token);
        if (!tokenPayload || !tokenPayload.sub) {
          throw new Error('Invalid authentication token');
        }

        // Fetch the latest user from the backend to know if setup was completed
        const freshUser = await api.getUser(tokenPayload.sub);

        login({ ...freshUser, provider: provider as 'google' | 'facebook' });
        setUserName(freshUser.name);
        setStatus('success');

        // Redirect based on whether onboarding is complete
        const hasCompletedSetup = Array.isArray(freshUser.interests) && freshUser.interests.length > 0;
        setTimeout(() => {
          navigate(hasCompletedSetup ? '/dashboard' : '/onboarding');
        }, 1000);

      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [searchParams, login, navigate]);

  const handleRetry = () => {
    navigate('/');
  };

  const handleContinue = () => {
    // If user already finished setup, send to dashboard; otherwise to onboarding
    const { user } = useAuthStore.getState();
    const hasCompletedSetup = !!user && Array.isArray(user.interests) && user.interests.length > 0;
    navigate(hasCompletedSetup ? '/dashboard' : '/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 mb-4">
              {status === 'loading' && (
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="w-16 h-16 text-green-500" />
              )}
              {status === 'error' && (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && `Welcome to MeetMates, ${userName}!`}
              {status === 'error' && 'Authentication Failed'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Please wait while we complete your authentication.'}
              {status === 'success' && 'You have been successfully authenticated. Redirecting...'}
              {status === 'error' && error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'success' && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Preparing your account...</p>
                <Button onClick={handleContinue} className="w-full">
                  Continue
                </Button>
              </div>
            )}
            {status === 'error' && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  There was a problem with your authentication. Please try again.
                </p>
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
