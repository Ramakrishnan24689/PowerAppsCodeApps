// c:\PowerAppsCodeApps\ContosoIntranet\src\components\layout\AppBar.tsx

import { 
  makeStyles, 
  shorthands,
  Button,
  Tooltip
} from '@fluentui/react-components';
import { 
  Home20Regular,
  Globe20Regular,
  News20Regular,
  Document20Regular,
  ClipboardTask20Regular,
  AddCircle20Regular
} from '@fluentui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';

interface AppBarProps {
  orientation?: 'vertical' | 'horizontal';
}

const useStyles = makeStyles({
  // Vertical AppBar (Desktop) - Match Figma Communication Site specs
  appBarVertical: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '48px',
    height: '100vh',
    backgroundColor: '#ffffff', // White background as per Figma
    borderRight: '1px solid #e1dfdd', // NeutralStroke2.Rest
    ...shorthands.padding('8px', '0'),
    gap: '8px',
    position: 'fixed',
    left: '0',
    top: '48px', // Position below SuiteHeader
    zIndex: 1000, // High z-index to stay above content but below modals
    overflowY: 'auto',
  },
  
  // Horizontal AppBar (Mobile) - Match Figma Communication Site specs  
  appBarHorizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '48px',
    backgroundColor: '#ffffff', // White background as per Figma
    borderTop: '1px solid #e1dfdd', // NeutralStroke2.Rest
    ...shorthands.padding('0', '16px'),
    gap: '8px',
  },
  
  navButton: {
    minWidth: '32px',
    width: '32px',
    height: '32px',
    ...shorthands.padding('0'),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: '#605e5c', // NeutralForeground2.Rest as per Figma
    borderRadius: '4px',
    
    '&:hover': {
      backgroundColor: '#f3f2f1', // NeutralBackground1Hover
      color: '#323130' // NeutralForeground1.Rest
    },
    
    '&:active': {
      backgroundColor: '#edebe9', // NeutralBackground1Pressed  
      color: '#323130'
    }
  },
  
  activeNavButton: {
    backgroundColor: '#deecf9', // BrandBackground2.Rest
    color: '#003a4b', // BrandForeground2.Rest
    
    '&:hover': {
      backgroundColor: '#c7e0f4', // BrandBackground2Hover
      color: '#003a4b'
    }
  },
  
  divider: {
    width: '24px',
    height: '1px',
    backgroundColor: '#e1dfdd', // NeutralStroke2.Rest
    ...shorthands.margin('4px', '0')
  },
  
  createButton: {
    minWidth: '32px',
    width: '32px',
    height: '32px',
    ...shorthands.padding('0'),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: '#605e5c', // NeutralForeground2.Rest as per Figma - same as navButton
    borderRadius: '4px',
    
    '&:hover': {
      backgroundColor: '#f3f2f1', // NeutralBackground1Hover - same as navButton
      color: '#323130' // NeutralForeground1.Rest - same as navButton
    },
    
    '&:active': {
      backgroundColor: '#edebe9', // NeutralBackground1Pressed - same as navButton
      color: '#323130'
    }
  }
});

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navigationItems: NavItem[] = [
  { icon: Home20Regular, label: 'Home', path: '/' },
  { icon: Globe20Regular, label: 'Sites', path: '/sites' },
  { icon: News20Regular, label: 'News', path: '/news' },
  { icon: Document20Regular, label: 'Files', path: '/files' },
  { icon: ClipboardTask20Regular, label: 'Tasks', path: '/tasks' }
];

export default function AppBar({ orientation = 'vertical' }: AppBarProps = {}) {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const appBarClassName = orientation === 'horizontal' ? styles.appBarHorizontal : styles.appBarVertical;

  return (
    <nav className={appBarClassName} role="navigation" aria-label="Main navigation">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActivePath(item.path);
        
        return (
          <Tooltip key={item.path} content={item.label} relationship="label" positioning={orientation === 'horizontal' ? 'above' : 'after'}>
            <Button
              appearance="subtle"
              className={`${styles.navButton} ${isActive ? styles.activeNavButton : ''}`}
              onClick={() => handleNavigation(item.path)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon />
            </Button>
          </Tooltip>
        );
      })}
      
      {orientation === 'vertical' && <div className={styles.divider} role="separator" />}
      
      <Tooltip content="Create" relationship="label" positioning={orientation === 'horizontal' ? 'above' : 'after'}>
        <Button
          appearance="subtle"
          className={styles.createButton}
          onClick={() => {
            // TODO: Implement create menu/dialog
            console.log('Create button clicked');
          }}
          aria-label="Create new item"
        >
          <AddCircle20Regular />
        </Button>
      </Tooltip>
    </nav>
  );
}
