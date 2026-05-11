import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { RescueLocation } from '../../types/rescue.type';
import { useAddressSearch } from '../../hooks/useAddressSearch';
import { useEffect, useState } from 'react';

interface AddressAutocompleteProps {
  value: RescueLocation | null;
  onChange: (location: RescueLocation | null) => void;
  error?: string;
  placeholder?: string;
  label?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  error,
  placeholder = 'Nhập địa chỉ của bạn...',
  label = 'Vị trí hiện tại',
}: AddressAutocompleteProps) {
  const { query, setQuery, options, loading, clearOptions, getFullLocation } = useAddressSearch();
  const [inputValue, setInputValue] = useState('');
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  // Sync internal input value with prop value (e.g. from GPS)
  useEffect(() => {
    if (value) {
      setInputValue(value.address);
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleSelect = async (newValue: RescueLocation | null) => {
    if (!newValue) {
      onChange(null);
      return;
    }

    setIsFetchingDetail(true);
    try {
      const fullLocation = await getFullLocation(newValue);
      onChange(fullLocation);
    } catch (error) {
      console.error('Error fetching detail:', error);
      onChange(newValue);
    } finally {
      setIsFetchingDetail(false);
      clearOptions();
    }
  };

  return (
    <Autocomplete
      id="address-autocomplete"
      fullWidth
      options={options}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.address)}
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText={query.length === 0 ? 'Bắt đầu nhập địa chỉ...' : 'Không tìm thấy địa chỉ'}
      loading={loading || isFetchingDetail}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        setQuery(newInputValue);
      }}
      onChange={(_, newValue) => handleSelect(newValue as RescueLocation | null)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required
          error={!!error}
          helperText={error}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            sx: { borderRadius: '10px', height: 56 }, // Changed to 10px to match MUI theme shape
            endAdornment: (
              <>
                {loading || isFetchingDetail ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {option.address.split(',')[0]}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {option.address.split(',').slice(1).join(',').trim()}
              </Typography>
            </Box>
          </li>
        );
      }}
    />
  );
}
