import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Heart, 
  Plus, 
  Search,
  TrendingUp,
  Clock,
  Coffee
} from 'lucide-react';

// Mock data for demo
const mockStats = {
  totalMatches: 12,
  activeInvites: 3,
  upcomingEvents: 2,
  newMatches: 4,
};

const mockRecentMatches = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
    sharedInterests: ['photography', 'nature', 'hiking'],
    distance: 2.3,
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Mike Chen',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    sharedInterests: ['coding', 'gaming', 'technology'],
    distance: 1.8,
    lastActive: '5 hours ago',
  },
  {
    id: '3',
    name: 'Emma Davis',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    sharedInterests: ['art', 'music', 'cooking'],
    distance: 3.1,
    lastActive: '1 day ago',
  },
];

const mockUpcomingEvents = [
  {
    id: '1',
    title: 'Coffee & Code Meetup',
    date: 'Tomorrow, 2:00 PM',
    location: 'Downtown Coffee Co.',
    attendees: 8,
    maxAttendees: 12,
  },
  {
    id: '2',
    title: 'Weekend Hiking Adventure',
    date: 'Saturday, 9:00 AM',
    location: 'Mountain Trail Park',
    attendees: 5,
    maxAttendees: 10,
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateInvite = () => {
    navigate('/invites/create');
  };

  const handleViewMatches = () => {
    navigate('/matches');
  };

  const handleViewInvites = () => {
    navigate('/invites');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to meet some amazing people today?
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewMatches}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Find Matches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockStats.totalMatches}</div>
              <p className="text-xs text-muted-foreground">
                People with shared interests nearby
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCreateInvite}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Create Invite</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">+</div>
              <p className="text-xs text-muted-foreground">
                Plan a meetup with new friends
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewInvites}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Invites</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockStats.activeInvites}</div>
              <p className="text-xs text-muted-foreground">
                Active invitations you've created
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Matches */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Recent Matches
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleViewMatches}>
                    View All
                  </Button>
                </div>
                <CardDescription>
                  People who share your interests and are nearby
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <img
                      src={match.photoUrl}
                      alt={match.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {match.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {match.distance} km
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.sharedInterests.slice(0, 2).map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {interest}
                          </span>
                        ))}
                        {match.sharedInterests.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{match.sharedInterests.length - 2} more
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Active {match.lastActive}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    Upcoming Events
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleViewInvites}>
                    View All
                  </Button>
                </div>
                <CardDescription>
                  Events you're attending or hosting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUpcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {event.title}
                        </h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {event.attendees}/{event.maxAttendees}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          attendees
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <Coffee className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to make new connections?
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by browsing matches or create your first invite to meet people with shared interests.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleViewMatches} size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Matches
                </Button>
                <Button onClick={handleCreateInvite} variant="outline" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invite
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
