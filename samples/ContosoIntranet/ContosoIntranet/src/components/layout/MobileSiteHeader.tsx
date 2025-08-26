import { 
  Text,
  Button,
  makeStyles,
  shorthands,
  tokens
} from '@fluentui/react-components';
import { Navigation24Regular } from '@fluentui/react-icons';
import { useResponsive } from '../../contexts/ResponsiveContext';

interface MobileSiteHeaderProps {
  siteTitle: string;
  siteLabels?: string[];
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const useStyles = makeStyles({
  mobileHeader: {
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    ...shorthands.padding('6px', '32px', '6px', '14px'),
    ...shorthands.gap('22px'),
    width: '100%',
    maxWidth: '639px',
  },
  
  hamburgerButton: {
    minWidth: '24px',
    width: '24px',
    height: '24px',
    ...shorthands.padding('0'),
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground2,
    
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorNeutralForeground1
    }
  },
  
  logoAndTitle: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flex: '1',
    minWidth: '0'
  },
  
  mobileLogo: {
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--brand-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: tokens.colorNeutralForegroundInverted,
    fontWeight: tokens.fontWeightRegular,
    textTransform: 'uppercase' as const,
    flexShrink: 0,
    maxWidth: '80px'
  },
  
  titleAndLabels: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('20px'),
    flex: '1',
    minWidth: '0'
  },
  
  siteTitle: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    minWidth: '0'
  },
  
  siteTitleText: {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  
  labelGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    flexShrink: 0
  },
  
  overflowIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '18px',
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    fontFamily: 'Fabric MDL2 Assets, sans-serif'
  }
});

export default function MobileSiteHeader({ 
  siteTitle, 
  siteLabels = [], 
  onMenuToggle,
  isMenuOpen = false 
}: MobileSiteHeaderProps) {
  const styles = useStyles();
  const { isMobile } = useResponsive();

  if (!isMobile) {
    return null;
  }

  return (
    <header className={styles.mobileHeader}>
      <Button
        appearance="subtle"
        className={styles.hamburgerButton}
        onClick={onMenuToggle}
        aria-label="Navigation menu"
        aria-expanded={isMenuOpen}
      >
        <Navigation24Regular />
      </Button>
      
      <div className={styles.logoAndTitle}>
        <div className={styles.mobileLogo}>
          CS
        </div>
        
        <div className={styles.titleAndLabels}>
          <div className={styles.siteTitle}>
            <Text className={styles.siteTitleText}>
              {siteTitle}
            </Text>
          </div>
          
          {siteLabels.length > 0 && (
            <div className={styles.labelGroup}>
              <div className={styles.overflowIcon}>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
