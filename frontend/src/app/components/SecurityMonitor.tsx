'use client';

import { useEffect } from 'react';
import { setupSecurityMonitoring } from '../../../utils/securityMonitor';

export default function SecurityMonitor() {
  useEffect(() => {
    setupSecurityMonitoring();
  }, []);

  return null;
}