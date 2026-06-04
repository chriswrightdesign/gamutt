import React from 'react';

interface GamuttLogoProps {
    height?: string;
    width?: string;
}

/** Default gamutt brand mark — three ascending bars (a gamut/range motif). Uses currentColor so it inherits the header text colour. */
const GamuttLogo = ({height = '24', width = '24'}: GamuttLogoProps) => {
    return (
        <svg
            height={height}
            width={width}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <rect x="3" y="14" width="4" height="7" rx="1.5" />
            <rect x="10" y="9" width="4" height="12" rx="1.5" />
            <rect x="17" y="4" width="4" height="17" rx="1.5" />
        </svg>
    );
};

export {GamuttLogo};
