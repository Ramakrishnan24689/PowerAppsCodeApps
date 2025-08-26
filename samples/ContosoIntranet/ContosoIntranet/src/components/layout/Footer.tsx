// Footer.tsx - Simple Footer component with logo and navigation links
import { 
  Text,
  makeStyles,
  shorthands,
  tokens
} from '@fluentui/react-components';

const useStyles = makeStyles({
  footer: {
    backgroundColor: 'var(--footer-background)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    ...shorthands.padding('0', '24px', '0', '72px'), // Add left padding to account for AppBar
    minHeight: '48px',
    width: '100%',
    position: 'relative',
    '@media (max-width: 1024px)': {
      paddingLeft: '24px', // Reset on tablet
    },
    '@media (max-width: 768px)': {
      paddingLeft: '24px', // Reset on mobile
    },
  },
  
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    ...shorthands.padding('8px', '0', '0', '0'),
    flexShrink: 0
  },
  
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px')
  },
  
  logoContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    maxHeight: '32px',
    overflow: 'hidden',
    ...shorthands.padding('0'),
    flexShrink: 0
  },
  
  logoBox: {
    height: '32px',
    width: '110px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  logoText: {
    fontSize: '12px',
    fontWeight: tokens.fontWeightSemibold,
    color: 'var(--footer-logo-text)',
    lineHeight: '16px',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    textAlign: 'center'
  },
  
  siteDisplayName: {
    fontSize: '14px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundInverted,
    lineHeight: '20px',
    flexShrink: 0
  },
  
  linksSection: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexShrink: 0
  },
  
  linkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    ...shorthands.padding('12px', '24px', '12px', '0'),
    cursor: 'pointer',
    textDecoration: 'none',
    
    '&:hover .footerLinkText': {
      textDecoration: 'underline'
    }
  },
  
  linkText: {
    fontSize: '14px',
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForegroundInverted,
    lineHeight: '24px',
    width: '66px',
    textAlign: 'center'
  }
});

interface FooterProps {
  /** Logo text to display in the white logo area */
  logoText?: string;
  /** Site display name shown next to logo */
  displayName?: string;
  /** Array of footer link objects */
  links?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
}

export default function Footer({
  logoText = 'FOOTER LOGO',
  displayName = 'Footer display name',
  links = [
    { label: 'Footer link' },
    { label: 'Footer link' },
    { label: 'Footer link' },
    { label: 'Footer link' },
    { label: 'Footer link' },
    { label: 'Footer link' },
    { label: 'Footer link' },
    { label: 'Footer link' }
  ]
}: FooterProps) {
  const styles = useStyles();

  const handleLinkClick = (link: typeof links[0]) => {
    if (link.onClick) {
      link.onClick();
    } else if (link.href) {
      window.location.href = link.href;
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Logo and Site Name Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoWrapper}>
          {/* Logo Container */}
          <div className={styles.logoContainer}>
            <div className={styles.logoBox}>
              <Text className={styles.logoText}>
                {logoText}
              </Text>
            </div>
          </div>
          
          {/* Site Display Name */}
          <Text className={styles.siteDisplayName}>
            {displayName}
          </Text>
        </div>
      </div>

      {/* Footer Links Section */}
      <nav className={styles.linksSection} role="navigation" aria-label="Footer navigation">
        {links.map((link, index) => (
          <div
            key={index}
            className={styles.linkItem}
            onClick={() => handleLinkClick(link)}
            role={link.href || link.onClick ? 'link' : 'button'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLinkClick(link);
              }
            }}
          >
            <Text className={`${styles.linkText} footerLinkText`}>
              {link.label}
            </Text>
          </div>
        ))}
      </nav>
    </footer>
  );
}
