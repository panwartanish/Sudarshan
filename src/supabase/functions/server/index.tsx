import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logger
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Health check
app.get('/make-server-81854134/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Configuration endpoint for API keys
app.get('/make-server-81854134/config', (c) => {
  return c.json({
    GOOGLE_MAPS_API_KEY: Deno.env.get('GOOGLE_MAPS_API_KEY') || null,
    WEATHER_API_KEY: Deno.env.get('WEATHER_API_KEY') || null,
    EMERGENCY_API_KEY: Deno.env.get('EMERGENCY_API_KEY') || null
  });
});

// Weather data endpoint
app.get('/make-server-81854134/weather/:lat/:lng', async (c) => {
  try {
    const lat = c.req.param('lat');
    const lng = c.req.param('lng');
    const weatherApiKey = Deno.env.get('WEATHER_API_KEY');

    if (!weatherApiKey) {
      // Return simulated weather data
      return c.json({
        current: {
          temperature: 18 + Math.random() * 10,
          humidity: 60 + Math.random() * 30,
          windSpeed: Math.random() * 15,
          windDirection: Math.random() * 360,
          visibility: 8 + Math.random() * 7,
          condition: ['Clear', 'Cloudy', 'Partly Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          pressure: 1010 + Math.random() * 20
        },
        forecast: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          temperature: 15 + Math.random() * 15,
          precipitation: Math.random() * 0.5,
          windSpeed: Math.random() * 20
        }))
      });
    }

    // Call real weather API (OpenWeatherMap example)
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Weather API request failed');
    }

    const weatherData = await weatherResponse.json();
    
    return c.json({
      current: {
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        windDirection: weatherData.wind.deg,
        visibility: weatherData.visibility / 1000,
        condition: weatherData.weather[0].main,
        pressure: weatherData.main.pressure
      }
    });

  } catch (error) {
    console.log('Weather API error:', error);
    return c.json({ error: 'Weather data unavailable' }, 500);
  }
});

// Emergency services integration
app.get('/make-server-81854134/emergency-services/:lat/:lng', async (c) => {
  try {
    const lat = parseFloat(c.req.param('lat'));
    const lng = parseFloat(c.req.param('lng'));

    // Simulated emergency services data
    const services = [
      {
        type: 'hospital',
        name: 'General Hospital',
        distance: Math.random() * 5 + 1,
        contact: '911',
        coordinates: { lat: lat + (Math.random() - 0.5) * 0.01, lng: lng + (Math.random() - 0.5) * 0.01 }
      },
      {
        type: 'fire_station',
        name: 'Fire Station #3',
        distance: Math.random() * 3 + 0.5,
        contact: '911',
        coordinates: { lat: lat + (Math.random() - 0.5) * 0.01, lng: lng + (Math.random() - 0.5) * 0.01 }
      },
      {
        type: 'police',
        name: 'Police Station',
        distance: Math.random() * 4 + 1,
        contact: '911',
        coordinates: { lat: lat + (Math.random() - 0.5) * 0.01, lng: lng + (Math.random() - 0.5) * 0.01 }
      }
    ];

    return c.json({ services });
  } catch (error) {
    console.log('Emergency services error:', error);
    return c.json({ error: 'Emergency services data unavailable' }, 500);
  }
});

// Drone/Rover telemetry endpoint
app.post('/make-server-81854134/telemetry', async (c) => {
  try {
    const telemetryData = await c.req.json();
    
    // Store telemetry data in KV store
    const timestamp = new Date().toISOString();
    const key = `telemetry:${telemetryData.unitId}:${timestamp}`;
    
    await kv.set(key, {
      ...telemetryData,
      timestamp,
      processed: false
    });

    return c.json({ success: true, stored: key });
  } catch (error) {
    console.log('Telemetry storage error:', error);
    return c.json({ error: 'Failed to store telemetry data' }, 500);
  }
});

// Communication relay endpoint
app.post('/make-server-81854134/communication', async (c) => {
  try {
    const message = await c.req.json();
    
    // Store communication message
    const timestamp = new Date().toISOString();
    const key = `comm:${message.from}:${message.to}:${timestamp}`;
    
    await kv.set(key, {
      ...message,
      timestamp,
      delivered: false
    });

    return c.json({ success: true, messageId: key });
  } catch (error) {
    console.log('Communication error:', error);
    return c.json({ error: 'Failed to relay communication' }, 500);
  }
});

// Mission data storage
app.post('/make-server-81854134/mission', async (c) => {
  try {
    const missionData = await c.req.json();
    
    const timestamp = new Date().toISOString();
    const key = `mission:${missionData.missionId}`;
    
    await kv.set(key, {
      ...missionData,
      createdAt: timestamp,
      status: 'active'
    });

    return c.json({ success: true, missionId: key });
  } catch (error) {
    console.log('Mission storage error:', error);
    return c.json({ error: 'Failed to store mission data' }, 500);
  }
});

// Get mission data
app.get('/make-server-81854134/mission/:missionId', async (c) => {
  try {
    const missionId = c.req.param('missionId');
    const mission = await kv.get(`mission:${missionId}`);
    
    if (!mission) {
      return c.json({ error: 'Mission not found' }, 404);
    }

    return c.json(mission);
  } catch (error) {
    console.log('Mission retrieval error:', error);
    return c.json({ error: 'Failed to retrieve mission data' }, 500);
  }
});

// Real-time alerts endpoint
app.get('/make-server-81854134/alerts', async (c) => {
  try {
    // Get recent alerts from KV store
    const alerts = await kv.getByPrefix('alert:');
    
    // Filter for recent alerts (last hour)
    const recentAlerts = alerts.filter(alert => {
      const alertTime = new Date(alert.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return alertTime > oneHourAgo;
    });

    return c.json({ alerts: recentAlerts });
  } catch (error) {
    console.log('Alerts retrieval error:', error);
    return c.json({ error: 'Failed to retrieve alerts' }, 500);
  }
});

// Store alert
app.post('/make-server-81854134/alert', async (c) => {
  try {
    const alertData = await c.req.json();
    
    const timestamp = new Date().toISOString();
    const key = `alert:${timestamp}:${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(key, {
      ...alertData,
      timestamp,
      acknowledged: false
    });

    return c.json({ success: true, alertId: key });
  } catch (error) {
    console.log('Alert storage error:', error);
    return c.json({ error: 'Failed to store alert' }, 500);
  }
});

Deno.serve(app.fetch);