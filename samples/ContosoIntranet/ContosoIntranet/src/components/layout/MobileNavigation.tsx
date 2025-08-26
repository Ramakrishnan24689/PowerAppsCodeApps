import { 
  makeStyles, 
  shorthands,
  Button,
} from '@fluentui/react-components';
import { 
  Home24Regular,
  ShareAndroid24Regular,
  News24Regular,
  Document24Regular,
  ClipboardTaskListLtr24Regular,
  Add24Regular
} from '@fluentui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResponsive } from '../../contexts/ResponsiveContext';

const useStyles = makeStyles({
  // Mobile AppBar (375px breakpoint - from Figma)
  mobileAppBar: {
    display: 'flex',
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    height: '47px',
    backgroundColor: 'var(--figma-NeutralBackground4-Rest)',
    borderTop: '1px solid var(--figma-NeutralStroke4-Rest)',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('0', '16px'),
  },
  
  navButton: {
    minWidth: '47px',
    width: '47px',
    height: '47px',
    ...shorthands.padding('0'),
    backgroundColor: 'transparent',
    color: 'var(--figma-NeutralForeground2-Rest)',
    
    '&:hover': {
      backgroundColor: 'var(--colorNeutralBackground1Hover)',
      color: 'var(--colorNeutralForeground1)'
    },
    
    '&:active': {
      backgroundColor: 'var(--colorNeutralBackground1Pressed)',
      color: 'var(--colorNeutralForeground1)'
    }
  },
  
  activeNavButton: {
    backgroundColor: 'var(--colorBrandBackground2)',
    color: 'var(--colorBrandForeground2)',
    
    '&:hover': {
      backgroundColor: 'var(--colorBrandBackground2Hover)',
      color: 'var(--colorBrandForeground2)'
    }
  },
  
  divider: {
    height: '39px',
    width: '1px',
    backgroundColor: 'var(--figma-NeutralStroke4-Rest)'
  }
});

const navigationItems = [
  { icon: Home24Regular, label: 'Home', path: '/' },
  { icon: ShareAndroid24Regular, label: 'Globe', path: '/sites' },
  { icon: News24Regular, label: 'News', path: '/news' },
  { icon: Document24Regular, label: 'Documents', path: '/files' },
  { icon: ClipboardTaskListLtr24Regular, label: 'Lists', path: '/tasks' }
];

export default function MobileNavigation() {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  if (!isMobile) {
    return null;
  }

  return (
    <nav className={styles.mobileAppBar} role="navigation" aria-label="Mobile navigation">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActivePath(item.path);
        
        return (
          <Button
            key={item.path}
            appearance="subtle"
            className={`${styles.navButton} ${isActive ? styles.activeNavButton : ''}`}
            onClick={() => handleNavigation(item.path)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon />
          </Button>
        );
      })}
      
      <div className={styles.divider} role="separator" />
      
      <Button
        appearance="primary"
        className={styles.navButton}
        onClick={() => {
          // TODO: Implement create menu/dialog
          console.log('Create button clicked');
        }}
        aria-label="Create new item"
      >
        <Add24Regular />
      </Button>
    </nav>
  );
}
