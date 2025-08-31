'use client';

import { useEffect } from 'react';
import { setupSecurityMonitoring } from '../../../utils/securityMonitor';

/**
 * @component SecurityMonitor
 * @description Componente que configura o monitoramento de segurança ao montar.
 * Utiliza `useEffect` para chamar a função `setupSecurityMonitoring` uma única vez quando o componente é montado.
 * Não renderiza nenhum elemento visível, servindo apenas para inicializar o monitoramento.
 */
export default function SecurityMonitor() {
  useEffect(() => {
    setupSecurityMonitoring();
  }, []);

  return null;
}