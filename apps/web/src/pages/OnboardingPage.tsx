import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { Interest } from '@meetmates/types';
import { motion } from 'framer-motion';
import { MapPin, Users, Check } from 'lucide-react';
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

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleComplete = async () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest.');
      return;
    }

    const { user } = useAuthStore.getState();
    if (!user?.id) {
      alert('User not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    
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

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      alert('Failed to save your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedInterests.length >= 3;
      case 2:
        return radius > 0;
      case 3:
        return true; // Location is optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of 3
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round((step / 3) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {step === 1 && 'What are you interested in?'}
                {step === 2 && 'How far are you willing to travel?'}
                {step === 3 && 'Where are you located?'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Select at least 3 interests to help us find your perfect matches.'}
                {step === 2 && 'Choose your preferred radius for meeting new people.'}
                {step === 3 && 'Help us suggest nearby venues and find local friends.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Interests */}
              {step === 1 && (
                <div className="space-y-4">
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
                </div>
              )}

              {/* Step 2: Radius */}
              {step === 2 && (
                <div className="space-y-6">
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
                </div>
              )}

              {/* Step 3: Location */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      We need your location to suggest nearby venues and find local friends.
                      Your location is only stored approximately and never shared with other users.
                    </p>
                  </div>
                  
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
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                
                {step < 3 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Completing...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
