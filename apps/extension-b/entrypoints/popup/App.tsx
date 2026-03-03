import React, { useState } from 'react';
import { Button, Card, Badge } from '@wxt-monorepo/ui';
import { sendMessage } from '@wxt-monorepo/shared/messaging';
import { logger } from '@wxt-monorepo/shared/logging';

const log = logger.child('popup-b');

// Extension B brand override — green theme
const brandStyle = {
  '--color-brand-500': '34 197 94',
  '--color-brand-600': '22 163 74',
  '--color-brand-50': '240 253 244',
} as React.CSSProperties;

export default function App() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  async function handlePing() {
    setStatus('loading');
    try {
      const res = await sendMessage('PING', {});
      log.info('Pong!', res);
      setStatus('ok');
    } catch (err) {
      log.error('Ping failed', { err });
      setStatus('error');
    }
  }

  return (
    <div style={{ ...brandStyle, minWidth: '280px', padding: '16px' }}>
      <Card title="Extension B">
        <p className="mb-3">Welcome to Extension B!</p>
        <div className="flex items-center gap-2">
          <Button onClick={handlePing} disabled={status === 'loading'}>
            {status === 'loading' ? 'Pinging…' : 'Ping Background'}
          </Button>
          {status === 'ok' && <Badge label="Pong!" variant="success" />}
          {status === 'error' && <Badge label="Error" variant="error" />}
        </div>
      </Card>
    </div>
  );
}
