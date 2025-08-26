// NewsCarouselWebPart.tsx - News Carousel with SharePoint data
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeStyles, Spinner } from '@fluentui/react-components';
import { ContosoNewsHubService } from '../../Services/ContosoNewsHubService';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';
import type { ContosoNewsHub } from '../../Models/ContosoNewsHubModel';
import { getImageUrl } from '../../utils/imageUtils';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    zIndex: 1
  },

  carouselContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },

  carouselSlide: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '340px',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    isolation: 'isolate'
  },

  slideOverlay: {
    position: 'absolute',
    bottom: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    left: '0',
    paddingBottom: '24px',
    paddingTop: '0',
    paddingLeft: '24px',
    paddingRight: '24px',
    right: '0',
    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
  },

  slideTitle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minWidth: '100%',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '32px',
    fontStyle: 'normal',
    lineHeight: '38px',
    color: '#ffffff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 'min-content'
  },

  pagination: {
    display: 'flex',
    gap: '24px',
    height: '44px',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0',
    position: 'relative',
    flexShrink: 0
  },

  paginationDot: {
    position: 'relative',
    borderRadius: '10px',
    flexShrink: 0,
    width: '20px',
    height: '20px',
    border: '1px solid #323130',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      border: '1px solid #03787c',
      backgroundColor: '#f3f2f1'
    }
  },

  paginationDotActive: {
    border: '1px solid #03787c'
  },

  paginationDotCenter: {
    position: 'absolute',
    left: '5px',
    width: '10px',
    height: '10px',
    top: '5px',
    backgroundColor: '#03787c',
    borderRadius: '50%'
  },

  loadingMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#605e5c'
  },

  errorMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#d13438'
  }
});

interface NewsCarouselWebPartProps {
  maxSlides?: number;
}

// Hook to fetch news hub data for carousel
const useNewsCarouselData = (maxSlides = 8) => {
  return useQuery({
    queryKey: ['newsCarousel', maxSlides],
    queryFn: async (): Promise<ContosoNewsHub[]> => {
      try {
        const result = await ContosoNewsHubService.getAll({
          top: maxSlides,
          orderBy: ['ViewCount desc', 'Created desc']
        });
        const fixedResult = fixPowerAppsResult<ContosoNewsHub[]>(result);
        
        if (!fixedResult.isSuccess) {
          console.warn('Error loading news carousel from SharePoint:', fixedResult.error);
          return [];
        }
        return fixedResult.result || [];
      } catch (error) {
        console.error('Exception in news carousel fetch:', error);
        return [];
      }
    },
    staleTime: 300000, // Cache for 5 minutes
  });
};

export default function NewsCarouselWebPart({ maxSlides = 8 }: NewsCarouselWebPartProps) {
  const styles = useStyles();
  const { data: carouselItems = [], isLoading, error } = useNewsCarouselData(maxSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  if (error) {
    console.error('Error loading news carousel from SharePoint:', error);
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          Failed to load news carousel. Please check your SharePoint connection.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>
          <Spinner size="medium" />
          Loading news carousel...
        </div>
      </div>
    );
  }

  if (carouselItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>
          No carousel items available. Please add news items to your ContosoNewsHub SharePoint list.
        </div>
      </div>
    );
  }

  // Use the active slide based on current index
  const activeSlide = carouselItems[activeSlideIndex];
  const imageUrl = activeSlide?.ImageUrl ? getImageUrl(activeSlide.ImageUrl, 'Why Story Telling Matters.png') : null;

  // Handler for pagination dot clicks
  const handleSlideChange = (index: number) => {
    setActiveSlideIndex(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.carouselContainer}>
        {imageUrl ? (
          <div 
            className={styles.carouselSlide}
            style={{
              backgroundImage: `url('${imageUrl}')`
            }}
          >
            <div className={styles.slideOverlay}>
              <div className={styles.slideTitle}>
                {activeSlide.Title}
              </div>
            </div>
          </div>
        ) : (
          <div 
            className={styles.carouselSlide}
            style={{
              backgroundColor: '#f3f2f1' // Light gray background when no image
            }}
          >
            <div className={styles.slideOverlay}>
              <div className={styles.slideTitle}>
                {activeSlide.Title}
              </div>
            </div>
          </div>
        )}

        {/* Pagination dots */}
        <div className={styles.pagination}>
          {carouselItems.slice(0, 8).map((_, index) => (
            <div 
              key={index} 
              className={`${styles.paginationDot} ${index === activeSlideIndex ? styles.paginationDotActive : ''}`}
              onClick={() => handleSlideChange(index)}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSlideChange(index);
                }
              }}
            >
              {index === activeSlideIndex && (
                <div className={styles.paginationDotCenter} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
