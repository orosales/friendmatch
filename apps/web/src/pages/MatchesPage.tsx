import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Filter,
  Users,
  Clock,
  Star,
  Loader2
} from 'lucide-react';

interface Match {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  interests: string[];
  radiusKm: number;
  age: number;
  distance: number;
  score: number;
  lastActive: string;
  bio: string;
  availability: string;
  createdAt: string;
  updatedAt: string;
}

export default function MatchesPage() {
  const { user } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'distance' | 'recent'>('score');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch matches from API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = user?.id 
          ? `http://localhost:3001/api/matches?userId=${user.id}`
          : 'http://localhost:3001/api/matches';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user?.id]);

  const filteredMatches = matches
    .filter(match => {
      const matchesSearch = match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           match.bio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInterests = selectedInterests.length === 0 || 
                              selectedInterests.some(interest => 
                                match.interests.includes(interest)
                              );
      return matchesSearch && matchesInterests;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'distance':
          return a.distance - b.distance;
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.8) return 'text-blue-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent Match';
    if (score >= 0.8) return 'Great Match';
    if (score >= 0.7) return 'Good Match';
    return 'Potential Match';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading matches...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <Users className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Matches</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Find Your Matches
          </h1>
          <p className="text-muted-foreground">
            Discover people who share your interests and are located nearby
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or interests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="score">Sort by Match Score</option>
                    <option value="distance">Sort by Distance</option>
                    <option value="recent">Sort by Recent</option>
                  </select>
                </div>
              </div>

              {/* Interest Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t"
                >
                  <h4 className="text-sm font-medium mb-3">Filter by Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {user?.interests.map((interest) => (
                      <Button
                        key={interest}
                        variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Matches Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={match.photoUrl}
                        alt={match.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{match.name}</CardTitle>
                        <CardDescription>
                          {match.age} years old • {match.distance} km away
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getScoreColor(match.score)}`}>
                        {Math.round(match.score * 100)}% match
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getScoreLabel(match.score)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{match.bio}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Active {match.lastActive}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {match.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Availability</h4>
                    <p className="text-xs text-muted-foreground">{match.availability}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredMatches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No matches found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters to find more people.
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedInterests([]);
            }}>
              Clear Filters
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
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{filteredMatches.length}</div>
                  <div className="text-sm text-muted-foreground">Total Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(filteredMatches.reduce((acc, match) => acc + match.score, 0) / filteredMatches.length * 100) || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Match Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(filteredMatches.reduce((acc, match) => acc + match.distance, 0) / filteredMatches.length * 10) / 10 || 0} km
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Distance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
