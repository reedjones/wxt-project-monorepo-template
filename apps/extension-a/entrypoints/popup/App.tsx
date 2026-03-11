import React, { useState } from 'react';
import { Button, Card, Badge } from '@wxt-monorepo/ui';
import { sendMessage } from '@wxt-monorepo/shared/messaging';
import { logger } from '@wxt-monorepo/shared/logging';

const log = logger.child('popup-a');

// Extension A brand override — blue theme (matches CSS var defaults)
const brandStyle = {
  '--color-brand-500': '59 130 246',
  '--color-brand-600': '37 99 235',
  '--color-brand-50': '239 246 255',
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
      <Card title="Extension A">
        <p className="mb-3">Welcome to Extension A!</p>
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
