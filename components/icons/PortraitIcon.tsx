
import React from 'react';

export const PortraitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="6" y="3" width="12" height="18" rx="2" ry="2"></rect>
  </svg>
);
