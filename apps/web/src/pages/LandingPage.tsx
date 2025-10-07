import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { Users, MapPin, Calendar, Shield, Coffee, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to Google OAuth and force account chooser
      window.location.href = 'http://localhost:3001/api/auth/google?prompt=select_account';
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to Facebook OAuth
      window.location.href = 'http://localhost:3001/api/auth/facebook';
    } catch (error) {
      console.error('Facebook login error:', error);
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Spontaneous Meetups',
      description: 'Discover instant meetups happening near you right now.',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Nearby Friends',
      description: 'Find people in your area who share your interests and are available.',
    },
    {
      icon: <Coffee className="h-6 w-6" />,
      title: 'Casual Connections',
      description: 'Create instant connections for coffee, activities, or casual hangouts.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Safe & Private',
      description: 'Your privacy is our priority. Only meet in public places.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Users className="h-8 w-8 text-primary" />
              <Coffee className="h-4 w-4 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
            </div>
            <span className="text-2xl font-bold text-foreground">MeetMates</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Privacy
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Spontaneous
              <span className="text-primary"> Connections</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover spontaneous meetups happening near you. Find friends who share your interests
              and create instant connections for coffee, activities, or casual hangouts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            <Button
              size="lg"
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="bg-[#1877F2] text-white hover:bg-[#166FE5]"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </Button>
          </motion.div>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-2 text-muted-foreground"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              <span>Signing you in...</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose MeetMates?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We make it easy and safe to find friends who share your interests and are located nearby.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-primary/5 rounded-2xl p-12"
        >
          <div className="relative mx-auto mb-6 w-16 h-16">
            <Users className="h-16 w-16 text-primary" />
            <Coffee className="h-6 w-6 text-primary absolute -bottom-1 -right-1 bg-background rounded-full p-1" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready for Spontaneous Connections?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover instant meetups happening near you. Find friends who share your interests
            and create spontaneous connections for coffee, activities, or casual hangouts.
          </p>
          <Button size="lg" onClick={handleGoogleLogin} disabled={isLoading}>
            Get Started Now
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 MeetMates. Made with ❤️ for building connections.</p>
        </div>
      </footer>
    </div>
  );
}
