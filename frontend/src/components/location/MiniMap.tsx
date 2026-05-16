import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from '@goongmaps/goong-map-react';
import Box from '@mui/material/Box';

interface MiniMapProps {
  lat: number;
  lng: number;
  zoom?: number;
}

export function MiniMap({ lat, lng, zoom = 14 }: MiniMapProps) {
  const [viewport, setViewport] = useState({
    latitude: lat,
    longitude: lng,
    zoom: zoom,
  });

  // Update viewport when lat/lng props change
  useEffect(() => {
    setViewport((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  }, [lat, lng]);

  const mapTilesKey = import.meta.env.VITE_GOONG_MAP_TILES_KEY;

  if (!mapTilesKey) {
    return (
      <Box sx={{ p: 2, bgcolor: '#fee2e2', color: '#b91c1c', borderRadius: '12px', fontSize: 12 }}>
        Thiếu Goong Map Tiles Key. Vui lòng kiểm tra file .env
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 200,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        '& .goongjs-ctrl-logo': { display: 'none' }, // Hide logo for mini map
      }}
    >
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
        goongApiAccessToken={mapTilesKey}
        mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
      >
        <Marker latitude={lat} longitude={lng} offsetLeft={-12} offsetTop={-24}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </Marker>
      </ReactMapGL>
    </Box>
  );
}
