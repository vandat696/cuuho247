import { IncidentType, INCIDENT_TYPES } from '@/types/rescue.type';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

interface IncidentTypeSelectorProps {
  value: IncidentType | null;
  onChange: (type: IncidentType) => void;
  error?: string;
}

export function IncidentTypeSelector({ value, onChange, error }: IncidentTypeSelectorProps) {
  const handleChange = (e: SelectChangeEvent<string>) => {
    const slug = e.target.value;
    const found = INCIDENT_TYPES.find((t) => t.slug === slug);
    if (found) onChange(found);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
        Loại sự cố{' '}
        <Typography component="span" sx={{ color: 'error.main' }}>
          *
        </Typography>
      </Typography>

      <FormControl fullWidth error={!!error}>
        <Select
          displayEmpty
          value={value?.slug ?? ''}
          onChange={handleChange}
          renderValue={(selected) => {
            if (!selected) {
              return <Typography sx={{ color: 'text.disabled', fontSize: 15 }}>Chọn loại sự cố</Typography>;
            }
            return INCIDENT_TYPES.find((t) => t.slug === selected)?.label ?? selected;
          }}
          sx={{
            borderRadius: '10px',
            fontSize: 15,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? 'error.main' : '#e2e8f0',
              borderWidth: '1.5px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: error ? 'error.main' : '#1e3a5f',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1e3a5f',
              borderWidth: '1.5px',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '12px',
                mt: 0.5,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                maxHeight: 300,
              },
            },
          }}
        >
          {INCIDENT_TYPES.map((type) => (
            <MenuItem key={type.slug} value={type.slug} sx={{ fontSize: 15, py: 1 }}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
}
