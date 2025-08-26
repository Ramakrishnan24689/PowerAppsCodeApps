// c:\PowerAppsCodeApps\ContosoIntranet\src\components\webparts\BottomHeroTilesWebPart.tsx

import { useQuery } from '@tanstack/react-query';
import { makeStyles } from '@fluentui/react-components';
import { ContosoHeroService } from '../../Services/ContosoHeroService';
import type { ContosoHero } from '../../Models/ContosoHeroModel';
import { getImageUrl } from '../../utils/imageUtils';

const useStyles = makeStyles({
  tilesContainer: {
    display: 'flex',
    gap: '2px',
    height: '450px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    maxHeight: '450px',
    minWidth: '1024px',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    zIndex: 1,
    '@media (max-width: 1024px)': {
      minWidth: '100%',
      flexDirection: 'column',
      height: 'auto',
      gap: '16px',
    },
  },
  heroTile: {
    flex: '1 1 0%',
    height: '450px',
    minHeight: '1px',
    minWidth: '1px',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'scale(1.02)',
    },
    '@media (max-width: 1024px)': {
      height: '300px',
      ':hover': {
        transform: 'none',
      },
    },
  },
  overlay: {
    position: 'absolute',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.49) 100%)',
    bottom: '0',
    height: '350px',
    left: '0',
    opacity: 0.7,
    right: '0',
    '@media (max-width: 1024px)': {
      height: '200px',
    },
  },
  content: {
    position: 'absolute',
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    left: '0',
    paddingBottom: '32px',
    paddingLeft: '32px',
    paddingRight: '128px',
    paddingTop: '0',
    right: '0',
    zIndex: 2,
    '@media (max-width: 1024px)': {
      paddingRight: '32px',
      paddingBottom: '24px',
      paddingLeft: '24px',
      gap: '12px',
    },
  },
  title: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    lineHeight: '36px',
    color: '#ffffff',
    margin: 0,
    '@media (max-width: 1024px)': {
      fontSize: '24px',
      lineHeight: '32px',
    },
    '@media (max-width: 768px)': {
      fontSize: '20px',
      lineHeight: '28px',
    },
  },
  callToAction: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    color: '#ffffff',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    ':hover': {
      opacity: 0.8,
    },
  },
  ctaText: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '23px',
    '@media (max-width: 768px)': {
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
  arrow: {
    width: '16px',
    height: '17px',
  },
  fallback: {
    backgroundColor: '#f3f2f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#605e5c',
    fontFamily: '"Segoe UI", sans-serif',
    fontSize: '16px',
    minHeight: '200px',
  },
});

interface BottomHeroTilesWebPartProps {
  tileType?: string;
  maxTiles?: number;
}

export default function BottomHeroTilesWebPart({ 
  tileType = 'bottom', 
  maxTiles = 2 
}: BottomHeroTilesWebPartProps) {
  const styles = useStyles();

  const { data: heroes, isLoading, error } = useQuery({
    queryKey: ['bottom-hero-tiles', tileType, maxTiles],
    queryFn: async () => {
      const result = await ContosoHeroService.getAll({
        filter: tileType ? `TileType eq '${tileType}'` : undefined,
        orderBy: ['Created desc'],
        top: maxTiles
      });
      
      if (!result.isSuccess) {
        throw new Error('Failed to fetch hero tiles');
      }
      return result.result || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className={styles.tilesContainer}>
        <div className={styles.fallback}>
          Loading hero tiles...
        </div>
      </div>
    );
  }

  if (error || !heroes || heroes.length === 0) {
    // Fallback to default tiles with hardcoded content
    const defaultTiles = [
      {
        id: 1,
        title: 'Open door policy.',
        callToAction: 'Learn more',
        imageUrl: 'Open Door Policy.jpg'
      },
      {
        id: 2,
        title: 'Three steps to improve product performance.',
        callToAction: 'Read more',
        imageUrl: 'App Designed for Collaboration.png'
      }
    ];

    return (
      <div className={styles.tilesContainer}>
        {defaultTiles.map((tile) => (
          <div
            key={tile.id}
            className={styles.heroTile}
            style={{
              backgroundImage: `url('${getImageUrl(tile.imageUrl, 'Student mentorship opportunity.jpg')}')`
            }}
          >
            <div className={styles.overlay} />
            <div className={styles.content}>
              <h2 className={styles.title}>
                {tile.title}
              </h2>
              <div className={styles.callToAction}>
                <span className={styles.ctaText}>{tile.callToAction}</span>
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
            </div>
          </div>
        ))}
      </div>
    );
  }

  const handleTileClick = (hero: ContosoHero) => {
    if (hero.LinkUrl) {
      window.open(hero.LinkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.tilesContainer}>
      {heroes.map((hero: ContosoHero) => (
        <div
          key={hero.ID}
          className={styles.heroTile}
          style={{
            backgroundImage: `url('${getImageUrl(hero.ImageUrl || '', 'Building a responsible ecosystem.jpg')}')`
          }}
          onClick={() => handleTileClick(hero)}
        >
          <div className={styles.overlay} />
          <div className={styles.content}>
            <h2 className={styles.title}>
              {hero.Title}
            </h2>
            {hero.CallToAction && (
              <div className={styles.callToAction}>
                <span className={styles.ctaText}>{hero.CallToAction}</span>
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
      ))}
    </div>
  );
}
