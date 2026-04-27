import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';

const ShowcasePage = () => {
  return (
    <MobileLayout>
      <AppHeader title="Component Showcase" onBack={() => console.log('Back clicked')} />

      <div className="p-4 space-y-6 overflow-y-auto pb-20">
        {/* Buttons */}
        <section>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Buttons</h2>
          <div className="space-y-3">
            <Button variant="primary" fullWidth>
              Primary Button
            </Button>
            <Button variant="secondary" fullWidth>
              Secondary Button
            </Button>
            <Button variant="outline" fullWidth>
              Outline Button
            </Button>
            <Button variant="ghost" fullWidth>
              Ghost Button
            </Button>
            <Button variant="primary" fullWidth loading>
              Loading Button
            </Button>
            <div className="flex gap-2">
              <Button variant="primary" className="flex-1">
                Half
              </Button>
              <Button variant="secondary" className="flex-1">
                Half
              </Button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Inputs</h2>
          <div className="space-y-3">
            <Input label="Standard Input" placeholder="Enter text..." />
            <Input label="Input with Error" error="This field is required" placeholder="Enter text..." />
            <Input label="Disabled Input" disabled placeholder="Cannot type here" />
            <Input label="Password" type="password" placeholder="Enter password" />
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Cards</h2>
          <div className="space-y-3">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">Standard Card</h3>
              <p className="text-sm text-gray-500">This is a standard card component used for displaying content.</p>
            </Card>
            <Card className="p-4" onClick={() => console.log('Card clicked')}>
              <h3 className="font-semibold text-gray-800 mb-1">Clickable Card</h3>
              <p className="text-sm text-gray-500">This card has hover effects and an onClick handler.</p>
              <p className="text-sm text-gray-500">Cái này vẫn chưa chạy được ;-;</p>
            </Card>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

export default ShowcasePage;
