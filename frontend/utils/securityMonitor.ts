// frontend/utils/securityMonitor.ts

const sendSecurityEvent = async (eventType: string, details: any) => {
  console.log(`Security Event: ${eventType}`, details);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/security/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Adicionar token de autenticação se necessário
      },
      body: JSON.stringify({ eventType, details }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Failed to send security event:', data.detail || response.statusText);
    }
  } catch (error) {
    console.error('Error sending security event:', error);
  }
};

export const setupSecurityMonitoring = () => {
  console.log("Setting up security monitoring...");

  // Detect full-screen mode changes
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      sendSecurityEvent('EXIT_FULLSCREEN', { timestamp: new Date().toISOString() });
    }
  });

  // Detect Alt+Tab or other window changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendSecurityEvent('WINDOW_HIDDEN', { timestamp: new Date().toISOString() });
    }
  });

  // Prevent right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    sendSecurityEvent('RIGHT_CLICK_PREVENTED', { timestamp: new Date().toISOString(), mouseX: e.clientX, mouseY: e.clientY });
  });

  // Prevent certain key combinations (e.g., Ctrl+C, Ctrl+V, F12)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u')) || (e.metaKey && (e.key === 'c' || e.key === 'v' || e.key === 'u'))) {
      e.preventDefault();
      sendSecurityEvent('KEY_COMBINATION_BLOCKED', { key: e.key, ctrlKey: e.ctrlKey, metaKey: e.metaKey, timestamp: new Date().toISOString() });
    }
  });

  console.log("Security monitoring setup complete.");
};