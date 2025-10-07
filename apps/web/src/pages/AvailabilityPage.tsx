import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import UserMenu from '@/components/UserMenu';
import { Clock, Plus, Trash2, Save, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  [key: string]: TimeSlot[];
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export default function AvailabilityPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [availability, setAvailability] = useState<DayAvailability>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await api.getAvailability(user.id);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to load availability data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTimeSlot = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [
        ...(prev[day] || []),
        { start: '09:00', end: '17:00' }
      ]
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day]?.filter((_, i) => i !== index) || []
    }));
  };

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day]?.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      ) || []
    }));
  };

  const saveAvailability = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await api.updateAvailability(user.id, availability);
      
      toast({
        title: 'Success',
        description: 'Availability updated successfully!',
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to save availability',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getDayAvailability = (day: string): TimeSlot[] => {
    return availability[day] || [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading availability...</p>
        </div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                My Availability
              </h1>
              <p className="text-muted-foreground">
                Set your weekly schedule to help others find the best time to meet you
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <UserMenu />
            </div>
          </div>
        </motion.div>

        {/* Availability Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {DAYS.map((day, dayIndex) => (
            <Card key={day.key} className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-800">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    {day.label}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(day.key)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Time
                  </Button>
                </CardTitle>
                <CardDescription>
                  Add your available time slots for {day.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {getDayAvailability(day.key).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No availability set for {day.label}</p>
                    <p className="text-sm">Click "Add Time" to set your availability</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getDayAvailability(day.key).map((slot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`${day.key}-${slotIndex}-start`}>Start Time</Label>
                            <Input
                              id={`${day.key}-${slotIndex}-start`}
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateTimeSlot(day.key, slotIndex, 'start', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${day.key}-${slotIndex}-end`}>End Time</Label>
                            <Input
                              id={`${day.key}-${slotIndex}-end`}
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(day.key, slotIndex, 'end', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(day.key, slotIndex)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-end"
          >
            <Button
              onClick={saveAvailability}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3"
              size="lg"
            >
              <Save className="h-5 w-5" />
              {isSaving ? 'Saving...' : 'Save Availability'}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
