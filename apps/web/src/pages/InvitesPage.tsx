import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { api, Invite } from '@/lib/api';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Home
} from 'lucide-react';

// Helper function to get current attendees count
const getCurrentAttendees = (invite: Invite) => {
  return invite.rsvps?.filter(rsvp => rsvp.status === 'going').length || 0;
};

// Helper function to get status based on time
const getInviteStatus = (invite: Invite) => {
  const now = new Date();
  const startTime = new Date(invite.startTime);
  const endTime = invite.endTime ? new Date(invite.endTime) : null;
  
  if (endTime && now > endTime) return 'completed';
  if (now > startTime) return 'active';
  return 'upcoming';
};

export default function InvitesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my-invites' | 'attending'>('my-invites');
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        setIsLoading(true);
        const data = await api.getInvites();
        setInvites(data);
      } catch (err) {
        console.error('Failed to fetch invites:', err);
        setError('Failed to load invites. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvites();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRSVPStatusColor = (status: string) => {
    switch (status) {
      case 'going':
        return 'bg-green-100 text-green-800';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_going':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Invites
              </h1>
              <p className="text-muted-foreground">
                Manage your invitations and see who's attending
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')} 
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate('/invites/create')} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Invite
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'my-invites' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('my-invites')}
            >
              My Invites
            </Button>
            <Button
              variant={activeTab === 'attending' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('attending')}
            >
              Attending
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading invites...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Error loading invites
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Invites List */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {invites.map((invite, index) => (
            <motion.div
              key={invite.id || `invite-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-xl">{invite.title}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getInviteStatus(invite))}`}>
                          {getInviteStatus(invite)}
                        </span>
                      </div>
                      <CardDescription className="text-base mb-3">
                        {invite.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(invite.startTime)} at {formatTime(invite.startTime)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {invite.venue?.name || 'Location TBD'}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {getCurrentAttendees(invite)}/{invite.maxAttendees || '∞'} attendees
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {invite.visibility}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Interests */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-1">
                        {invite.interests.map((interest, index) => (
                          <span
                            key={typeof interest === 'string' ? interest : `interest-${index}`}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {typeof interest === 'string' ? interest : interest.name || interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* RSVPs */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Attendees</h4>
                      <div className="flex items-center space-x-2">
                        {invite.rsvps?.slice(0, 3).map((rsvp) => (
                          <div key={rsvp.id} className="flex items-center space-x-2">
                            <img
                              src={rsvp.user.photoUrl || 'https://via.placeholder.com/32'}
                              alt={rsvp.user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium">{rsvp.user.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getRSVPStatusColor(rsvp.status)}`}>
                                {rsvp.status}
                              </span>
                            </div>
                          </div>
                        ))}
                        {(invite.rsvps?.length || 0) > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{(invite.rsvps?.length || 0) - 3} more
                          </div>
                        )}
                        {(!invite.rsvps || invite.rsvps.length === 0) && (
                          <div className="text-sm text-muted-foreground">
                            No attendees yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {invite.maxAttendees && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Attendance</span>
                          <span>{getCurrentAttendees(invite)}/{invite.maxAttendees}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(getCurrentAttendees(invite) / invite.maxAttendees) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Users className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && invites.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No invites yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first invite to start meeting new people with shared interests.
            </p>
            <Button onClick={() => navigate('/invites/create')} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Invite
            </Button>
          </motion.div>
        )}

        {/* Stats */}
        {!isLoading && !error && invites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{invites.length}</div>
                    <div className="text-sm text-muted-foreground">Total Invites</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {invites.reduce((acc, invite) => acc + getCurrentAttendees(invite), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Attendees</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {invites.filter(invite => getInviteStatus(invite) === 'active').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Invites</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {invites.length > 0 ? Math.round(
                        invites.reduce((acc, invite) => {
                          const maxAttendees = invite.maxAttendees || 1;
                          return acc + (getCurrentAttendees(invite) / maxAttendees);
                        }, 0) / invites.length * 100
                      ) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Attendance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
