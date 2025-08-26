// SiteHeader.tsx - Communication Site Header with hub navigation and site branding
import React from 'react';
import { 
  Text,
  makeStyles,
  shorthands,
  mergeClasses
} from '@fluentui/react-components';
import { Share16Regular, Heart16Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  siteHeader: {
    backgroundColor: '#ffffff', // White background from Figma
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
    ...shorthands.borderBottom('1px', 'solid', '#e1dfdd') // NeutralStroke2.Rest
  },
  
  // Hub Navigation Section
  hubNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '40px',
    ...shorthands.padding('0', '32px', '0', '80px'), // Add left padding for AppBar
    backgroundColor: '#ffffff',
    ...shorthands.borderBottom('1px', 'solid', '#e1dfdd'),
    '@media (max-width: 1024px)': {
      padding: '0 32px', // Reset on tablet
    },
    '@media (max-width: 768px)': {
      padding: '0 12px', // Reset on mobile
    },
  },
  
  hubNavLeft: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px')
  },
  
  hubLogo: {
    width: '24px',
    height: '24px',
    backgroundColor: '#03787c', // Brand primary from Figma
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#ffffff',
    fontWeight: 400,
    textTransform: 'uppercase' as const,
    letterSpacing: '1.2px',
    fontFamily: '"Segoe UI", sans-serif',
  },
  
  hubTitle: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#323130', // NeutralForeground1.Rest
    lineHeight: '20px',
    fontFamily: '"Segoe UI", sans-serif',
  },
  
  hubNavItems: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('24px'),
    ...shorthands.padding('6px', '0')
  },
  
  hubNavItem: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#323130', // NeutralForeground1.Rest
    lineHeight: '18px',
    cursor: 'pointer',
    fontFamily: '"Segoe UI", sans-serif',
    
    '&:hover': {
      color: '#03787c' // Brand color on hover
    }
  },
  
  // Main Site Header Section
  siteHeaderMain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '108px',
    ...shorthands.padding('0', '32px', '0', '80px'), // Add left padding for AppBar
    backgroundColor: '#ffffff',
    '@media (max-width: 1024px)': {
      padding: '0 32px', // Reset on tablet
      height: '80px',
    },
    '@media (max-width: 768px)': {
      height: '80px',
      padding: '0 12px', // Reset on mobile
    },
    '@media (max-width: 375px)': {
      height: '60px',
      padding: '0 8px',
    },
  },
  
  siteHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('20px'),
    flex: 1
  },
  
  siteLogo: {
    maxWidth: '192px',
    backgroundColor: '#03787c', // Brand primary from Figma
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    overflow: 'hidden'
  },
  
  siteLogoWrapper: {
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: '#ffffff',
    fontWeight: 400,
    textTransform: 'uppercase' as const,
    fontFamily: '"Segoe UI", sans-serif',
  },
  
  siteInfo: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    flex: 1,
    height: '60px',
    justifyContent: 'center'
  },
  
  siteTitleRow: {
    display: 'flex',
    alignItems: 'baseline',
    ...shorthands.gap('24px')
  },
  
  siteTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#323130', // NeutralForeground1.Rest
    lineHeight: '28px',
    fontFamily: '"Segoe UI", sans-serif',
  },
  
  siteLabels: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px')
  },
  
  siteLabel: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#323130', // NeutralForeground1.Rest
    lineHeight: '18px',
    fontFamily: '"Segoe UI", sans-serif',
  },
  
  labelSeparator: {
    height: '18px',
    width: '4px',
    fontSize: '14px',
    fontWeight: 400,
    color: '#323130', // NeutralForeground1.Rest
    lineHeight: '18px',
    fontFamily: '"Segoe UI", sans-serif',
  },
  
  siteNavigation: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('20px')
  },
  
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    height: '24px',
    cursor: 'pointer'
  },
  
  navItemText: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#323130', // NeutralForeground1.Rest
    lineHeight: '18px',
    fontFamily: '"Segoe UI", sans-serif',
    
    '&:hover': {
      color: '#03787c' // Brand color on hover
    }
  },
  
  navItemActive: {
    color: '#03787c' // Brand color for active state
  },
  
  activeIndicator: {
    height: '2px',
    width: '100%',
    backgroundColor: '#03787c' // Brand primary
  },
  
  editLink: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#03787c', // Brand color
    lineHeight: '14px',
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: '"Segoe UI", sans-serif',
    
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  
  // Action Buttons Section
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px')
  },
  
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    height: '24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 400,
    color: '#323130', // NeutralForeground1.Rest
    lineHeight: '18px',
    fontFamily: '"Segoe UI", sans-serif',
    
    '&:hover': {
      color: '#03787c' // Brand color on hover
    }
  },
  
  actionIcon: {
    width: '16px',
    height: '16px'
  }
});

interface SiteHeaderProps {
  /** Show hub navigation bar */
  showHubNav?: boolean;
  /** Site title */
  siteTitle?: string;
  /** Site labels */
  siteLabels?: string[];
  /** Navigation items */
  navItems?: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
  /** Show edit mode */
  showEdit?: boolean;
  /** Show action buttons */
  showActions?: boolean;
  /** Hub title */
  hubTitle?: string;
  /** Hub navigation items */
  hubNavItems?: string[];
}

export default function SiteHeader({
  showHubNav = false,
  siteTitle = 'SharePoint',
  siteLabels,
  navItems = [
    { label: 'Home', active: true },
    { label: 'News' },
    { label: 'Documents' },
    { label: 'Pages' }
  ],
  showEdit = false,
  showActions = true,
  hubTitle,
  hubNavItems = ['Home', 'Sites', 'News', 'Events']
}: SiteHeaderProps) {
  const styles = useStyles();

  return (
    <div className={styles.siteHeader}>
      {/* Hub Navigation */}
      {showHubNav && (
        <div className={styles.hubNav}>
          <div className={styles.hubNavLeft}>
            {/* Hub Logo */}
            <div className={styles.hubLogo}>
              HUB
            </div>
            
            {/* Hub Title */}
            {hubTitle && (
              <Text className={styles.hubTitle}>
                {hubTitle}
              </Text>
            )}
          </div>

          {/* Hub Navigation Items */}
          <div className={styles.hubNavItems}>
            {hubNavItems.map((item, index) => (
              <Text key={index} className={styles.hubNavItem}>
                {item}
              </Text>
            ))}
          </div>
        </div>
      )}

      {/* Main Site Header */}
      <div className={styles.siteHeaderMain}>
        <div className={styles.siteHeaderContent}>
          {/* Site Logo */}
          <div className={styles.siteLogo}>
            <div className={styles.siteLogoWrapper}>
              SP
            </div>
          </div>

          {/* Site Information */}
          <div className={styles.siteInfo}>
            {/* Site Title and Labels */}
            <div className={styles.siteTitleRow}>
              <Text className={styles.siteTitle}>
                {siteTitle}
              </Text>
              
              {siteLabels && siteLabels.length > 0 && (
                <div className={styles.siteLabels}>
                  {siteLabels.map((label, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <div className={styles.labelSeparator}>|</div>
                      )}
                      <Text className={styles.siteLabel}>
                        {label}
                      </Text>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Site Navigation */}
            <div className={styles.siteNavigation}>
              {navItems.map((item, index) => (
                <div key={index} className={styles.navItem}>
                  <Text 
                    className={mergeClasses(
                      styles.navItemText,
                      item.active && styles.navItemActive
                    )}
                  >
                    {item.label}
                  </Text>
                  {item.active && (
                    <div className={styles.activeIndicator} />
                  )}
                </div>
              ))}
              
              {showEdit && (
                <Text className={styles.editLink}>
                  Edit
                </Text>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className={styles.actionGroup}>
            <div className={styles.actionButton}>
              <Heart16Regular className={styles.actionIcon} />
              <Text>Not following</Text>
            </div>
            
            <div className={styles.actionButton}>
              <Share16Regular className={styles.actionIcon} />
              <Text>Share</Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
