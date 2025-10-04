import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
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
  XCircle
} from 'lucide-react';

// Mock data for demo
const mockInvites = [
  {
    id: '1',
    title: 'Coffee & Code Meetup',
    description: 'Let\'s grab coffee and discuss the latest in web development. All skill levels welcome!',
    startTime: new Date('2024-01-15T14:00:00'),
    endTime: new Date('2024-01-15T16:00:00'),
    location: 'Downtown Coffee Co.',
    interests: ['coding', 'technology', 'entrepreneurship'],
    maxAttendees: 12,
    currentAttendees: 8,
    visibility: 'public' as const,
    status: 'active' as const,
    createdAt: new Date('2024-01-10T10:00:00'),
  },
  {
    id: '2',
    title: 'Weekend Hiking Adventure',
    description: 'Join us for a scenic hike through the mountain trails. Bring water and snacks!',
    startTime: new Date('2024-01-20T09:00:00'),
    endTime: new Date('2024-01-20T15:00:00'),
    location: 'Mountain Trail Park',
    interests: ['hiking', 'nature', 'fitness'],
    maxAttendees: 10,
    currentAttendees: 5,
    visibility: 'public' as const,
    status: 'active' as const,
    createdAt: new Date('2024-01-12T15:30:00'),
  },
  {
    id: '3',
    title: 'Photography Workshop',
    description: 'Learn basic photography techniques and explore the city through your lens.',
    startTime: new Date('2024-01-18T10:00:00'),
    endTime: new Date('2024-01-18T14:00:00'),
    location: 'City Art Gallery',
    interests: ['photography', 'art', 'education'],
    maxAttendees: 15,
    currentAttendees: 12,
    visibility: 'public' as const,
    status: 'active' as const,
    createdAt: new Date('2024-01-08T09:15:00'),
  },
  {
    id: '4',
    title: 'Cooking Class: Italian Cuisine',
    description: 'Learn to make authentic Italian pasta and sauces from scratch.',
    startTime: new Date('2024-01-25T18:00:00'),
    endTime: new Date('2024-01-25T21:00:00'),
    location: 'Culinary Studio Downtown',
    interests: ['cooking', 'food', 'education'],
    maxAttendees: 8,
    currentAttendees: 6,
    visibility: 'friends' as const,
    status: 'active' as const,
    createdAt: new Date('2024-01-14T11:20:00'),
  },
];

const mockRSVPs = [
  {
    id: '1',
    inviteId: '1',
    status: 'going' as const,
    user: {
      name: 'Sarah Johnson',
      photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '2',
    inviteId: '1',
    status: 'maybe' as const,
    user: {
      name: 'Mike Chen',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
  },
];

export default function InvitesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'my-invites' | 'attending'>('my-invites');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
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
            <Button onClick={() => navigate('/invites/create')} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Invite
            </Button>
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

        {/* Invites List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {mockInvites.map((invite, index) => (
            <motion.div
              key={invite.id}
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                          {invite.status}
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
                          {invite.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {invite.currentAttendees}/{invite.maxAttendees} attendees
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
                        {invite.interests.map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* RSVPs */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Attendees</h4>
                      <div className="flex items-center space-x-2">
                        {mockRSVPs
                          .filter(rsvp => rsvp.inviteId === invite.id)
                          .map((rsvp) => (
                            <div key={rsvp.id} className="flex items-center space-x-2">
                              <img
                                src={rsvp.user.photoUrl}
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
                        {invite.currentAttendees > mockRSVPs.filter(rsvp => rsvp.inviteId === invite.id).length && (
                          <div className="text-sm text-muted-foreground">
                            +{invite.currentAttendees - mockRSVPs.filter(rsvp => rsvp.inviteId === invite.id).length} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Attendance</span>
                        <span>{invite.currentAttendees}/{invite.maxAttendees}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(invite.currentAttendees / invite.maxAttendees) * 100}%` }}
                        />
                      </div>
                    </div>

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

        {/* Empty State */}
        {mockInvites.length === 0 && (
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
                  <div className="text-2xl font-bold text-primary">{mockInvites.length}</div>
                  <div className="text-sm text-muted-foreground">Total Invites</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {mockInvites.reduce((acc, invite) => acc + invite.currentAttendees, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Attendees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {mockInvites.filter(invite => invite.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Invites</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(mockInvites.reduce((acc, invite) => acc + (invite.currentAttendees / invite.maxAttendees), 0) / mockInvites.length * 100) || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Attendance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
