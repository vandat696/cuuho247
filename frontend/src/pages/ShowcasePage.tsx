import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';

const ShowcasePage = () => {
  return (
    <MobileLayout>
      <AppHeader title="Component Showcase" onBack={() => console.log('Back clicked')} />

      <div style={{ padding: '16px', paddingBottom: '80px', overflowY: 'auto' }}>
        {/* Buttons */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 12px', color: '#1f2937' }}>Buttons</h2>
          <div>
            <div>
              <Button variant="primary" fullWidth>
                Primary Button
              </Button>
            </div>
            <div style={{ marginTop: '12px' }}>
              <Button variant="secondary" fullWidth>
                Secondary Button
              </Button>
            </div>
            <div style={{ marginTop: '12px' }}>
              <Button variant="outline" fullWidth>
                Outline Button
              </Button>
            </div>
            <div style={{ marginTop: '12px' }}>
              <Button variant="ghost" fullWidth>
                Ghost Button
              </Button>
            </div>
            <div style={{ marginTop: '12px' }}>
              <Button variant="primary" fullWidth loading>
                Loading Button
              </Button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <div style={{ flex: 1 }}>
                <Button variant="primary" fullWidth>
                  Half
                </Button>
              </div>
              <div style={{ flex: 1 }}>
                <Button variant="secondary" fullWidth>
                  Half
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 12px', color: '#1f2937' }}>Inputs</h2>
          <div>
            <div>
              <Input label="Standard Input" placeholder="Enter text..." />
            </div>
            <div style={{ marginTop: '12px' }}>
              <Input label="Input with Error" error="This field is required" placeholder="Enter text..." />
            </div>
            <div style={{ marginTop: '12px' }}>
              <Input label="Disabled Input" disabled placeholder="Cannot type here" />
            </div>
            <div style={{ marginTop: '12px' }}>
              <Input label="Password" type="password" placeholder="Enter password" />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 12px', color: '#1f2937' }}>Cards</h2>
          <div>
            <div>
              <Card>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontWeight: 600, color: '#1f2937', margin: '0 0 4px' }}>Standard Card</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                    This is a standard card component used for displaying content.
                  </p>
                </div>
              </Card>
            </div>
            <div style={{ marginTop: '12px' }}>
              <Card onClick={() => console.log('Card clicked')}>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontWeight: 600, color: '#1f2937', margin: '0 0 4px' }}>Clickable Card</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 8px' }}>
                    This card has hover effects and an onClick handler.
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Cái này vẫn chưa chạy được ;-;</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

export default ShowcasePage;
