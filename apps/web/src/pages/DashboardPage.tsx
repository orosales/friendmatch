import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { api, Invite } from '@/lib/api';
import UserMenu from '@/components/UserMenu';
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

// Helper functions
const getCurrentAttendees = (invite: Invite) => {
  return invite.rsvps?.filter(rsvp => rsvp.status === 'going').length || 0;
};

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatEventTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Dashboard: Starting to fetch invites...');
        setIsDataLoading(true);
        setError(null);
        const [invitesData, matchesData] = await Promise.all([
          api.getInvites(),
          api.getMatches(user?.id),
        ]);
        console.log('Dashboard: Received invites data:', invitesData);
        console.log('Dashboard: Received matches data:', matchesData);
        setInvites(invitesData);
        setRecentMatches(matchesData.slice(0, 3));
      } catch (err) {
        console.error('Dashboard: Failed to fetch invites:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleCreateInvite = () => {
    navigate('/invites/create');
  };

  const handleViewMatches = () => {
    navigate('/matches');
  };

  const handleViewInvites = () => {
    navigate('/invites');
  };

  const handleViewAvailability = () => {
    navigate('/availability');
  };


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Debug logging
  console.log('Dashboard: Current invites state:', invites);
  console.log('Dashboard: isDataLoading:', isDataLoading);
  console.log('Dashboard: error:', error);

  // Compute stats from real data
  const now = new Date();
  console.log('Dashboard: Current time:', now.toISOString());
  
  const activeInvites = invites.filter(invite => {
    const startTime = new Date(invite.startTime);
    const endTime = invite.endTime ? new Date(invite.endTime) : null;
    // An invite is active if it hasn't ended yet (either no end time or current time is before end time)
    const isActive = !endTime || now <= endTime;
    console.log(`Dashboard: Invite "${invite.title}" - startTime: ${startTime.toISOString()}, endTime: ${endTime?.toISOString() || 'none'}, isActive: ${isActive}`);
    return isActive;
  });
  
  const upcomingEvents = invites.filter(invite => {
    const startTime = new Date(invite.startTime);
    // An event is upcoming if it starts in the future
    const isUpcoming = startTime > now;
    console.log(`Dashboard: Invite "${invite.title}" - startTime: ${startTime.toISOString()}, isUpcoming: ${isUpcoming}`);
    return isUpcoming;
  });

  // Events that are currently happening (between start and end time)
  const currentEvents = invites.filter(invite => {
    const startTime = new Date(invite.startTime);
    const endTime = invite.endTime ? new Date(invite.endTime) : null;
    const isCurrentlyHappening = now >= startTime && (!endTime || now <= endTime);
    console.log(`Dashboard: Invite "${invite.title}" - isCurrentlyHappening: ${isCurrentlyHappening}`);
    return isCurrentlyHappening;
  });
  
  console.log('Dashboard: Active invites count:', activeInvites.length);
  console.log('Dashboard: Upcoming events count:', upcomingEvents.length);
  console.log('Dashboard: Current events count:', currentEvents.length);

  const stats = {
    totalMatches: recentMatches.length > 0 ? undefined : undefined,
    activeInvites: activeInvites.length,
    upcomingEvents: upcomingEvents.length,
    currentEvents: currentEvents.length,
    newMatches: 0,
  };

  // Get events for display (current + upcoming events in next 7 days)
  const allDisplayEvents = [...currentEvents, ...upcomingEvents]
    .filter(invite => {
      const startTime = new Date(invite.startTime);
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return startTime <= sevenDaysFromNow;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) // Sort by start time
    .slice(0, 2) // Show only first 2
    .map(invite => ({
      id: invite.id,
      title: invite.title,
      date: `${formatEventDate(invite.startTime)}, ${formatEventTime(invite.startTime)}`,
      location: invite.venue?.name || 'Location TBD',
      attendees: getCurrentAttendees(invite),
      maxAttendees: invite.maxAttendees || 0,
      isCurrentlyHappening: currentEvents.some(ce => ce.id === invite.id),
    }));

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
                {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to meet some amazing people today?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <UserMenu />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewMatches}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Find Matches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{recentMatches.length}</div>
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
              <div className="text-2xl font-bold text-primary">{stats.activeInvites}</div>
              <p className="text-xs text-muted-foreground">
                Active invitations you've created
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewAvailability}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Availability</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">📅</div>
              <p className="text-xs text-muted-foreground">
                Set your weekly schedule
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
                {isDataLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Loading matches...</p>
                  </div>
                ) : recentMatches.length > 0 ? (
                  recentMatches.map((m, index) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={m.photoUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="text-sm font-medium">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{Math.round(m.score * 100)}% match • {Math.round(m.distance)} km</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={handleViewMatches}>View</Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No matches yet. Update your interests to see matches.</p>
                  </div>
                )}
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
                {isDataLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Loading events...</p>
                  </div>
                ) : allDisplayEvents.length > 0 ? (
                  allDisplayEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground truncate">
                              {event.title}
                            </h4>
                            {event.isCurrentlyHappening && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Live
                              </span>
                            )}
                          </div>
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
                            {event.attendees}/{event.maxAttendees || '∞'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            attendees
                          </div>
                        </div>
                      </div>
                      {event.maxAttendees > 0 && (
                        <div className="mt-3 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No upcoming events
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create an invite to get started!
                    </p>
                  </div>
                )}
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
