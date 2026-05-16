import { useEffect, useState } from 'react';
import ReactMapGL, { Marker } from '@goongmaps/goong-map-react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { RescueLocation } from '../../types/rescue.type';
import { locationService } from '../../services/location.service';

interface LocationPickerDialogProps {
  open: boolean;
  value: RescueLocation | null;
  onClose: () => void;
  onConfirm: (location: RescueLocation) => void;
}

const DEFAULT_LOCATION = {
  lat: 10.7769,
  lng: 106.7009,
};

function getLngLat(event: any): { lng: number; lat: number } | null {
  if (Array.isArray(event?.lngLat)) {
    return { lng: event.lngLat[0], lat: event.lngLat[1] };
  }

  if (typeof event?.lngLat?.lng === 'number' && typeof event?.lngLat?.lat === 'number') {
    return { lng: event.lngLat.lng, lat: event.lngLat.lat };
  }

  if (typeof event?.lngLat?.[0] === 'number' && typeof event?.lngLat?.[1] === 'number') {
    return { lng: event.lngLat[0], lat: event.lngLat[1] };
  }

  return null;
}

export function LocationPickerDialog({ open, value, onClose, onConfirm }: LocationPickerDialogProps) {
  const mapTilesKey = import.meta.env.VITE_GOONG_MAP_TILES_KEY;
  const initialLat = value?.lat && value.lat !== 0 ? value.lat : DEFAULT_LOCATION.lat;
  const initialLng = value?.lng && value.lng !== 0 ? value.lng : DEFAULT_LOCATION.lng;

  const [selectedLocation, setSelectedLocation] = useState<RescueLocation>({
    address: value?.address || '',
    lat: initialLat,
    lng: initialLng,
    placeId: value?.placeId,
  });
  const [viewport, setViewport] = useState({
    latitude: initialLat,
    longitude: initialLng,
    zoom: value?.lat && value.lng ? 15 : 12,
  });
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isDetectingDeviceLocation, setIsDetectingDeviceLocation] = useState(false);

  useEffect(() => {
    if (!open) return;

    const nextLat = value?.lat && value.lat !== 0 ? value.lat : DEFAULT_LOCATION.lat;
    const nextLng = value?.lng && value.lng !== 0 ? value.lng : DEFAULT_LOCATION.lng;
    const hasExistingLocation = Boolean(value?.lat && value.lat !== 0 && value?.lng && value.lng !== 0);

    setSelectedLocation({
      address: value?.address || '',
      lat: nextLat,
      lng: nextLng,
      placeId: value?.placeId,
    });
    setViewport((prev) => ({
      ...prev,
      latitude: nextLat,
      longitude: nextLng,
      zoom: hasExistingLocation ? 15 : 12,
    }));

    if (hasExistingLocation || !navigator.geolocation) return;

    setIsDetectingDeviceLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        updateSelectedLocation(lat, lng);
        setViewport((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          zoom: 16,
        }));
        setIsDetectingDeviceLocation(false);
      },
      () => {
        setIsDetectingDeviceLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  }, [open, value]);

  const updateSelectedLocation = async (lat: number, lng: number) => {
    setSelectedLocation((prev) => ({
      ...prev,
      lat,
      lng,
    }));
    setViewport((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    setIsResolvingAddress(true);
    try {
      const resolved = await locationService.reverseGeocode(lat, lng);
      setSelectedLocation({
        address: resolved?.address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
      });
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const handleMapClick = (event: any) => {
    const lngLat = getLngLat(event);
    if (!lngLat) return;
    updateSelectedLocation(lngLat.lat, lngLat.lng);
  };

  const handleMarkerDragEnd = (event: any) => {
    const lngLat = getLngLat(event);
    if (!lngLat) return;
    updateSelectedLocation(lngLat.lat, lngLat.lng);
  };

  const handleConfirm = () => {
    onConfirm(selectedLocation);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Chọn vị trí công ty</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {isDetectingDeviceLocation
              ? 'Đang lấy vị trí thiết bị để đưa bản đồ tới gần bạn...'
              : 'Click vào bản đồ hoặc kéo marker để đặt đúng vị trí công ty.'}
          </Typography>

          {mapTilesKey ? (
            <Box
              sx={{
                height: 420,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                '& .goongjs-ctrl-logo': { display: 'none' },
              }}
            >
              <ReactMapGL
                {...viewport}
                width="100%"
                height="100%"
                onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
                onClick={handleMapClick}
                goongApiAccessToken={mapTilesKey}
                mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
              >
                <Marker
                  latitude={selectedLocation.lat}
                  longitude={selectedLocation.lng}
                  draggable
                  offsetLeft={-18}
                  offsetTop={-36}
                  onDragEnd={handleMarkerDragEnd}
                >
                  <LocationOnRoundedIcon
                    sx={{ fontSize: 36, color: 'error.main', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
                  />
                </Marker>
              </ReactMapGL>
            </Box>
          ) : (
            <Box sx={{ p: 2, bgcolor: '#fee2e2', color: '#b91c1c', borderRadius: 2 }}>
              Thiếu Goong Map Tiles Key. Vui lòng kiểm tra file .env
            </Box>
          )}

          <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {isResolvingAddress ? 'Đang lấy địa chỉ...' : selectedLocation.address || 'Chưa có địa chỉ'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!mapTilesKey}>
          Xác nhận vị trí
        </Button>
      </DialogActions>
    </Dialog>
  );
}
