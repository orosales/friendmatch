import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';
import { Interest } from '@meetmates/types';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Settings, 
  Edit3,
  Save,
  X,
  Check,
  Camera,
  Heart,
  Users,
  Calendar,
  MapPin as MapPinIcon
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

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    interests: user?.interests || [],
    radiusKm: user?.radiusKm || 10,
  });

  const handleEdit = () => {
    setEditData({
      name: user?.name || '',
      interests: user?.interests || [],
      radiusKm: user?.radiusKm || 10,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser(editData);
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      interests: user?.interests || [],
      radiusKm: user?.radiusKm || 10,
    });
    setIsEditing(false);
  };

  const handleInterestToggle = (interest: Interest) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

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
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your profile and preferences
              </p>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${user.verified ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm text-muted-foreground">
                        {user.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Provider */}
                <div>
                  <Label>Sign-in Method</Label>
                  <div className="flex items-center mt-1">
                    {user.provider === 'google' ? (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                        </svg>
                        <span className="text-sm text-muted-foreground">Google</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="text-sm text-muted-foreground">Facebook</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Interests
                </CardTitle>
                <CardDescription>
                  {isEditing ? 'Select your interests to find better matches' : 'Your selected interests'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {INTERESTS.map((interest) => (
                        <Button
                          key={interest}
                          variant={editData.interests.includes(interest) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInterestToggle(interest)}
                          className="justify-start"
                        >
                          {editData.interests.includes(interest) && (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          {INTEREST_LABELS[interest]}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {editData.interests.length} interests selected
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {INTEREST_LABELS[interest]}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Radius */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Location & Radius
                </CardTitle>
                <CardDescription>
                  Your search radius for finding matches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Search Radius</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        type="range"
                        min="1"
                        max="50"
                        value={editData.radiusKm}
                        onChange={(e) => setEditData(prev => ({ ...prev, radiusKm: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 km</span>
                        <span className="font-medium">{editData.radiusKm} km</span>
                        <span>50 km</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.radiusKm} kilometers
                    </p>
                  )}
                </div>
                
                {user.location && (
                  <div>
                    <Label>Current Location</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.location.latitude.toFixed(4)}, {user.location.longitude.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {user.location.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Matches</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-xs text-muted-foreground">Invites</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">8</div>
                  <div className="text-xs text-muted-foreground">Events Attended</div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Availability
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <X className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
