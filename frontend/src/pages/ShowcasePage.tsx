import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ShowcasePage = () => {
  return (
    <MobileLayout>
      <AppHeader title="Component Showcase" onBack={() => console.log('Back clicked')} />

      <Box sx={{ p: 2, pb: 10, overflowY: 'auto' }}>
        {/* Buttons */}
        <Box component="section" sx={{ mb: 3 }}>
          <Typography variant="h2" sx={{ fontSize: '1.125rem', mb: 1.5 }}>
            Buttons
          </Typography>
          <Box>
            <Box>
              <Button variant="primary" fullWidth>
                Primary Button
              </Button>
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Button variant="secondary" fullWidth>
                Secondary Button
              </Button>
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Button variant="outline" fullWidth>
                Outline Button
              </Button>
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Button variant="ghost" fullWidth>
                Ghost Button
              </Button>
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Button variant="primary" fullWidth loading>
                Loading Button
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <Box sx={{ flex: 1 }}>
                <Button variant="primary" fullWidth>
                  Half
                </Button>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button variant="secondary" fullWidth>
                  Half
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Inputs */}
        <Box component="section" sx={{ mb: 3 }}>
          <Typography variant="h2" sx={{ fontSize: '1.125rem', mb: 1.5 }}>
            Inputs
          </Typography>
          <Box>
            <Box>
              <Input label="Standard Input" placeholder="Enter text..." />
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Input label="Input with Error" error="This field is required" placeholder="Enter text..." />
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Input label="Disabled Input" disabled placeholder="Cannot type here" />
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Input label="Password" type="password" placeholder="Enter password" />
            </Box>
          </Box>
        </Box>

        {/* Cards */}
        <Box component="section">
          <Typography variant="h2" sx={{ fontSize: '1.125rem', mb: 1.5 }}>
            Cards
          </Typography>
          <Box>
            <Box>
              <Card>
                <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>
                  Standard Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is a standard card component used for displaying content.
                </Typography>
              </Card>
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Card onClick={() => console.log('Card clicked')}>
                <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>
                  Clickable Card
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  This card has hover effects and an onClick handler.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  chạy đượt gồi nha thỷ ;-;
                </Typography>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default ShowcasePage;
