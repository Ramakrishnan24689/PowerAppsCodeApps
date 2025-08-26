// src/components/layout/MainLayout.tsx
import { makeStyles } from '@fluentui/react-components';
import type { ReactNode } from 'react';
import SuiteHeader from './SuiteHeader';
import AppBar from './AppBar';

const useStyles = makeStyles({
  mainLayout: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100vh',
  },
  contentWrapper: {
    display: 'flex',
    width: '100%',
    minHeight: 'calc(100vh - 48px)', // Account for SuiteHeader height
    position: 'relative',
  },
  contentArea: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1366px', // Match Figma Communication Site width
    marginLeft: '48px', // Account for vertical AppBar width
    marginRight: 'auto',
    gap: 0, // No gaps between sections - they handle their own spacing
    '@media (max-width: 1024px)': {
      maxWidth: '100%',
      marginLeft: '0px', // Remove AppBar margin on tablet
    },
    '@media (max-width: 768px)': {
      marginLeft: '0px', // Ensure no AppBar spacing on mobile
      marginBottom: '48px', // Account for horizontal AppBar height
    },
  },
  mobileAppBarWrapper: {
    position: 'fixed',
    bottom: '0',
    left: '0', 
    right: '0', 
    zIndex: 1000,
    '@media (min-width: 769px)': {
      display: 'none'
    }
  }
});

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const styles = useStyles();

  return (
    <div className={styles.mainLayout}>
      <SuiteHeader />
      <div className={styles.contentWrapper}>
        <AppBar orientation="vertical" />
        <div className={styles.contentArea}>
          {children}
        </div>
      </div>
      {/* Mobile bottom AppBar */}
      <div className={styles.mobileAppBarWrapper}>
        <AppBar orientation="horizontal" />
      </div>
    </div>
  );
}
