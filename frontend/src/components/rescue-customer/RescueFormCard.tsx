import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Input';
import { IncidentTypeSelector } from './IncidentTypeSelector';
import { ImageUploader } from './ImageUploader';
import { AddressAutocomplete } from '../location/AddressAutocomplete';
import { CurrentLocationButton } from '../location/CurrentLocationButton';
import { MiniMap } from '../location/MiniMap';
import { IncidentType, RescueLocation } from '@/types/rescue.type';

interface RescueFormCardProps {
  incidentType: IncidentType | null;
  description: string;
  location: RescueLocation | null;
  images: File[];
  isSearching: boolean;
  onIncidentTypeChange: (type: IncidentType | null) => void;
  onDescriptionChange: (val: string) => void;
  onLocationChange: (loc: RescueLocation | null) => void;
  onImagesChange: (files: File[]) => void;
  onRetryGps: () => void;
  onSearch: () => void;
  geoStatus: string;
  geoError: string | null;
  incidentTypeError?: string;
  descriptionError?: string;
  locationError?: string;
}

export function RescueFormCard({
  incidentType,
  description,
  location,
  images,
  isSearching,
  onIncidentTypeChange,
  onDescriptionChange,
  onLocationChange,
  onImagesChange,
  onRetryGps,
  onSearch,
  geoStatus,
  geoError: _geoError,
  incidentTypeError,
  descriptionError,
  locationError,
}: RescueFormCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* Informational Banner */}
      <Box
        sx={{
          bgcolor: '#fff7ed',
          border: '1px solid #ffedd5',
          borderRadius: '12px',
          p: 2,
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ color: '#f97316', mt: 0.25 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#9a3412', fontWeight: 700, mb: 0.5, fontSize: 14 }}>
            Thông tin quan trọng
          </Typography>
          <Typography variant="body2" sx={{ color: '#c2410c', fontSize: 13, lineHeight: 1.5 }}>
            Vui lòng cung cấp thông tin chi tiết để chúng tôi có thể hỗ trợ bạn nhanh nhất.
          </Typography>
        </Box>
      </Box>

      {/* Incident Type */}
      <IncidentTypeSelector value={incidentType} onChange={onIncidentTypeChange} error={incidentTypeError} />

      {/* Description */}
      <Textarea
        label="Mô tả tình trạng xe"
        placeholder="Mô tả chi tiết tình trạng xe của bạn..."
        required
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        error={descriptionError}
        rows={4}
      />

      {/* Location Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <AddressAutocomplete value={location} onChange={onLocationChange} error={locationError} />
          <CurrentLocationButton onClick={onRetryGps} loading={geoStatus === 'loading'} />
        </Box>

        {location && location.lat !== 0 && location.lng !== 0 && <MiniMap lat={location.lat} lng={location.lng} />}
      </Box>

      {/* Image Uploader */}
      <ImageUploader images={images} onChange={onImagesChange} maxCount={6} />

      {/* Submit button */}
      <Box sx={{ pt: 1 }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isSearching}
          onClick={onSearch}
          id="btn-search-rescue"
          sx={{ height: 56, borderRadius: '12px', fontSize: 16 }}
        >
          Tìm kiếm dịch vụ cứu hộ
        </Button>
      </Box>
    </Box>
  );
}
