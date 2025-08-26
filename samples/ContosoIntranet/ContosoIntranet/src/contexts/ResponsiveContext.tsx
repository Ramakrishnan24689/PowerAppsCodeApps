import React, { createContext, useContext, useEffect, useState } from 'react';

export interface BreakpointValues {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  breakpoints: BreakpointValues;
}

const defaultBreakpoints: BreakpointValues = {
  mobile: 768,   // Mobile breakpoint (up to tablets)
  tablet: 1024,  // Tablet breakpoint (up to small desktops) 
  desktop: 1366  // Desktop breakpoint (large screens)
};

const ResponsiveContext = createContext<ResponsiveContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  screenWidth: 1366,
  breakpoints: defaultBreakpoints
});

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within ResponsiveProvider');
  }
  return context;
};

interface ResponsiveProviderProps {
  children: React.ReactNode;
  breakpoints?: BreakpointValues;
}

export default function ResponsiveProvider({ 
  children, 
  breakpoints = defaultBreakpoints 
}: ResponsiveProviderProps) {
  const [screenWidth, setScreenWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return breakpoints.desktop;
  });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      console.log('Window resized to:', newWidth); // Debug log
      setScreenWidth(newWidth);
    };

    // Set initial width
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth <= breakpoints.mobile;
  const isTablet = screenWidth > breakpoints.mobile && screenWidth <= breakpoints.tablet;
  const isDesktop = screenWidth > breakpoints.tablet;

  // Debug logs
  console.log('ResponsiveContext - screenWidth:', screenWidth, 'isMobile:', isMobile, 'isTablet:', isTablet, 'isDesktop:', isDesktop);

  const value: ResponsiveContextType = {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    breakpoints
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export { ResponsiveProvider };
