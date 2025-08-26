import {
  Button,
  Input,
  makeStyles,
  Avatar,
} from '@fluentui/react-components';
import {
  GridDots20Regular,
  Search20Regular,
  Megaphone20Regular,
  Settings20Regular,
  QuestionCircle20Regular,
} from '@fluentui/react-icons';
import '../../design/tokens.css';
import { getImageUrl } from '../../utils/imageUtils';

const useStyles = makeStyles({
  suiteHeader: {
    height: '48px', // Exact height from Figma Communication Site
    backgroundColor: '#003a4b', // Dark suite header background from Figma
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    padding: '0',
    boxSizing: 'border-box',
    zIndex: 1001, // Above AppBar to ensure it's never cropped
    '@media (max-width: 768px)': {
      height: '44px', // Slightly smaller on mobile
      display: 'flex', // Ensure it still shows on mobile
    },
  },
  leftControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  waffleButton: {
    width: '48px',
    height: '48px',
    minWidth: '48px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff', // White icons on dark background
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  tenantBranding: {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    boxSizing: 'border-box',
  },
  tenantLogo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle background for tenant area
    height: '32px',
    width: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '8px',
    overflow: 'hidden',
    borderRadius: '2px',
  },
  tenantText: {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    lineHeight: '16px',
  },
  appLabel: {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 12px',
    gap: '12px',
  },
  appLabelText: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
  },
  searchContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(calc(-50% + 38.5px), -50%)',
    width: '468px',
    height: '32px',
    '@media (max-width: 1024px)': {
      width: '320px',
    },
    '@media (max-width: 768px)': {
      display: 'none', // Hide search on mobile, could be shown in hamburger menu
    },
  },
  searchField: {
    width: '100%',
    height: '100%',
    '& .fui-Input__input': {
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      paddingLeft: '32px',
      fontSize: '14px',
      color: '#323130',
      border: '1px solid #e1dfdd',
    },
  },
  searchIcon: {
    position: 'absolute',
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#605e5c',
    zIndex: 1,
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  actionButton: {
    width: '48px',
    height: '48px', 
    minWidth: '48px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff', // White icons on dark background
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  avatar: {
    width: '28px',
    height: '28px',
  },
});

export default function SuiteHeader() {
  const styles = useStyles();

  return (
    <div className={styles.suiteHeader} role="banner" aria-label="Microsoft 365 Suite Header">
      {/* Left Controls */}
      <div className={styles.leftControls}>
        {/* Waffle Button */}
        <Button
          className={styles.waffleButton}
          icon={<GridDots20Regular />}
          aria-label="App launcher"
          appearance="transparent"
          tabIndex={-1} // Remove from tab order on mobile to prevent focus trap
          onKeyDown={(e) => {
            // Allow tab navigation to skip app launcher on mobile
            if (e.key === 'Tab' && window.innerWidth <= 768) {
              e.preventDefault();
              const nextElement = e.shiftKey 
                ? document.querySelector('input[aria-label="Search this site"]') 
                : document.querySelector('nav[role="navigation"] button');
              (nextElement as HTMLElement)?.focus();
            }
          }}
        />
        
        {/* Tenant Branding */}
        <div className={styles.tenantBranding}>
          <div className={styles.tenantLogo}>
            <span className={styles.tenantText}>Tenant logo</span>
          </div>
        </div>
        
        {/* App Label */}
        <div className={styles.appLabel}>
          <span className={styles.appLabelText}>SharePoint</span>
        </div>
      </div>

      {/* Search Container */}
      <div className={styles.searchContainer}>
        <div className={styles.searchIcon}>
          <Search20Regular />
        </div>
        <Input
          className={styles.searchField}
          placeholder="Search this site"
          aria-label="Search this site"
        />
      </div>

      {/* Right Controls */}
      <div className={styles.rightControls}>
        <Button
          className={styles.actionButton}
          icon={<Megaphone20Regular />}
          aria-label="Announcements"
          appearance="transparent"
        />
        <Button
          className={styles.actionButton}
          icon={<Settings20Regular />}
          aria-label="Settings"
          appearance="transparent"
        />
        <Button
          className={styles.actionButton}
          icon={<QuestionCircle20Regular />}
          aria-label="Help"
          appearance="transparent"
        />
        <Button
          className={styles.actionButton}
          aria-label="Account manager for Johanna Lorenz"
          appearance="transparent"
        >
          <Avatar
            className={styles.avatar}
            name="Johanna Lorenz"
            image={{ src: getImageUrl(undefined, '/assets/images/President;s Keynote.jpg') }}
            size={28}
          />
        </Button>
      </div>
    </div>
  );
}
