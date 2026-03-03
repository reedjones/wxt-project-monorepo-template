import React, { useEffect, useState } from 'react';
import { Button, Card, Badge } from '@wxt-monorepo/ui';
import { loadFlags, isEnabled, setFlag } from '@wxt-monorepo/shared/feature-flags';

const brandStyle = {
  '--color-brand-500': '34 197 94',
  '--color-brand-600': '22 163 74',
  '--color-brand-50': '240 253 244',
} as React.CSSProperties;

export default function OptionsApp() {
  const [betaFeature, setBetaFeature] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadFlags({ betaFeature: false }).then(() => {
      setBetaFeature(isEnabled('betaFeature'));
    });
  }, []);

  async function handleSave() {
    await setFlag('betaFeature', betaFeature);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ ...brandStyle, maxWidth: '480px', margin: '32px auto', padding: '16px' }}>
      <Card title="Extension B — Options">
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={betaFeature}
              onChange={(e) => setBetaFeature(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>Enable beta feature</span>
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
