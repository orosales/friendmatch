const API_BASE_URL = 'http://localhost:3001/api';

export interface CreateInviteRequest {
  ownerId: string;
  title: string;
  description?: string;
  interests: string[];
  startTime: string;
  endTime?: string;
  radiusKm: number;
  visibility: string;
  venueId?: string;
  maxAttendees?: number;
}

export interface Invite {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  interests: string[];
  startTime: string;
  endTime?: string;
  radiusKm: number;
  visibility: string;
  venueId?: string;
  maxAttendees?: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    photoUrl?: string;
  };
  venue?: {
    id: string;
    name: string;
    type: string;
    address: string;
    latitude: number;
    longitude: number;
    rating?: number;
  };
  rsvps?: Array<{
    id: string;
    status: string;
    user: {
      id: string;
      name: string;
      photoUrl?: string;
    };
  }>;
}

export const api = {
  async getMatches(userId?: string) {
    const url = userId
      ? `${API_BASE_URL}/matches?userId=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/matches`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch matches: ${response.statusText}`);
    }
    return response.json();
  },
  async createInvite(data: CreateInviteRequest): Promise<Invite> {
    const response = await fetch(`${API_BASE_URL}/invites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create invite: ${response.statusText}`);
    }

    return response.json();
  },

  async getInvites(): Promise<Invite[]> {
    console.log('Making API call to:', `${API_BASE_URL}/invites`);
    const response = await fetch(`${API_BASE_URL}/invites`);
    
    console.log('API response status:', response.status);
    console.log('API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`Failed to fetch invites: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  },

  async getUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  },

  async updateUser(id: string, data: {
    interests?: string[];
    radiusKm?: number;
    location?: any;
    availability?: any;
  }) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    return response.json();
  },

  async getAvailability(userId: string) {
    const response = await fetch(`${API_BASE_URL}/availability?userId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }

    return response.json();
  },

  async updateAvailability(userId: string, availability: { [key: string]: Array<{ start: string; end: string }> }) {
    const response = await fetch(`${API_BASE_URL}/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, availability }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update availability: ${response.statusText}`);
    }

    return response.json();
  },

  async getInterestCategories() {
    const response = await fetch(`${API_BASE_URL}/availability/interests`);

    if (!response.ok) {
      throw new Error(`Failed to fetch interest categories: ${response.statusText}`);
    }

    return response.json();
  },
};
