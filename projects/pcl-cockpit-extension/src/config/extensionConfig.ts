/**
 * PCL Cockpit Companion Extension Configuration
 * Connects securely to the local sovereign daemons and PCL Cockpit.
 */

export const EXTENSION_CONFIG = {
  version: '3.7.0',
  cockpitBaseUrl: 'http://localhost:3001',
  omniRouteBaseUrl: 'http://localhost:20130',
  layaBaseUrl: 'http://localhost:20140',
  endpoints: {
    cockpitStatus: '/api/aeos/status',
    layaHealth: '/health',
    omniRouteChat: '/v1/chat/completions',
    semanticCacheCheck: '/v1/cache/semantic-check',
    cryptoAuditLog: '/api/audit/log'
  },
  hitl: {
    defaultTtlSeconds: 120, // Timeout de 2 minutos para aprovação humana
    riskThresholdLow: 'LOW_RISK_AUTO_EXECUTE',
    riskThresholdCritical: 'CRITICAL_RISK_REQUIRE_HITL'
  },
  shadowDom: {
    hostId: '__pcl_cockpit_companion_root__',
    zIndex: 2147483647 // z-index máximo para flutuar sobre Salesforce/Jira/SAP
  }
};
