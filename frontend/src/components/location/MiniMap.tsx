import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from '@goongmaps/goong-map-react';
import Box from '@mui/material/Box';

export interface CompanyMarker {
  id: string;
  name: string;
  index: number;
  lat: number;
  lng: number;
  distance_km?: number;
}

interface MiniMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  companies?: CompanyMarker[];
}

export function MiniMap({ lat, lng, zoom = 14, companies }: MiniMapProps) {
  const getCalculatedZoom = () => {
    if (zoom !== 14) return zoom;
    if (!companies || companies.length === 0) return zoom;
    const maxDistance = Math.max(...companies.map((c) => c.distance_km || 0));
    if (maxDistance <= 1) return 15;
    if (maxDistance <= 2) return 14;
    if (maxDistance <= 5) return 13;
    if (maxDistance <= 10) return 12;
    return 11;
  };

  const [viewport, setViewport] = useState(() => ({
    latitude: lat,
    longitude: lng,
    zoom: getCalculatedZoom(),
  }));

  // Update viewport when lat/lng/companies/zoom props change
  useEffect(() => {
    setViewport((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      zoom: getCalculatedZoom(),
    }));
  }, [lat, lng, companies, zoom]);

  const mapTilesKey = import.meta.env.VITE_GOONG_MAP_TILES_KEY;

  if (!mapTilesKey) {
    return (
      <Box sx={{ p: 2, bgcolor: '#fee2e2', color: '#b91c1c', borderRadius: '12px', fontSize: 13, textAlign: 'center' }}>
        ⚠️ Không thể hiển thị bản đồ lúc này. Vui lòng thử lại sau.
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
        {/* Customer Marker - Plain Red Pin */}
        <Marker latitude={lat} longitude={lng} offsetLeft={-12} offsetTop={-24}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </Marker>

        {/* Company Markers - Plain Navy Pins, name tooltips are shown on hover */}
        {companies?.map((company) => (
          <Marker key={company.id} latitude={company.lat} longitude={company.lng} offsetLeft={-12} offsetTop={-24}>
            <Box
              title={company.name}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
                '&:hover .company-map-label': {
                  display: 'block',
                },
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1e3a5f">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <Box
                className="company-map-label"
                sx={{
                  display: 'none',
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'rgba(30, 58, 95, 0.95)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  mb: 0.5,
                  zIndex: 100,
                }}
              >
                {company.name}
              </Box>
            </Box>
          </Marker>
        ))}
      </ReactMapGL>
    </Box>
  );
}
