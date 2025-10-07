import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { Interest } from '@meetmates/types';
import { motion } from 'framer-motion';
import { MapPin, Users, Check, Save, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

const INTERESTS: Interest[] = [
  'sports',
  'coding',
  'religion',
  'food',
  'nature',
  'photography',
  'music',
  'art',
  'travel',
  'reading',
  'gaming',
  'fitness',
  'cooking',
  'dancing',
  'hiking',
  'yoga',
  'volunteering',
  'entrepreneurship',
  'education',
  'technology',
];

const INTEREST_LABELS: Record<Interest, string> = {
  sports: 'Sports',
  coding: 'Coding',
  religion: 'Religion',
  food: 'Food',
  nature: 'Nature',
  photography: 'Photography',
  music: 'Music',
  art: 'Art',
  travel: 'Travel',
  reading: 'Reading',
  gaming: 'Gaming',
  fitness: 'Fitness',
  cooking: 'Cooking',
  dancing: 'Dancing',
  hiking: 'Hiking',
  yoga: 'Yoga',
  volunteering: 'Volunteering',
  entrepreneurship: 'Entrepreneurship',
  education: 'Education',
  technology: 'Technology',
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedInterests(user.interests || []);
      setRadius(user.radiusKm || 10);
      if (user.location) {
        setLocation({
          lat: user.location.latitude,
          lng: user.location.longitude,
        });
      }
    }
  }, [user]);

  const handleInterestToggle = (interest: Interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter it manually.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleSave = async () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest.');
      return;
    }

    if (!user?.id) {
      alert('User not found. Please log in again.');
      return;
    }

    setIsSaving(true);
    
    try {
      // Update user in database
      const updatedUser = await api.updateUser(user.id, {
        interests: selectedInterests,
        radiusKm: radius,
        location: location ? {
          latitude: location.lat,
          longitude: location.lng,
          lastUpdated: new Date(),
        } : undefined,
      });

      // Update local state
      updateUser({
        interests: selectedInterests,
        radiusKm: radius,
        location: location ? {
          latitude: location.lat,
          longitude: location.lng,
          lastUpdated: new Date(),
        } : undefined,
      });

      alert('Settings saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = selectedInterests.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage your preferences and profile
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Interests
                </CardTitle>
                <CardDescription>
                  Select your interests to help us find better matches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTERESTS.map((interest) => (
                    <Button
                      key={interest}
                      variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleInterestToggle(interest)}
                      className="justify-start"
                    >
                      {selectedInterests.includes(interest) && (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {INTEREST_LABELS[interest]}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {selectedInterests.length} of {INTERESTS.length} selected
                  {selectedInterests.length < 3 && ' (minimum 3 required)'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Radius */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Search Radius</CardTitle>
                <CardDescription>
                  How far are you willing to travel to meet new people?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {radius} km
                  </div>
                  <p className="text-muted-foreground">
                    Maximum distance for meeting new people
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius">Radius (kilometers)</Label>
                  <Input
                    id="radius"
                    type="range"
                    min="1"
                    max="50"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 25].map((value) => (
                    <Button
                      key={value}
                      variant={radius === value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRadius(value)}
                    >
                      {value} km
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Location
                </CardTitle>
                <CardDescription>
                  Help us suggest nearby venues and find local friends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!location ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleLocationRequest}
                      disabled={isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Getting your location...
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 mr-2" />
                          Use My Current Location
                        </>
                      )}
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      or
                    </div>
                    <div className="text-center">
                      <Button variant="outline" size="lg" className="w-full">
                        Enter Location Manually
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                      <Check className="h-4 w-4" />
                      <span>Location detected successfully!</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleLocationRequest}
                      disabled={isLoading}
                    >
                      Update Location
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-end"
          >
            <Button
              onClick={handleSave}
              disabled={!canSave || isSaving}
              size="lg"
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
