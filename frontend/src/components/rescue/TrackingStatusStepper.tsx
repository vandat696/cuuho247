import { Box, Typography } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { NAVY, GREEN } from '@/components/rescue-company/RescueCompanyRequestShared';
import { CustomerRescueRequest } from '@/services/customer-rescue.service';
import { formatTimeOnly } from '@/utils/format';

export const STATUS_STEPS = [
  { id: 'pending', label: 'Yêu cầu đã gửi' },
  { id: 'accepted', label: 'Công ty đã nhận' },
  { id: 'in_progress', label: 'Xe đang di chuyển' },
  { id: 'arrived', label: 'Xe đã đến' },
  { id: 'completed', label: 'Hoàn thành' },
];

interface TrackingStatusStepperProps {
  request: CustomerRescueRequest;
}

export const TrackingStatusStepper = ({ request }: TrackingStatusStepperProps) => {
  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.id === request.status);

  const getStepTime = (stepId: string) => {
    if (stepId === 'pending') return request.created_at;
    if (stepId === 'accepted') return request.accepted_at || request.updated_at;
    if (stepId === 'in_progress') return request.started_at;
    if (stepId === 'arrived') return request.arrived_at;
    if (stepId === 'completed') return request.completed_at;
    return undefined;
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '16px',
        p: 3,
        mb: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        position: 'relative',
        zIndex: 2,
        mt: currentStatusIndex >= 0 ? 1 : 3,
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, mb: 2 }}>Trạng thái</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {request.status === 'cancelled' || request.status === 'rejected' ? (
          <>
            <Box sx={{ display: 'flex', position: 'relative', minHeight: 60 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 11,
                  top: 24,
                  bottom: -8,
                  width: 2,
                  bgcolor: GREEN,
                  zIndex: 0,
                }}
              />
              <Box sx={{ width: 24, height: 24, position: 'relative', zIndex: 1, mr: 2, flexShrink: 0, mt: 0.5 }}>
                <CheckCircle sx={{ color: GREEN, fontSize: 24 }} />
              </Box>
              <Box sx={{ flex: 1, pb: 3 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Yêu cầu đã gửi</Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.25 }}>
                  {formatTimeOnly(request.created_at)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', position: 'relative', minHeight: 60 }}>
              <Box sx={{ width: 24, height: 24, position: 'relative', zIndex: 1, mr: 2, flexShrink: 0, mt: 0.5 }}>
                <CheckCircle sx={{ color: '#ef4444', fontSize: 24 }} />
              </Box>
              <Box sx={{ flex: 1, pb: 3 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#ef4444' }}>
                  {request.status === 'cancelled' ? 'Yêu cầu đã bị huỷ' : 'Yêu cầu bị từ chối'}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.25 }}>
                  {formatTimeOnly(request.cancelled_at || request.updated_at)}
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          STATUS_STEPS.map((step, index) => {
            const isCompleted = currentStatusIndex >= index;
            const time = formatTimeOnly(getStepTime(step.id));
            const isLast = index === STATUS_STEPS.length - 1;

            return (
              <Box key={step.id} sx={{ display: 'flex', position: 'relative', minHeight: 60 }}>
                {/* Line connector */}
                {!isLast && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 11,
                      top: 24,
                      bottom: -8,
                      width: 2,
                      bgcolor: currentStatusIndex > index ? GREEN : '#e5e7eb',
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Icon */}
                <Box sx={{ width: 24, height: 24, position: 'relative', zIndex: 1, mr: 2, flexShrink: 0, mt: 0.5 }}>
                  {isCompleted ? (
                    <CheckCircle sx={{ color: GREEN, fontSize: 24 }} />
                  ) : (
                    <RadioButtonUnchecked sx={{ color: '#d1d5db', fontSize: 24 }} />
                  )}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, pb: 3 }}>
                  <Typography
                    sx={{ fontSize: 15, fontWeight: isCompleted ? 700 : 500, color: isCompleted ? NAVY : '#9ca3af' }}
                  >
                    {step.label}
                  </Typography>
                  {time ? (
                    <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.25 }}>{time}</Typography>
                  ) : (
                    <Typography sx={{ fontSize: 13, color: '#9ca3af', mt: 0.25 }}>Chờ xác nhận</Typography>
                  )}
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};
