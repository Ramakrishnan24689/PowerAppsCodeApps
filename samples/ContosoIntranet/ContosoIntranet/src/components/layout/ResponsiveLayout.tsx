import React, { useState } from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { useResponsive } from '../../contexts/ResponsiveContext';
import SuiteHeader from './SuiteHeader';
import SiteHeader from './SiteHeader';
import MobileSiteHeader from './MobileSiteHeader';
import AppBar from './AppBar';
import Footer from './Footer';
import MobileNavigation from './MobileNavigation';

const useStyles = makeStyles({
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden'
  },
  
  mainLayout: {
    display: 'flex',
    flex: '1',
    minHeight: 0, // Important: allows flex children to shrink
    overflow: 'hidden',
    position: 'relative',
  },
  
  // Desktop layout (1366px+)
  contentAreaDesktop: {
    flex: '1',
    marginLeft: 'var(--app-bar-width)',
    ...shorthands.padding('16px'),
    overflow: 'auto',
    backgroundColor: 'var(--colorNeutralBackground1)',
    minHeight: 0, // Important: allows scrolling
  },
  
  // Tablet layout (834px)
  contentAreaTablet: {
    flex: '1',
    marginLeft: '0',
    ...shorthands.padding('16px'),
    paddingBottom: '60px', // Space for bottom AppBar
    overflow: 'auto',
    backgroundColor: 'var(--colorNeutralBackground1)',
    minHeight: 0, // Important: allows scrolling
  },
  
  // Mobile layout (375px)
  contentAreaMobile: {
    flex: '1',
    marginLeft: '0',
    ...shorthands.padding('12px'),
    paddingBottom: '60px', // Space for mobile nav
    overflow: 'auto',
    backgroundColor: 'var(--colorNeutralBackground1)',
    minHeight: 0, // Important: allows scrolling
  }
});

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const styles = useStyles();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine content area styling based on breakpoint
  const getContentAreaStyle = () => {
    if (isMobile) return styles.contentAreaMobile;
    if (isTablet) return styles.contentAreaTablet;
    return styles.contentAreaDesktop;
  };

  return (
    <div className={styles.appContainer}>
      <SuiteHeader />
      
      {isMobile ? (
        <MobileSiteHeader 
          siteTitle="Site title"
          siteLabels={["Confidential", "Corporate Advisory +2"]}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMenuOpen={isMobileMenuOpen}
        />
      ) : (
        <SiteHeader 
          siteTitle="Contoso Intranet"
          siteLabels={["Communication Site", "SharePoint Online"]}
          navItems={[
            { label: 'Home', active: true, href: '/' },
            { label: 'News', href: '/news' },
            { label: 'Documents', href: '/files' },
            { label: 'People', href: '/people' }
          ]}
          showEdit={false}
          showActions={true}
        />
      )}
      
      <div className={styles.mainLayout}>
        {/* Desktop: Vertical AppBar, Tablet: Hidden, Mobile: Hidden */}
        {isDesktop && <AppBar />}
        
        {/* Main Content Area */}
        <main className={getContentAreaStyle()} role="main">
          {children}
        </main>
      </div>
      
      {/* Site Footer - Hidden on mobile */}
      {!isMobile && <Footer />}
      
      {/* Mobile Navigation - Only shown on mobile */}
      {isMobile && <MobileNavigation />}
      
      {/* Tablet Bottom AppBar - Only shown on tablet */}
      {isTablet && (
        <div style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          backgroundColor: 'var(--colorNeutralBackground4)',
          borderTop: '1px solid var(--colorNeutralStroke3)'
        }}>
          <AppBar orientation="horizontal" />
        </div>
      )}
    </div>
  );
}
