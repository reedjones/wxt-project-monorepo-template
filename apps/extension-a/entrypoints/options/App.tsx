import React, { useEffect, useState } from 'react';
import { Button, Card, Badge } from '@wxt-monorepo/ui';
import { loadFlags, isEnabled, setFlag } from '@wxt-monorepo/shared/feature-flags';

const brandStyle = {
  '--color-brand-500': '59 130 246',
  '--color-brand-600': '37 99 235',
  '--color-brand-50': '239 246 255',
} as React.CSSProperties;

export default function OptionsApp() {
  const [newUi, setNewUi] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadFlags({ newUi: false }).then(() => {
      setNewUi(isEnabled('newUi'));
    });
  }, []);

  async function handleSave() {
    await setFlag('newUi', newUi);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ ...brandStyle, maxWidth: '480px', margin: '32px auto', padding: '16px' }}>
      <Card title="Extension A — Options">
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newUi}
              onChange={(e) => setNewUi(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>Enable new UI</span>
          </label>

          <div className="flex items-center gap-2">
            <Button onClick={handleSave}>Save Settings</Button>
            {saved && <Badge label="Saved!" variant="success" />}
          </div>
        </div>
      </Card>
    </div>
  );
}
