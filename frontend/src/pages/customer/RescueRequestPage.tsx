import Box from '@mui/material/Box';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { RescueFormCard } from '@/components/rescue/RescueFormCard';
import { useRescueRequest } from '@/hooks/useRescueRequest';

export default function RescueRequestPage() {
  const {
    form,
    errors,
    isSearching,
    geoStatus,
    geoError,
    setIncidentType,
    setDescription,
    setImages,
    setLocation,
    retryGps,
    handleSearch,
  } = useRescueRequest();

  return (
    <MobileLayout>
      <AppHeader title="Tìm kiếm cứu hộ" backFallback="/" />

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', px: 2, py: 3 }}>
        <RescueFormCard
          incidentType={form.incident_type}
          description={form.description}
          location={form.location}
          images={form.images}
          isSearching={isSearching}
          onIncidentTypeChange={setIncidentType}
          onDescriptionChange={setDescription}
          onLocationChange={setLocation}
          onImagesChange={setImages}
          onRetryGps={retryGps}
          onSearch={handleSearch}
          geoStatus={geoStatus}
          geoError={geoError}
          incidentTypeError={errors.incident_type}
          descriptionError={errors.description}
          locationError={errors.location}
        />
      </Box>
    </MobileLayout>
  );
}
