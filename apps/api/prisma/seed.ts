import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Downtown Coffee Co.',
        type: 'cafe',
        address: '123 Main St, Downtown',
        latitude: 40.7128,
        longitude: -74.0060,
        rating: 4.5,
        openingHours: {
          monday: { open: '07:00', close: '19:00' },
          tuesday: { open: '07:00', close: '19:00' },
          wednesday: { open: '07:00', close: '19:00' },
          thursday: { open: '07:00', close: '19:00' },
          friday: { open: '07:00', close: '20:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '08:00', close: '18:00' },
        },
        phone: '+1 (555) 123-4567',
        website: 'https://downtowncoffee.com',
        description: 'Cozy coffee shop with great WiFi and outdoor seating',
        amenities: ['wifi', 'outdoor_seating', 'pet_friendly', 'vegan_options'],
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Central Park',
        type: 'park',
        address: 'Central Park, New York, NY',
        latitude: 40.7829,
        longitude: -73.9654,
        rating: 4.8,
        openingHours: {
          monday: { open: '06:00', close: '23:00' },
          tuesday: { open: '06:00', close: '23:00' },
          wednesday: { open: '06:00', close: '23:00' },
          thursday: { open: '06:00', close: '23:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '06:00', close: '23:00' },
          sunday: { open: '06:00', close: '23:00' },
        },
        description: 'Beautiful urban park perfect for outdoor activities',
        amenities: ['outdoor_seating', 'walking_paths', 'playground', 'sports_courts'],
      },
    }),
    prisma.venue.create({
      data: {
        name: 'City Library',
        type: 'library',
        address: '456 Library St, Downtown',
        latitude: 40.7589,
        longitude: -73.9851,
        rating: 4.6,
        openingHours: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '18:00' },
          sunday: { open: '12:00', close: '18:00' },
        },
        phone: '+1 (555) 987-6543',
        website: 'https://citylibrary.org',
        description: 'Modern library with study spaces and meeting rooms',
        amenities: ['wifi', 'study_rooms', 'computers', 'quiet_areas'],
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Beachfront Café',
        type: 'cafe',
        address: '321 Ocean Dr, Beachfront',
        latitude: 40.7000,
        longitude: -73.9500,
        rating: 4.3,
        openingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '20:00' },
        },
        phone: '+1 (555) 456-7890',
        website: 'https://beachfrontcafe.com',
        description: 'Oceanfront café with stunning views and fresh seafood',
        amenities: ['ocean_view', 'outdoor_seating', 'fresh_seafood', 'wifi'],
      },
    }),
  ]);

  console.log(`✅ Created ${venues.length} venues`);

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        provider: 'google',
        email: 'demo@example.com',
        name: 'Demo User',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
        verified: true,
        interests: ['coding', 'technology', 'entrepreneurship', 'gaming'],
        radiusKm: 10,
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          geohash: 'dr5regy',
          lastUpdated: new Date(),
        },
        availability: {
          monday: [{ start: '18:00', end: '22:00' }],
          tuesday: [{ start: '18:00', end: '22:00' }],
          wednesday: [{ start: '18:00', end: '22:00' }],
          thursday: [{ start: '18:00', end: '22:00' }],
          friday: [{ start: '18:00', end: '23:00' }],
          saturday: [{ start: '10:00', end: '23:00' }],
          sunday: [{ start: '10:00', end: '20:00' }],
        },
      },
    }),
    prisma.user.create({
      data: {
        provider: 'facebook',
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
        verified: true,
        interests: ['photography', 'nature', 'hiking', 'travel'],
        radiusKm: 15,
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          geohash: 'dr5regz',
          lastUpdated: new Date(),
        },
        availability: {
          saturday: [{ start: '09:00', end: '18:00' }],
          sunday: [{ start: '09:00', end: '18:00' }],
        },
      },
    }),
    prisma.user.create({
      data: {
        provider: 'google',
        email: 'mike@example.com',
        name: 'Mike Chen',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
        verified: true,
        interests: ['coding', 'gaming', 'technology', 'fitness'],
        radiusKm: 8,
        location: {
          latitude: 40.7000,
          longitude: -73.9500,
          geohash: 'dr5reh0',
          lastUpdated: new Date(),
        },
        availability: {
          monday: [{ start: '19:00', end: '23:00' }],
          tuesday: [{ start: '19:00', end: '23:00' }],
          wednesday: [{ start: '19:00', end: '23:00' }],
          thursday: [{ start: '19:00', end: '23:00' }],
          friday: [{ start: '19:00', end: '24:00' }],
          saturday: [{ start: '10:00', end: '24:00' }],
          sunday: [{ start: '10:00', end: '22:00' }],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample invites
  const invites = await Promise.all([
    prisma.invite.create({
      data: {
        ownerId: users[0].id,
        title: 'Coffee & Code Meetup',
        description: 'Let\'s grab coffee and discuss the latest in web development. All skill levels welcome!',
        interests: ['coding', 'technology', 'entrepreneurship'],
        startTime: new Date('2024-01-15T14:00:00'),
        endTime: new Date('2024-01-15T16:00:00'),
        radiusKm: 10,
        visibility: 'public',
        venueId: venues[0].id,
        maxAttendees: 12,
      },
    }),
    prisma.invite.create({
      data: {
        ownerId: users[1].id,
        title: 'Weekend Hiking Adventure',
        description: 'Join us for a scenic hike through the mountain trails. Bring water and snacks!',
        interests: ['hiking', 'nature', 'fitness'],
        startTime: new Date('2024-01-20T09:00:00'),
        endTime: new Date('2024-01-20T15:00:00'),
        radiusKm: 15,
        visibility: 'public',
        venueId: venues[1].id,
        maxAttendees: 10,
      },
    }),
    prisma.invite.create({
      data: {
        ownerId: users[2].id,
        title: 'Photography Workshop',
        description: 'Learn basic photography techniques and explore the city through your lens.',
        interests: ['photography', 'art', 'education'],
        startTime: new Date('2024-01-18T10:00:00'),
        endTime: new Date('2024-01-18T14:00:00'),
        radiusKm: 8,
        visibility: 'public',
        venueId: venues[2].id,
        maxAttendees: 15,
      },
    }),
  ]);

  console.log(`✅ Created ${invites.length} invites`);

  // Create sample RSVPs
  const rsvps = await Promise.all([
    prisma.rsvp.create({
      data: {
        userId: users[1].id,
        inviteId: invites[0].id,
        status: 'going',
      },
    }),
    prisma.rsvp.create({
      data: {
        userId: users[2].id,
        inviteId: invites[0].id,
        status: 'maybe',
      },
    }),
    prisma.rsvp.create({
      data: {
        userId: users[0].id,
        inviteId: invites[1].id,
        status: 'going',
      },
    }),
  ]);

  console.log(`✅ Created ${rsvps.length} RSVPs`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
