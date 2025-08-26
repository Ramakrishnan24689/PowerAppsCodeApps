// c:\PowerAppsCodeApps\ContosoIntranet\src\components\webparts\HeroLayerWebPart.tsx

import { useQuery } from '@tanstack/react-query';
import { makeStyles, Text } from '@fluentui/react-components';
import { ContosoHeroService } from '../../Services/ContosoHeroService';
import type { ContosoHero } from '../../Models/ContosoHeroModel';
import { getImageUrl } from '../../utils/imageUtils';

const useStyles = makeStyles({
  heroLayerContainer: {
    height: '400px',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    overflow: 'hidden',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (max-width: 768px)': {
      height: '300px',
    },
  },
  heroLayer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'flex-end',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.49) 100%)',
    opacity: 0.7,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: '32px',
    width: '100%',
    '@media (max-width: 768px)': {
      padding: '24px',
      gap: '12px',
    },
  },
  heroTitle: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    lineHeight: '36px',
    color: '#ffffff',
    margin: 0,
    maxWidth: '70%',
    '@media (max-width: 768px)': {
      fontSize: '24px',
      lineHeight: '32px',
      maxWidth: '90%',
    },
  },
  heroSubtitle: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '22px',
    color: '#ffffff',
    margin: 0,
    opacity: 0.9,
    maxWidth: '70%',
    '@media (max-width: 768px)': {
      fontSize: '14px',
      lineHeight: '20px',
      maxWidth: '90%',
    },
  },
  callToAction: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    color: '#ffffff',
    textDecoration: 'none',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '23px',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 0.8,
    },
  },
  arrow: {
    width: '16px',
    height: '16px',
  },
  fallback: {
    backgroundColor: '#f3f2f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#605e5c',
    fontFamily: '"Segoe UI", sans-serif',
    fontSize: '16px',
  },
});

interface HeroLayerWebPartProps {
  tileType?: string;
}

export default function HeroLayerWebPart({ tileType = 'primary' }: HeroLayerWebPartProps) {
  const styles = useStyles();

  const { data: heroes, isLoading, error } = useQuery({
    queryKey: ['hero-layers', tileType],
    queryFn: async () => {
      const result = await ContosoHeroService.getAll({
        filter: tileType ? `TileType eq '${tileType}'` : undefined,
        orderBy: ['Created desc']
      });
      
      if (!result.isSuccess) {
        throw new Error('Failed to fetch hero data');
      }
      return result.result || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className={styles.heroLayerContainer}>
        <div className={styles.fallback}>
          Loading hero content...
        </div>
      </div>
    );
  }

  if (error || !heroes || heroes.length === 0) {
    return (
      <div className={styles.heroLayerContainer}>
        <div className={styles.fallback}>
          Hero content unavailable
        </div>
      </div>
    );
  }

  // Use the first active hero or just the first one
  const hero = heroes.find((h: ContosoHero) => h.IsActive) || heroes[0];
  const imageUrl = getImageUrl(hero.ImageUrl || '', 'App Designed for Collaboration.png');

  const handleCallToActionClick = () => {
    if (hero.LinkUrl) {
      window.open(hero.LinkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.heroLayerContainer}>
      <div 
        className={styles.heroLayer}
        style={{ backgroundImage: `url('${imageUrl}')` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {hero.Title}
          </h1>
          {hero.Subtitle && (
            <Text className={styles.heroSubtitle}>
              {hero.Subtitle}
            </Text>
          )}
          {hero.CallToAction && (
            <div className={styles.callToAction} onClick={handleCallToActionClick}>
              <span>{hero.CallToAction}</span>
              <svg className={styles.arrow} viewBox="0 0 16 17" fill="none">
                <path 
                  d="M8.5 4.5L13 9L8.5 13.5M13 9H3" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
