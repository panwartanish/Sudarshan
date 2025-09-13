// This is a mock API configuration for the frontend
// In a real deployment, this would connect to the Supabase edge function

export const config = {
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || null,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || null,
  EMERGENCY_API_KEY: process.env.EMERGENCY_API_KEY || null
};

export default function handler(req: any, res: any) {
  res.status(200).json(config);
}