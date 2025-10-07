import { z } from 'zod';

// User related types
export const UserProviderSchema = z.enum(['google', 'facebook']);
export type UserProvider = z.infer<typeof UserProviderSchema>;

export const InterestSchema = z.enum([
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
  'technology'
]);

export type Interest = z.infer<typeof InterestSchema>;

export const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  geohash: z.string().optional(),
  accuracy: z.number().optional(),
  lastUpdated: z.date()
});

export type Location = z.infer<typeof LocationSchema>;

export const AvailabilitySchema = z.object({
  monday: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/)
  })).optional(),
  tuesday: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/)
  })).optional(),
  wednesday: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/)
  })).optional(),
  thursday: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/)
  })).optional(),
  friday: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/)
  })).optional(),
  saturday: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/)
  })).optional(),
  sunday: z.array(z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/)
  })).optional()
});

export type Availability = z.infer<typeof AvailabilitySchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  provider: UserProviderSchema,
  email: z.string().email(),
  name: z.string().min(1).max(100),
  photoUrl: z.string().url().optional(),
  verified: z.boolean().default(false),
  interests: z.array(InterestSchema),
  radiusKm: z.number().int().min(1).max(100).default(10),
  availability: AvailabilitySchema.optional(),
  location: LocationSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const InterestCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type InterestCategory = z.infer<typeof InterestCategorySchema>;

export const UserInterestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  interestId: z.string().uuid(),
  createdAt: z.date(),
  user: UserSchema.optional(),
  interest: InterestCategorySchema.optional()
});

export type UserInterest = z.infer<typeof UserInterestSchema>;

export const UserAvailabilitySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type UserAvailability = z.infer<typeof UserAvailabilitySchema>;

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  provider: true,
  email: true,
  createdAt: true,
  updatedAt: true
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// Invite related types
export const InviteVisibilitySchema = z.enum(['public', 'friends', 'private']);
export type InviteVisibility = z.infer<typeof InviteVisibilitySchema>;

export const InviteSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  interests: z.array(InterestSchema),
  startTime: z.date(),
  endTime: z.date().optional(),
  radiusKm: z.number().int().min(1).max(100),
  visibility: InviteVisibilitySchema,
  venueId: z.string().optional(),
  maxAttendees: z.number().int().min(2).max(50).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Invite = z.infer<typeof InviteSchema>;

export const CreateInviteSchema = InviteSchema.omit({
  id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true
});

export type CreateInvite = z.infer<typeof CreateInviteSchema>;

export const UpdateInviteSchema = InviteSchema.partial().omit({
  id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true
});

export type UpdateInvite = z.infer<typeof UpdateInviteSchema>;

// RSVP related types
export const RSVPStatusSchema = z.enum(['going', 'maybe', 'not_going']);
export type RSVPStatus = z.infer<typeof RSVPStatusSchema>;

export const RSVPSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  inviteId: z.string().uuid(),
  status: RSVPStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

export type RSVP = z.infer<typeof RSVPSchema>;

export const CreateRSVPSchema = RSVPSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type CreateRSVP = z.infer<typeof CreateRSVPSchema>;

// Venue related types
export const VenueTypeSchema = z.enum([
  'cafe',
  'restaurant',
  'library',
  'park',
  'beach',
  'lake',
  'gym',
  'museum',
  'theater',
  'bar',
  'coffee_shop',
  'bookstore',
  'community_center',
  'outdoor_space'
]);

export type VenueType = z.infer<typeof VenueTypeSchema>;

export const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: VenueTypeSchema,
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  rating: z.number().min(0).max(5).optional(),
  openingHours: z.record(z.string()).optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional()
});

export type Venue = z.infer<typeof VenueSchema>;

// Match related types
export const MatchSchema = z.object({
  user: UserSchema,
  score: z.number().min(0).max(1),
  distance: z.number(),
  sharedInterests: z.array(InterestSchema),
  availabilityOverlap: z.number().min(0).max(1).optional()
});

export type Match = z.infer<typeof MatchSchema>;

// API Response types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0)
  })
});

export type PaginatedResponse<T = any> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Geolocation types
export const GeolocationPositionSchema = z.object({
  coords: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
    altitude: z.number().optional(),
    altitudeAccuracy: z.number().optional(),
    heading: z.number().optional(),
    speed: z.number().optional()
  }),
  timestamp: z.number()
});

export type GeolocationPosition = z.infer<typeof GeolocationPositionSchema>;

// Error types
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional()
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
