import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

// 1. Google BigQuery Official Logo
export const BigQueryLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 4L7 13.8v19.7L24 43.3l17-9.8V13.8L24 4z" fill="#4285F4" />
    <path d="M24 9.5l12.2 7v14L24 37.5l-12.2-7v-14L24 9.5z" fill="#FFFFFF" />
    <path d="M24 14l7.8 4.5v9L24 32l-7.8-4.5v-9L24 14z" fill="#1A73E8" />
    <circle cx="24" cy="23" r="3" fill="#FFFFFF" />
    <circle cx="16" cy="18" r="2" fill="#FBBC04" />
    <circle cx="32" cy="18" r="2" fill="#34A853" />
    <circle cx="24" cy="30" r="2" fill="#EA4335" />
    <line x1="24" y1="23" x2="16" y2="18" stroke="#1A73E8" strokeWidth="1.5" />
    <line x1="24" y1="23" x2="32" y2="18" stroke="#1A73E8" strokeWidth="1.5" />
    <line x1="24" y1="23" x2="24" y2="30" stroke="#1A73E8" strokeWidth="1.5" />
  </svg>
);

// 2. SAP Official Logo
export const SAPLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 100 48" 
    className={className} 
    style={size ? { width: size * 2.08, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 4h92v40H4z" fill="#0070F2" rx="6" />
    <text 
      x="50" 
      y="32" 
      fill="#FFFFFF" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontWeight="900" 
      fontSize="27" 
      letterSpacing="2" 
      textAnchor="middle"
    >
      SAP
    </text>
  </svg>
);

// 3. Google Sheets Official Logo
export const GoogleSheetsLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M30 4H12C9.8 4 8 5.8 8 8v32c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V16L30 4z" fill="#0F9D58" />
    <path d="M30 4v12h10L30 4z" fill="#87CEAC" />
    <path d="M16 22h16v16H16z" fill="#FFFFFF" fillOpacity="0.3" />
    <path d="M16 22h16v3H16zm0 5h16v3H16zm0 5h16v3H16zm5-10v13h-2V22zm6 0v13h-2V22z" fill="#FFFFFF" />
  </svg>
);

// 4. HubSpot Official Logo
export const HubSpotLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="22" fill="#FFFFFF" />
    <path 
      d="M34 21.5v-3.8c1.3-.7 2.2-2 2.2-3.6 0-2.3-1.9-4.2-4.2-4.2-2.3 0-4.2 1.9-4.2 4.2 0 1.6.9 2.9 2.2 3.6v3.8c-1.8.4-3.3 1.5-4.2 3-1.6-.7-3.4-.8-5.1-.3l-7.7-6.2c.2-.5.3-1.1.3-1.7 0-2.6-2.1-4.7-4.7-4.7S4.1 10.7 4.1 13.3c0 2.6 2.1 4.7 4.7 4.7 1.2 0 2.2-.4 3.1-1.2l7.5 6.1c-.5 1.5-.4 3.1.2 4.5l-6.2 3.6c-.6-.5-1.4-.9-2.3-.9-2.2 0-4 1.8-4 4s1.8 4 4 4c2.2 0 4-1.8 4-4 0-.8-.3-1.6-.7-2.3l6-3.5c1.4 1.2 3.3 1.9 5.3 1.7v5.5c-1.3.6-2.2 1.9-2.2 3.4 0 2.1 1.7 3.8 3.8 3.8 2.1 0 3.8-1.7 3.8-3.8 0-1.5-.9-2.8-2.2-3.4v-5.5c3.2-.6 5.6-3.4 5.6-6.7 0-2.3-1.2-4.4-3-5.6z" 
      fill="#FF7A59" 
    />
  </svg>
);

// 5. Salesforce Official Logo
export const SalesforceLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 54 36" 
    className={className} 
    style={size ? { width: size * 1.5, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M21.5 5.5C24.1 2.3 28 0 32.5 0 38.6 0 43.8 4.2 45.2 10c2.8.5 5 2.7 5.7 5.5 2.2 1.6 3.6 4.2 3.6 7.1 0 5-4.1 9.1-9.1 9.1h-33C5.6 31.7 0 26.1 0 19.3c0-6 4.3-11 10-12.1 1.7-4.1 5.7-7 10.4-7 3.1 0 6 1.3 8 3.4l-6.9 1.9z" 
      fill="#00A1E0" 
    />
    <path 
      d="M17.4 17.5c-.7-.8-1.7-1.3-2.8-1.3-1.8 0-3.3 1.3-3.6 3-.1.4-.1.8 0 1.2.3 1.7 1.8 3 3.6 3 1.1 0 2.1-.5 2.8-1.3l1.8 1.4c-1.2 1.4-2.8 2.2-4.6 2.2-3.2 0-5.8-2.6-5.8-5.8 0-3.2 2.6-5.8 5.8-5.8 1.8 0 3.4.8 4.6 2.2l-1.8 1.2zm6.2 5.6h-2.3v-8.2h2.3v8.2zm6.6-4.5c0 1.5-.9 2.7-2.3 2.7-1.4 0-2.3-1.2-2.3-2.7 0-1.5.9-2.7 2.3-2.7 1.4 0 2.3 1.2 2.3 2.7zm2.3 0c0-2.6-1.9-4.7-4.6-4.7-2.7 0-4.6 2.1-4.6 4.7 0 2.6 1.9 4.7 4.6 4.7 2.7 0 4.6-2.1 4.6-4.7z" 
      fill="#FFFFFF" 
    />
  </svg>
);

// 6. Twenty CRM Official Logo
export const TwentyLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="10" fill="#090A0B" />
    {/* Stylized 20 logo with geometric cuts */}
    <path 
      d="M12 17c0-2.8 2.2-5 5-5h4c2.8 0 5 2.2 5 5v3c0 2.8-2.2 5-5 5h-4v4h9v4H12V24h9v-4h-4c-2.8 0-5-2.2-5-5v-2z" 
      fill="#FFFFFF" 
    />
    <path 
      d="M28 17c0-2.8 2.2-5 5-5h2c2.8 0 5 2.2 5 5v14c0 2.8-2.2 5-5 5h-2c-2.8 0-5-2.2-5-5V17zm4 0v14h4V17h-4z" 
      fill="#FFFFFF" 
    />
  </svg>
);

// 7. Jira Official Logo
export const JiraLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M23.9 4.1L12.5 15.5c-4.7 4.7-4.7 12.3 0 17l6.8 6.8 4.6-4.6-6.8-6.8c-2.2-2.2-2.2-5.7 0-7.9l6.8-6.8 0-9.1z" 
      fill="#0052CC" 
    />
    <path 
      d="M24.1 4.1l11.4 11.4c4.7 4.7 4.7 12.3 0 17l-6.8 6.8-4.6-4.6 6.8-6.8c2.2-2.2 2.2-5.7 0-7.9l-6.8-6.8 0-9.1z" 
      fill="#2684FF" 
    />
    <path 
      d="M24 14.5l-5.7 5.7c-2.2 2.2-2.2 5.7 0 7.9l5.7 5.7 5.7-5.7c2.2-2.2 2.2-5.7 0-7.9L24 14.5z" 
      fill="#0052CC" 
      fillOpacity="0.8" 
    />
  </svg>
);

// 8. Gmail Official Logo
export const GmailLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 14.5v22c0 2.5 2 4.5 4.5 4.5h4v-18l11.5 8.5 11.5-8.5v18h4c2.5 0 4.5-2 4.5-4.5v-22L24 25 4 14.5z" fill="#4285F4" />
    <path d="M44 10.5L35.5 17 24 25 12.5 17 4 10.5c.8-1.5 2.4-2.5 4.2-2.5h31.6c1.8 0 3.4 1 4.2 2.5z" fill="#EA4335" />
    <path d="M4 10.5V14.5L24 29.5l20-15v-4c0-1.2-.5-2.2-1.3-2.9L24 21.5 5.3 7.6C4.5 8.3 4 9.3 4 10.5z" fill="#FBBC04" />
    <path d="M44 14.5L24 29.5 4 14.5v22c0 .4 0 .7.1 1.1L24 22l19.9 15.6c.1-.4.1-.7.1-1.1v-22z" fill="#34A853" fillOpacity="0.4" />
  </svg>
);

// 9. Google Calendar Official Logo
export const GoogleCalendarLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="8" width="36" height="34" rx="4" fill="#FFFFFF" stroke="#1A73E8" strokeWidth="3" />
    <path d="M6 16h36V8H6v8z" fill="#1A73E8" />
    <circle cx="14" cy="7" r="2" fill="#1A73E8" />
    <circle cx="34" cy="7" r="2" fill="#1A73E8" />
    <text 
      x="24" 
      y="35" 
      fill="#1A73E8" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fontWeight="700" 
      fontSize="16" 
      textAnchor="middle"
    >
      31
    </text>
  </svg>
);

// 10. Pipedrive Official Logo
export const PipedriveLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="10" fill="#000000" />
    <circle cx="24" cy="24" r="14" fill="#00B569" />
    <path 
      d="M21 16h6c3.9 0 7 3.1 7 7s-3.1 7-7 7h-2.5v5H21V16zm3.5 10.5H27c1.9 0 3.5-1.6 3.5-3.5S28.9 19.5 27 19.5h-2.5v7z" 
      fill="#FFFFFF" 
    />
  </svg>
);

// 11. RD Station Official Logo
export const RDStationLogo: React.FC<LogoProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 48 48" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="10" fill="#0B192C" />
    <path 
      d="M12 28l9-14h6l-6 10h8l-11 14 3-7h-6z" 
      fill="#00D2B4" 
    />
    <circle cx="34" cy="18" r="3" fill="#00A3FF" />
  </svg>
);

// Helper function to render any logo dynamically by ID
export const renderOfficialLogo = (appId: string, className = 'w-4 h-4'): React.ReactNode => {
  const normalized = appId.toLowerCase().replace(/[@#_\-\s]/g, '');
  switch (normalized) {
    case 'sap':
      return <SAPLogo className={className} />;
    case 'twenty':
      return <TwentyLogo className={className} />;
    case 'bigquery':
    case 'googlebigquery':
      return <BigQueryLogo className={className} />;
    case 'sheets':
    case 'googlesheets':
      return <GoogleSheetsLogo className={className} />;
    case 'hubspot':
      return <HubSpotLogo className={className} />;
    case 'salesforce':
      return <SalesforceLogo className={className} />;
    case 'pipedrive':
      return <PipedriveLogo className={className} />;
    case 'rdstation':
    case 'rd':
      return <RDStationLogo className={className} />;
    case 'jira':
      return <JiraLogo className={className} />;
    case 'gmail':
      return <GmailLogo className={className} />;
    case 'calendar':
    case 'googleagenda':
    case 'googlecalendar':
      return <GoogleCalendarLogo className={className} />;
    default:
      return null;
  }
};
