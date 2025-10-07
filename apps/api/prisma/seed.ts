import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // First, create interest categories
  const interestCategories = [
    { name: 'sports', description: 'Physical activities and sports' },
    { name: 'coding', description: 'Programming and software development' },
    { name: 'religion', description: 'Religious and spiritual activities' },
    { name: 'food', description: 'Cooking, dining, and culinary experiences' },
    { name: 'nature', description: 'Outdoor activities and nature appreciation' },
    { name: 'photography', description: 'Photography and visual arts' },
    { name: 'music', description: 'Music creation, performance, and appreciation' },
    { name: 'art', description: 'Visual arts, crafts, and creative expression' },
    { name: 'travel', description: 'Exploring new places and cultures' },
    { name: 'reading', description: 'Books, literature, and learning' },
    { name: 'gaming', description: 'Video games and tabletop gaming' },
    { name: 'fitness', description: 'Exercise, gym, and physical wellness' },
    { name: 'cooking', description: 'Culinary arts and food preparation' },
    { name: 'dancing', description: 'Dance and movement arts' },
    { name: 'hiking', description: 'Hiking and outdoor adventures' },
    { name: 'yoga', description: 'Yoga and mindfulness practices' },
    { name: 'volunteering', description: 'Community service and helping others' },
    { name: 'entrepreneurship', description: 'Business and startup activities' },
    { name: 'education', description: 'Learning and educational pursuits' },
    { name: 'technology', description: 'Tech trends and digital innovation' },
  ];

  const createdInterests = await Promise.all(
    interestCategories.map(category =>
      prisma.interestCategory.upsert({
        where: { name: category.name },
        update: category,
        create: category,
      })
    )
  );

  console.log(`✅ Created/updated ${createdInterests.length} interest categories`);

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
        radiusKm: 10,
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          geohash: 'dr5regy',
          lastUpdated: new Date(),
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
        radiusKm: 15,
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          geohash: 'dr5regz',
          lastUpdated: new Date(),
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
        radiusKm: 8,
        location: {
          latitude: 40.7000,
          longitude: -73.9500,
          geohash: 'dr5reh0',
          lastUpdated: new Date(),
        },
      },
    }),
    prisma.user.create({
      data: {
        provider: 'google',
        email: 'alex@example.com',
        name: 'Alex Rodriguez',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
        verified: true,
        radiusKm: 12,
        location: {
          latitude: 40.7500,
          longitude: -73.9800,
          geohash: 'dr5reh1',
          lastUpdated: new Date(),
        },
      },
    }),
    prisma.user.create({
      data: {
        provider: 'facebook',
        email: 'emma@example.com',
        name: 'Emma Wilson',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face',
        verified: true,
        radiusKm: 20,
        location: {
          latitude: 40.7200,
          longitude: -73.9900,
          geohash: 'dr5reh2',
          lastUpdated: new Date(),
        },
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Add user interests
  const userInterests = [
    // Demo User interests
    { userId: users[0].id, interestNames: ['coding', 'technology', 'entrepreneurship', 'gaming'] },
    // Sarah Johnson interests
    { userId: users[1].id, interestNames: ['photography', 'nature', 'hiking', 'travel'] },
    // Mike Chen interests
    { userId: users[2].id, interestNames: ['coding', 'gaming', 'technology', 'fitness'] },
    // Alex Rodriguez interests
    { userId: users[3].id, interestNames: ['music', 'art', 'dancing', 'fitness'] },
    // Emma Wilson interests
    { userId: users[4].id, interestNames: ['reading', 'education', 'volunteering', 'yoga'] },
  ];

  for (const userInterest of userInterests) {
    const interestIds = await prisma.interestCategory.findMany({
      where: { name: { in: userInterest.interestNames } },
      select: { id: true }
    });

    await prisma.userInterest.createMany({
      data: interestIds.map(interest => ({
        userId: userInterest.userId,
        interestId: interest.id,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`✅ Added user interests`);

  // Add user availability
  const availabilityData = [
    // Demo User - Evening person
    { userId: users[0].id, dayOfWeek: 'monday', startTime: '18:00', endTime: '22:00' },
    { userId: users[0].id, dayOfWeek: 'tuesday', startTime: '18:00', endTime: '22:00' },
    { userId: users[0].id, dayOfWeek: 'wednesday', startTime: '18:00', endTime: '22:00' },
    { userId: users[0].id, dayOfWeek: 'thursday', startTime: '18:00', endTime: '22:00' },
    { userId: users[0].id, dayOfWeek: 'friday', startTime: '18:00', endTime: '23:00' },
    { userId: users[0].id, dayOfWeek: 'saturday', startTime: '10:00', endTime: '23:00' },
    { userId: users[0].id, dayOfWeek: 'sunday', startTime: '10:00', endTime: '20:00' },
    
    // Sarah Johnson - Weekend outdoor person
    { userId: users[1].id, dayOfWeek: 'saturday', startTime: '09:00', endTime: '18:00' },
    { userId: users[1].id, dayOfWeek: 'sunday', startTime: '09:00', endTime: '18:00' },
    
    // Mike Chen - Night owl
    { userId: users[2].id, dayOfWeek: 'monday', startTime: '19:00', endTime: '23:00' },
    { userId: users[2].id, dayOfWeek: 'tuesday', startTime: '19:00', endTime: '23:00' },
    { userId: users[2].id, dayOfWeek: 'wednesday', startTime: '19:00', endTime: '23:00' },
    { userId: users[2].id, dayOfWeek: 'thursday', startTime: '19:00', endTime: '23:00' },
    { userId: users[2].id, dayOfWeek: 'friday', startTime: '19:00', endTime: '24:00' },
    { userId: users[2].id, dayOfWeek: 'saturday', startTime: '10:00', endTime: '24:00' },
    { userId: users[2].id, dayOfWeek: 'sunday', startTime: '10:00', endTime: '22:00' },
    
    // Alex Rodriguez - Morning person
    { userId: users[3].id, dayOfWeek: 'monday', startTime: '06:00', endTime: '10:00' },
    { userId: users[3].id, dayOfWeek: 'tuesday', startTime: '06:00', endTime: '10:00' },
    { userId: users[3].id, dayOfWeek: 'wednesday', startTime: '06:00', endTime: '10:00' },
    { userId: users[3].id, dayOfWeek: 'thursday', startTime: '06:00', endTime: '10:00' },
    { userId: users[3].id, dayOfWeek: 'friday', startTime: '06:00', endTime: '10:00' },
    { userId: users[3].id, dayOfWeek: 'saturday', startTime: '08:00', endTime: '12:00' },
    { userId: users[3].id, dayOfWeek: 'sunday', startTime: '08:00', endTime: '12:00' },
    
    // Emma Wilson - Flexible schedule
    { userId: users[4].id, dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00' },
    { userId: users[4].id, dayOfWeek: 'tuesday', startTime: '09:00', endTime: '17:00' },
    { userId: users[4].id, dayOfWeek: 'wednesday', startTime: '09:00', endTime: '17:00' },
    { userId: users[4].id, dayOfWeek: 'thursday', startTime: '09:00', endTime: '17:00' },
    { userId: users[4].id, dayOfWeek: 'friday', startTime: '09:00', endTime: '17:00' },
    { userId: users[4].id, dayOfWeek: 'saturday', startTime: '10:00', endTime: '16:00' },
    { userId: users[4].id, dayOfWeek: 'sunday', startTime: '10:00', endTime: '16:00' },
  ];

  await prisma.userAvailability.createMany({
    data: availabilityData,
    skipDuplicates: true,
  });

  console.log(`✅ Added user availability data`);

  // Create sample invites
  const invites = await Promise.all([
    prisma.invite.create({
      data: {
        ownerId: users[0].id,
        title: 'Coffee & Code Meetup',
        description: 'Let\'s grab coffee and discuss the latest in web development. All skill levels welcome!',
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
        startTime: new Date('2024-01-18T10:00:00'),
        endTime: new Date('2024-01-18T14:00:00'),
        radiusKm: 8,
        visibility: 'public',
        venueId: venues[2].id,
        maxAttendees: 15,
      },
    }),
  ]);

  // Add invite interests
  const inviteInterests = [
    { inviteId: invites[0].id, interestNames: ['coding', 'technology', 'entrepreneurship'] },
    { inviteId: invites[1].id, interestNames: ['hiking', 'nature', 'fitness'] },
    { inviteId: invites[2].id, interestNames: ['photography', 'art', 'education'] },
  ];

  for (const inviteInterest of inviteInterests) {
    const interestIds = await prisma.interestCategory.findMany({
      where: { name: { in: inviteInterest.interestNames } },
      select: { id: true }
    });

    await prisma.inviteInterest.createMany({
      data: interestIds.map(interest => ({
        inviteId: inviteInterest.inviteId,
        interestId: interest.id,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`✅ Created ${invites.length} invites`);

  // Create sample RSVPs
  const rsvps = await Promise.all([
    prisma.rSVP.create({
      data: {
        userId: users[1].id,
        inviteId: invites[0].id,
        status: 'going',
      },
    }),
    prisma.rSVP.create({
      data: {
        userId: users[2].id,
        inviteId: invites[0].id,
        status: 'maybe',
      },
    }),
    prisma.rSVP.create({
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
