import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { Interest, VenueType } from '@meetmates/types';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Coffee,
  BookOpen,
  TreePine,
  Waves,
  Dumbbell,
  Building,
  Theater,
  Wine,
  Book,
  Home,
  Star
} from 'lucide-react';

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

const VENUE_TYPES: { type: VenueType; label: string; icon: React.ReactNode }[] = [
  { type: 'cafe', label: 'Café', icon: <Coffee className="h-4 w-4" /> },
  { type: 'restaurant', label: 'Restaurant', icon: <Wine className="h-4 w-4" /> },
  { type: 'library', label: 'Library', icon: <BookOpen className="h-4 w-4" /> },
  { type: 'park', label: 'Park', icon: <TreePine className="h-4 w-4" /> },
  { type: 'beach', label: 'Beach', icon: <Waves className="h-4 w-4" /> },
  { type: 'gym', label: 'Gym', icon: <Dumbbell className="h-4 w-4" /> },
  { type: 'museum', label: 'Museum', icon: <Building className="h-4 w-4" /> },
  { type: 'theater', label: 'Theater', icon: <Theater className="h-4 w-4" /> },
  { type: 'bookstore', label: 'Bookstore', icon: <Book className="h-4 w-4" /> },
  { type: 'community_center', label: 'Community Center', icon: <Home className="h-4 w-4" /> },
];

const mockVenues = [
  {
    id: '1',
    name: 'Downtown Coffee Co.',
    type: 'cafe' as VenueType,
    address: '123 Main St, Downtown',
    rating: 4.5,
    distance: 0.8,
  },
  {
    id: '2',
    name: 'Central Park',
    type: 'park' as VenueType,
    address: '456 Park Ave, Central',
    rating: 4.8,
    distance: 1.2,
  },
  {
    id: '3',
    name: 'City Library',
    type: 'library' as VenueType,
    address: '789 Library St, Downtown',
    rating: 4.6,
    distance: 1.5,
  },
  {
    id: '4',
    name: 'Beachfront Café',
    type: 'cafe' as VenueType,
    address: '321 Ocean Dr, Beachfront',
    rating: 4.3,
    distance: 2.1,
  },
];

export default function CreateInvitePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    interests: [] as Interest[],
    startTime: '',
    endTime: '',
    radiusKm: user?.radiusKm || 10,
    maxAttendees: 10,
    visibility: 'public' as const,
    venueType: 'cafe' as VenueType,
    selectedVenue: null as typeof mockVenues[0] | null,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: Interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleVenueSelect = (venue: typeof mockVenues[0]) => {
    setFormData(prev => ({ ...prev, selectedVenue: venue }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title.trim() !== '' && formData.description.trim() !== '';
      case 2:
        return formData.interests.length > 0 && formData.startTime !== '';
      case 3:
        return formData.selectedVenue !== null;
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

  const handleSubmit = async () => {
    if (!canProceed()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/invites');
    }, 2000);
  };

  const filteredVenues = mockVenues.filter(venue => 
    venue.type === formData.venueType &&
    venue.distance <= formData.radiusKm
  );

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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create New Invite
          </h1>
          <p className="text-muted-foreground">
            Plan a meetup and find people who share your interests
          </p>
        </motion.div>

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
                {step === 1 && 'What\'s your invite about?'}
                {step === 2 && 'When and who can join?'}
                {step === 3 && 'Where should you meet?'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Give your invite a catchy title and description.'}
                {step === 2 && 'Set the date, time, and interests for your invite.'}
                {step === 3 && 'Choose a venue that works for everyone.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Coffee & Code Meetup"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <textarea
                      id="description"
                      placeholder="Describe what you'll be doing and what to expect..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      min="2"
                      max="50"
                      value={formData.maxAttendees}
                      onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Schedule & Interests */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time (optional)</Label>
                      <Input
                        id="endTime"
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Interests *</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select interests to help us find the right people
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {INTERESTS.map((interest) => (
                        <Button
                          key={interest}
                          variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInterestToggle(interest)}
                          className="justify-start"
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formData.interests.length} interests selected
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="radius">Search Radius (km)</Label>
                    <Input
                      id="radius"
                      type="range"
                      min="1"
                      max="50"
                      value={formData.radiusKm}
                      onChange={(e) => handleInputChange('radiusKm', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 km</span>
                      <span className="font-medium">{formData.radiusKm} km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Venue Selection */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Venue Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                      {VENUE_TYPES.map((venue) => (
                        <Button
                          key={venue.type}
                          variant={formData.venueType === venue.type ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInputChange('venueType', venue.type)}
                          className="flex flex-col h-auto py-3"
                        >
                          {venue.icon}
                          <span className="text-xs mt-1">{venue.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Suggested Venues</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your location and preferences
                    </p>
                    <div className="space-y-3">
                      {filteredVenues.map((venue) => (
                        <div
                          key={venue.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.selectedVenue?.id === venue.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleVenueSelect(venue)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                {VENUE_TYPES.find(v => v.type === venue.type)?.icon}
                              </div>
                              <div>
                                <h4 className="font-medium">{venue.name}</h4>
                                <p className="text-sm text-muted-foreground">{venue.address}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">{venue.rating}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{venue.distance} km away</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                    onClick={handleSubmit}
                    disabled={!canProceed() || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Invite
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        {formData.title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <CardDescription>This is how your invite will appear to others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{formData.title}</h3>
                  <p className="text-muted-foreground">{formData.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  {formData.selectedVenue && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formData.selectedVenue.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
