// HeroTilesWebPart.tsx - Exact Figma specification implementation
import { makeStyles } from '@fluentui/react-components';
import { getImageUrl } from '../../utils/imageUtils';

// Hero tile data from Figma specifications  
const HERO_TILES = [
  {
    id: 1,
    title: 'Miriam Graham, our new Chief Marketing Officer.',
    callToAction: 'Call to action text. 40 characters max.',
    imageUrl: getImageUrl(undefined, '/assets/images/New Chief Marketing Office.jpg'),
    type: 'main'
  },
  {
    id: 2,
    title: 'Open door policy.',
    imageUrl: getImageUrl(undefined, '/assets/images/Open Door Policy.jpg'),
    type: 'small'
  },
  {
    id: 3,
    title: 'Communicating product value',
    imageUrl: getImageUrl(undefined, '/assets/images/Communicating Product Value.jpg'),
    type: 'small'
  },
  {
    id: 4,
    title: 'Singapore building update.',
    imageUrl: getImageUrl(undefined, '/assets/images/Singapore Building Update.jpg'),
    type: 'small'
  },
  {
    id: 5,
    title: 'Student mentorship opportunities.',
    imageUrl: getImageUrl(undefined, '/assets/images/Student mentorship opportunity.jpg'),
    type: 'small'
  }
];

const useStyles = makeStyles({
  heroContainer: {
    display: 'flex',
    gap: '2px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    maxHeight: '450px',
    minWidth: '1024px',
    overflow: 'hidden',
    padding: '0',
    width: '100%',
    zIndex: 1
  },
  
  mainTile: {
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
    cursor: 'pointer'
  },
  
  tilesColumn: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '1px',
    minWidth: '1px',
    padding: '0',
    position: 'relative',
    flexShrink: 0
  },
  
  tileRow: {
    display: 'flex',
    gap: '2px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  smallTile: {
    flex: '1 1 0%',
    height: '224px',
    minHeight: '1px',
    minWidth: '1px',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: 'pointer'
  },
  
  // Gradient overlays
  mainGradient: {
    position: 'absolute',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.49) 100%)',
    bottom: '0',
    height: '350px',
    left: '0',
    opacity: 0.7,
    right: '0'
  },
  
  smallGradient: {
    position: 'absolute',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.49) 100%)',
    bottom: '0',
    height: '225px',
    left: '0',
    opacity: 0.7,
    right: '0.5px'
  },
  
  // Content areas
  mainContent: {
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
    right: '0'
  },
  
  smallContent: {
    position: 'absolute',
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    left: '0',
    paddingBottom: '16px',
    paddingLeft: '16px',
    paddingRight: '32px',
    paddingTop: '0',
    right: '0.5px'
  },
  
  // Typography
  mainTitle: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  mainTitleText: {
    flex: '1 1 0%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minHeight: '1px',
    minWidth: '1px',
    position: 'relative',
    flexShrink: 0,
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    fontStyle: 'normal',
    lineHeight: '36px',
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as any
  },
  
  smallTitle: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  smallTitleText: {
    flex: '1 1 0%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minHeight: '1px',
    minWidth: '1px',
    position: 'relative',
    flexShrink: 0,
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '20px',
    fontStyle: 'normal',
    lineHeight: '24px',
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as any
  },
  
  // Call to action
  callToAction: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0
  },
  
  ctaText: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '16px',
    fontStyle: 'normal',
    lineHeight: '23px',
    color: '#ffffff',
    position: 'relative',
    flexShrink: 0,
    whiteSpace: 'pre'
  },
  
  ctaArrow: {
    height: '17px',
    position: 'relative',
    flexShrink: 0,
    width: '16px'
  }
});

export default function HeroTilesWebPart() {
  const styles = useStyles();
  
  const mainTile = HERO_TILES[0];
  const smallTiles = HERO_TILES.slice(1);

  return (
    <div className={styles.heroContainer} data-name="Hero: Tiles">
      {/* Main Tile */}
      <div 
        className={styles.mainTile}
        style={{ backgroundImage: `url('${mainTile.imageUrl}')` }}
        data-name="Tile 1"
        onClick={() => console.log('Main tile clicked')}
      >
        <div className={styles.mainGradient} data-name="Shade" />
        <div className={styles.mainContent} data-name="Title + CTA">
          <div className={styles.mainTitle} data-name="Title">
            <div className={styles.mainTitleText}>
              {mainTile.title}
            </div>
          </div>
          <div className={styles.callToAction} data-name="Call to action">
            <div className={styles.ctaText}>
              {mainTile.callToAction}
            </div>
            <div className={styles.ctaArrow}>
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                <path d="M8.5 4.5L13 9L8.5 13.5M13 9H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Small Tiles Column */}
      <div className={styles.tilesColumn} data-name="Tiles 2-5">
        <div className={styles.tileRow} data-name="Tiles 2 & 3">
          {smallTiles.slice(0, 2).map((tile, index) => (
            <div 
              key={tile.id}
              className={styles.smallTile}
              style={{ backgroundImage: `url('${tile.imageUrl}')` }}
              data-name={`Tile ${index + 2}`}
              onClick={() => console.log(`Small tile ${tile.id} clicked`)}
            >
              <div className={styles.smallGradient} data-name="Shade" />
              <div className={styles.smallContent} data-name="Title + CTA">
                <div className={styles.smallTitle} data-name="Title">
                  <div className={styles.smallTitleText}>
                    {tile.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.tileRow} data-name="Tiles 4 & 5">
          {smallTiles.slice(2, 4).map((tile, index) => (
            <div 
              key={tile.id}
              className={styles.smallTile}
              style={{ backgroundImage: `url('${tile.imageUrl}')` }}
              data-name={`Tile ${index + 4}`}
              onClick={() => console.log(`Small tile ${tile.id} clicked`)}
            >
              <div className={styles.smallGradient} data-name="Shade" />
              <div className={styles.smallContent} data-name="Title + CTA">
                <div className={styles.smallTitle} data-name="Title">
                  <div className={styles.smallTitleText}>
                    {tile.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
