// HeroWebPart.tsx - Hero section with image tiles and gradient overlays
import React from 'react';
import { 
  Text,
  makeStyles,
  shorthands,
  tokens,
  Spinner
} from '@fluentui/react-components';
import { useQuery } from '@tanstack/react-query';
import { ContosoHeroService } from '../../Services/ContosoHeroService';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';
import type { ContosoHero } from '../../Models/ContosoHeroModel';
import { getImageUrl } from '../../utils/imageUtils';

const useStyles = makeStyles({
  heroContainer: {
    display: 'flex',
    ...shorthands.gap('2px'),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: '450px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      height: 'auto',
      gap: '8px',
    },
  },
  
  mainTile: {
    flex: '1',
    height: '450px',
    minWidth: '0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    
    '&:hover .heroGradient': {
      opacity: '0.85'
    },
    '@media (max-width: 768px)': {
      height: '200px',
      width: '100%',
    },
  },
  
  tilesColumn: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('2px'),
    minWidth: '0',
    '@media (max-width: 768px)': {
      width: '100%',
      flexDirection: 'row',
      gap: '8px',
    },
    '@media (max-width: 375px)': {
      flexDirection: 'column',
    },
  },
  
  tileRow: {
    display: 'flex',
    ...shorthands.gap('2px'),
    width: '100%'
  },
  
  smallTile: {
    flex: '1',
    height: '224px',
    minWidth: '0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    
    '&:hover .heroGradient': {
      opacity: '0.85'
    }
  },
  
  heroGradient: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.49) 100%)',
    opacity: '0.7',
    zIndex: 1
  },
  
  mainGradient: {
    height: '350px'
  },
  
  smallGradient: {
    height: '225px'
  },
  
  contentArea: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    zIndex: 2
  },
  
  mainContent: {
    ...shorthands.padding('0', '128px', '32px', '32px')
  },
  
  smallContent: {
    ...shorthands.padding('0', '32px', '16px', '16px')
  },
  
  titleWrapper: {
    display: 'flex',
    ...shorthands.gap('10px'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  },
  
  mainTitle: {
    fontSize: '28px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundInverted,
    lineHeight: '36px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    flex: '1',
    minWidth: '0'
  },
  
  smallTitle: {
    fontSize: '20px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundInverted,
    lineHeight: '24px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    flex: '1',
    minWidth: '0'
  },
  
  ctaButton: {
    display: 'flex',
    ...shorthands.gap('4px'),
    alignItems: 'center',
    justifyContent: 'flex-start',
    cursor: 'pointer',
    background: 'transparent',
    ...shorthands.border('none'),
    ...shorthands.padding('0'),
    
    '&:hover .ctaText': {
      textDecoration: 'underline'
    }
  },
  
  ctaText: {
    fontSize: '16px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundInverted,
    lineHeight: '23px',
    whiteSpace: 'nowrap'
  },
  
  ctaArrow: {
    height: '17px',
    width: '16px',
    flexShrink: 0
  },

  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '450px',
    fontSize: '16px',
    color: tokens.colorPaletteRedForeground1,
    backgroundColor: tokens.colorNeutralBackground2,
    textAlign: 'center',
    padding: '32px',
    borderRadius: '4px',
    border: `1px solid ${tokens.colorPaletteRedBorder2}`,
  },

  loadingMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '450px',
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground2,
    textAlign: 'center',
    padding: '32px',
    borderRadius: '4px',
  },

  emptyMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '450px',
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground2,
    textAlign: 'center',
    padding: '32px',
    borderRadius: '4px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  }
});

interface HeroWebPartProps {
  /** Maximum number of tiles to display */
  maxTiles?: number;
}

// Custom hook for hero content data
function useHeroContent(maxTiles = 5) {
  return useQuery({
    queryKey: ['hero-content', maxTiles],
    queryFn: async () => {
      try {
        const result = await ContosoHeroService.getAll({
          // Remove restrictive filter to get all hero content
          top: maxTiles,
          orderBy: ['TileType asc', 'Created desc']
        });
        
        const fixedResult = fixPowerAppsResult<ContosoHero[]>(result);
        
        if (!fixedResult.isSuccess) {
          console.warn('Error loading hero content from SharePoint:', fixedResult.error);
          return [];
        }
        return fixedResult.result || [];
      } catch (error) {
        console.error('Exception in hero content fetch:', error);
        return [];
      }
    },
    staleTime: 300000, // Cache for 5 minutes
  });
}

export default function HeroWebPart({
  maxTiles = 5
}: HeroWebPartProps) {
  const styles = useStyles();
  const { data: sharePointHeroItems = [], isLoading, error } = useHeroContent(maxTiles);

  // Use only SharePoint data - no mock data fallback
  const heroItems = sharePointHeroItems;

  if (error) {
    console.error('Error loading hero content from SharePoint:', error);
    return (
      <div className={styles.heroContainer}>
        <div className={styles.errorMessage}>
          Failed to load hero content. Please check your SharePoint connection.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.heroContainer}>
        <div className={styles.loadingMessage}>
          Loading hero content...
        </div>
      </div>
    );
  }

  if (heroItems.length === 0) {
    return (
      <div className={styles.heroContainer}>
        <div className={styles.emptyMessage}>
          No hero content available. Please add content to your SharePoint list.
        </div>
      </div>
    );
  }

  const handleTileClick = (tile: ContosoHero) => {
    if (tile.LinkUrl) {
      window.open(tile.LinkUrl, '_blank');
    } else if (tile["{Link}"]) {
      window.open(tile["{Link}"], '_blank');
    } else {
      console.log(`Navigate to: ${tile.Title}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, tile: ContosoHero) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTileClick(tile);
    }
  };

  if (isLoading) {
    return (
      <section className={styles.heroContainer}>
        <Spinner size="large" label="Loading hero content..." />
      </section>
    );
  }

  if (heroItems.length === 0) {
    return (
      <section className={styles.heroContainer}>
        <Text>No hero content available</Text>
      </section>
    );
  }

  // Separate main tile (first item or marked as main) from smaller tiles
  const mainTile = heroItems.find((item: ContosoHero) => item.TileType === 'Main') || heroItems[0];
  const tiles = heroItems.filter((item: ContosoHero) => item.ID !== mainTile.ID).slice(0, 4);

  // Split tiles into rows for 2x2 layout
  const topTiles = tiles.slice(0, 2);
  const bottomTiles = tiles.slice(2, 4);

  return (
    <div className={styles.heroContainer} role="region" aria-label="Featured content">
      {/* Main Tile */}
      <div
        className={styles.mainTile}
        style={{ 
          backgroundImage: `url('${getImageUrl(mainTile.ImageUrl, 'New Chief Marketing Office.jpg')}')`
        }}
        onClick={() => handleTileClick(mainTile)}
        onKeyDown={(e) => handleKeyDown(e, mainTile)}
        role="button"
        tabIndex={0}
        aria-label={mainTile.Title}
      >
        <div className={`${styles.heroGradient} ${styles.mainGradient} heroGradient`} />
        <div className={`${styles.contentArea} ${styles.mainContent}`}>
          <div className={styles.titleWrapper}>
            <Text className={styles.mainTitle}>
              {mainTile.Title}
            </Text>
          </div>
          {mainTile.CallToAction && (
            <button
              className={styles.ctaButton}
              onClick={(e) => {
                e.stopPropagation();
                handleTileClick(mainTile);
              }}
              aria-label={`${mainTile.CallToAction} - ${mainTile.Title}`}
            >
              <Text className={`${styles.ctaText} ctaText`}>
                {mainTile.CallToAction}
              </Text>
              <svg className={styles.ctaArrow} viewBox="0 0 16 17" fill="none">
                <path 
                  d="M1 8.5H15M15 8.5L8 1.5M15 8.5L8 15.5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Small Tiles Column */}
      <div className={styles.tilesColumn}>
        {/* Top Row */}
        <div className={styles.tileRow}>
          {topTiles.map((tile: ContosoHero) => (
            <div
              key={tile.ID}
              className={styles.smallTile}
              style={{ 
                backgroundImage: `url('${getImageUrl(tile.ImageUrl, 'Open Door Policy.jpg')}')`
              }}
              onClick={() => handleTileClick(tile)}
              onKeyDown={(e) => handleKeyDown(e, tile)}
              role="button"
              tabIndex={0}
              aria-label={tile.Title}
            >
              <div className={`${styles.heroGradient} ${styles.smallGradient} heroGradient`} />
              <div className={`${styles.contentArea} ${styles.smallContent}`}>
                <div className={styles.titleWrapper}>
                  <Text className={styles.smallTitle}>
                    {tile.Title}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className={styles.tileRow}>
          {bottomTiles.map((tile: ContosoHero) => (
            <div
              key={tile.ID}
              className={styles.smallTile}
              style={{ 
                backgroundImage: `url('${getImageUrl(tile.ImageUrl, 'Singapore Building Update.jpg')}')`
              }}
              onClick={() => handleTileClick(tile)}
              onKeyDown={(e) => handleKeyDown(e, tile)}
              role="button"
              tabIndex={0}
              aria-label={tile.Title}
            >
              <div className={`${styles.heroGradient} ${styles.smallGradient} heroGradient`} />
              <div className={`${styles.contentArea} ${styles.smallContent}`}>
                <div className={styles.titleWrapper}>
                  <Text className={styles.smallTitle}>
                    {tile.Title}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
