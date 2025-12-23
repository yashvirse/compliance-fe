import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// @ts-ignore
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Site {
  siteId: string;
  siteName: string;
  siteLocation: string;
  state: string;
  country: string;
  latitude: string;
  longtitude: string;
  description: string;
}

interface SiteMapProps {
  sites?: Site[];
  height?: number;
}

const SiteMap: React.FC<SiteMapProps> = ({ sites = [], height = 400 }) => {
  const [siteList, setSiteList] = useState<Site[]>(sites);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sites.length === 0) {
      fetchSites();
    }
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken') || 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjE2MDEwNCIsImVtYWlsIjoiYWRtaW5Ab3JjaGlkZWFyZXNlYXJjaC5jb20iLCJyb2xlIjoiQ3VzdG9tZXJBZG1pbiIsIm5hbWVpZCI6IlByc3I0SXRKUmluWVdrNmlicjFseDFwK1ZTU2RVMjZucnFsb0VKc2VrZmd0U3pTeFNLRGk0cGNiempSTmxYdnNNMkJLSEJOd2N1Y3NPamxLUE9aTFV1R0VwNEFiVW1mZkdxY2VPVDloTnM0PSIsIm5iZiI6MTc2NjQyMDcwOSwiZXhwIjoxNzY3MDI1NTA5LCJpYXQiOjE3NjY0MjA3MDl9.LI1zJaeVpUsIfnLapAN5XmSwb9iwZFZGpXDZEnEWIak';

      const response = await fetch(
        'https://api.ocmspro.com/api/Master/getSiteMasterList',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.isSuccess && data.result) {
        const validSites = data.result.filter(
          (site: Site) => site.latitude && site.longtitude
        );
        setSiteList(validSites);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  const parseCoordinates = (lat: string, lng: string): [number, number] | null => {
    try {
      const latitude = parseFloat(lat.replace('°', '').replace('N', '').replace('S', '').trim());
      const longitude = parseFloat(lng.replace('°', '').replace('E', '').replace('W', '').trim());
      
      if (isNaN(latitude) || isNaN(longitude)) return null;
      return [latitude, longitude];
    } catch {
      return null;
    }
  };

  const validSites = siteList.filter(
    (site) => site.latitude && site.longtitude && parseCoordinates(site.latitude, site.longtitude)
  );

  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const mapCenter =
    validSites.length > 0
      ? parseCoordinates(validSites[0].latitude, validSites[0].longtitude) || defaultCenter
      : defaultCenter;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height }}>
      {validSites.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography color="text.secondary">No sites with coordinates available</Typography>
        </Box>
      )}
      {validSites.length > 0 && (
        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{ width: '100%', height: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {validSites.map((site) => {
            const coords = parseCoordinates(site.latitude, site.longtitude);
            if (!coords) return null;

            return (
              <Marker key={site.siteId} position={coords}>
                <Popup>
                  <Card sx={{ width: 280, borderRadius: 1 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                        {site.siteName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Location:</strong> {site.siteLocation}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>State:</strong> {site.state}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        <strong>Country:</strong> {site.country}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        <strong>Coordinates:</strong> {site.latitude}, {site.longtitude}
                      </Typography>
                      {site.description && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                          <strong>Description:</strong> {site.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </Box>
  );
};

export default SiteMap;
