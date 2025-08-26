// C:\PowerAppsCodeApps\ContosoIntranet\src\components\webparts\EventsWebPart.tsx

import { makeStyles, tokens } from '@fluentui/react-components';
import { Calendar20Regular } from '@fluentui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { ContosoEventsService } from '../../Services/ContosoEventsService';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';
import { getImageUrl } from '../../utils/imageUtils';
import type { ContosoEvents } from '../../Models/ContosoEventsModel';

// Events: Filmstrip - exact Figma specifications
const useStyles = makeStyles({
  // Container with responsive measurements
  eventsFilmstrip: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    width: '100%', // Make it responsive instead of fixed width
    zIndex: 1,
    '@media (max-width: 768px)': {
      gap: '12px',
    },
  },
  
  // Title section
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    width: '100%'
  },
  
  titleHeader: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '0',
    position: 'relative',
    width: '100%'
  },
  
  title: {
    flex: '1 1 0%',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: 0,
    fontStyle: 'normal',
    color: '#323130',
    minHeight: '1px',
    minWidth: '1px',
    position: 'relative'
  },
  
  seeAll: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '0',
    position: 'relative'
  },
  
  seeAllLink: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 0,
    fontStyle: 'normal',
    color: '#03787c',
    position: 'relative',
    textAlign: 'right',
    cursor: 'pointer'
  },
  
  // Content section
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    width: '100%'
  },
  
  // Events grid
  eventsGrid: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    width: '100%',
    flexWrap: 'wrap',
    
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '16px'
    },
    
    '@media (max-width: 1024px)': {
      gap: '16px'
    }
  },
  
  // Individual event card
  eventCard: {
    flex: '1 1 0%',
    backgroundColor: '#ffffff',
    minHeight: '1px',
    minWidth: '280px',
    position: 'relative',
    borderRadius: '2px',
    flexShrink: 0,
    border: '1px solid #e1dfdd',
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)',
    
    '@media (max-width: 768px)': {
      minWidth: '100%',
      flex: '1 1 100%'
    },
    
    '@media (max-width: 1024px)': {
      minWidth: '240px'
    }
  },
  
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    width: '100%'
  },
  
  // Image section with date overlay
  cardImage: {
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    isolation: 'isolate',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  dateOverlay: {
    position: 'absolute',
    bottom: '8.25px',
    height: '80px',
    lineHeight: 0,
    left: '12px',
    fontStyle: 'normal',
    overflow: 'hidden',
    color: '#323130',
    width: '259px',
    zIndex: 2
  },
  
  dayText: {
    position: 'absolute',
    bottom: '42px',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 700,
    fontSize: '42px',
    left: 0,
    transform: 'translateY(100%)'
  },
  
  monthText: {
    position: 'absolute',
    bottom: '66px',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '18px',
    left: 0,
    transform: 'translateY(100%)',
    textTransform: 'uppercase'
  },
  
  // Aspect ratio container
  aspectRatio: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    zIndex: 1
  },
  
  aspectRatioInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    height: '180px'
  },
  
  // Card text section
  cardTextSection: {
    height: '133px',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    overflow: 'hidden'
  },
  
  cardTextContent: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    height: '122px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    left: '12px',
    padding: '0',
    right: '12px',
    top: '11px'
  },
  
  // Category and title
  categoryAndTitle: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    height: '56px',
    lineHeight: 0,
    fontStyle: 'normal',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  eventCategory: {
    position: 'absolute',
    height: '16px',
    left: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#605e5c',
    fontSize: '12px',
    top: 0,
    width: '262px',
    lineHeight: '16px'
  },
  
  eventTitle: {
    position: 'absolute',
    height: '40px',
    left: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#323130',
    fontSize: '14px',
    top: '16px',
    width: '262px',
    lineHeight: '20px'
  },
  
  // Date and location section
  dateLocation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '11px',
    height: '53px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    lineHeight: 0,
    fontStyle: 'normal',
    paddingBottom: '10px',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    position: 'relative',
    flexShrink: 0,
    color: '#605e5c',
    fontSize: '12px',
    width: '100%'
  },
  
  dateTime: {
    display: 'flex',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    gap: '4px'
  },
  
  location: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 400,
    height: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    lineHeight: '16px'
  },
  
  // Download event section
  downloadEvent: {
    height: '35px',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  downloadIcon: {
    position: 'absolute',
    left: '12px',
    width: '20px',
    height: '20px',
    top: 'calc(50% - 0.5px)',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground3
  },
  
  // Pagination
  pagination: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
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
    height: '20px'
  },
  
  paginationDotActive: {
    border: '1px solid #03787c'
  },
  
  paginationDotInactive: {
    border: '1px solid #323130'
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
  
  // Loading state
  loadingState: {
    padding: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
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
    minHeight: '200px',
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
    minHeight: '200px',
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    backgroundColor: tokens.colorNeutralBackground2,
    textAlign: 'center',
    padding: '32px',
    borderRadius: '4px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  }
});

interface EventsWebPartProps {
  title?: string;
}

// Custom hook for events data
function useEventsData() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const result = await ContosoEventsService.getAll({
          orderBy: ['EventDate asc'],
          top: 10
        });
        
        const fixedResult = fixPowerAppsResult<ContosoEvents[]>(result);
        
        if (!fixedResult.isSuccess) {
          console.warn('Error loading events from SharePoint:', fixedResult.error);
          return [];
        }
        return fixedResult.result || [];
      } catch (error) {
        console.error('Exception in events fetch:', error);
        return [];
      }
    },
    staleTime: 300000, // Cache for 5 minutes
  });
}

export default function EventsWebPart({ title = "Company Events" }: EventsWebPartProps) {
  const styles = useStyles();
  const { data: sharePointEvents = [], isLoading, error } = useEventsData();

  if (error) {
    console.error('Error loading events from SharePoint:', error);
    return (
      <div className={styles.eventsFilmstrip}>
        <div className={styles.errorMessage}>
          Failed to load events. Please check your SharePoint connection.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.eventsFilmstrip}>
        <div className={styles.loadingMessage}>
          Loading events...
        </div>
      </div>
    );
  }

  if (sharePointEvents.length === 0) {
    return (
      <div className={styles.eventsFilmstrip}>
        <div className={styles.emptyMessage}>
          No events available. Please add events to your SharePoint list.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventsFilmstrip}>
      {/* Title section */}
      <div className={styles.titleSection}>
        <div className={styles.titleHeader}>
          <div className={styles.title}>
            <p style={{ lineHeight: '26px' }}>{title}</p>
          </div>
          <div className={styles.seeAll}>
            <div className={styles.seeAllLink}>
              <p style={{ lineHeight: '20px', whiteSpace: 'pre' }}>See all</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className={styles.contentSection}>
        <div className={styles.eventsGrid}>
          {sharePointEvents.slice(0, 4).map((event: ContosoEvents, index: number) => {
            const eventDate = event.EventDate ? new Date(event.EventDate) : new Date();
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            
            // Extract thumbnail URL properly from SharePoint field
            const getThumbnailUrl = (thumbnailField?: Record<string, unknown>): string | null => {
              if (!thumbnailField) return null;
              
              // Try different possible thumbnail URL properties
              if (typeof thumbnailField === 'string') {
                return thumbnailField;
              }
              
              // SharePoint thumbnail objects often have these properties
              const urlFields = ['Url', 'url', 'URL', 'large', 'medium', 'small', 'serverUrl'];
              for (const field of urlFields) {
                if (thumbnailField[field] && typeof thumbnailField[field] === 'string') {
                  return thumbnailField[field] as string;
                }
              }
              
              return null;
            };
            
            const thumbnailUrl = getThumbnailUrl(event['{Thumbnail}']);
            // Use appropriate fallback images for events
            const eventFallbacks = [
              'App Designed for Collaboration.png',
              'Building a responsible ecosystem.jpg', 
              'Communicating Product Value.jpg',
              'Student mentorship opportunity.jpg'
            ];
            const fallbackImage = eventFallbacks[index % eventFallbacks.length];
            const imageUrl = getImageUrl(thumbnailUrl || undefined, fallbackImage);
            
            return (
              <div key={event.ID || index} className={styles.eventCard}>
                <div className={styles.cardContent}>
                  {/* Image with date overlay */}
                  <div className={styles.cardImage}>
                    <div className={styles.dateOverlay}>
                      <div className={styles.dayText}>
                        <p style={{ lineHeight: '42px', whiteSpace: 'pre' }}>
                          {day}
                        </p>
                      </div>
                      <div className={styles.monthText}>
                        <p style={{ lineHeight: '24px', whiteSpace: 'pre' }}>
                          {month}
                        </p>
                      </div>
                    </div>
                    <div className={styles.aspectRatio}>
                    <div 
                      className={styles.aspectRatioInner}
                      style={{
                        backgroundImage: `url('${imageUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* Background placeholder for image */}
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className={styles.cardTextSection}>
                  <div className={styles.cardTextContent}>
                    {/* Category and title */}
                    <div className={styles.categoryAndTitle}>
                      <div className={styles.eventCategory}>
                        <p style={{ lineHeight: '16px' }}>{event.Category || ''}</p>
                      </div>
                      <div className={styles.eventTitle}>
                        <p style={{ lineHeight: '20px' }}>{event.Title || ''}</p>
                      </div>
                    </div>

                    {/* Date and location */}
                    <div className={styles.dateLocation}>
                      <div className={styles.dateTime}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative', flexShrink: 0, lineHeight: '16px' }}>
                          <p style={{ lineHeight: '16px', whiteSpace: 'pre' }}>{event.Weekday || 'Mon'}</p>
                        </div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative', flexShrink: 0, width: '6px', lineHeight: '16px' }}>
                          <p style={{ lineHeight: '16px' }}>,</p>
                        </div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative', flexShrink: 0, lineHeight: '16px' }}>
                          <p style={{ lineHeight: '16px', whiteSpace: 'pre' }}>{month}</p>
                        </div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative', flexShrink: 0, lineHeight: '16px', textIndent: '3px' }}>
                          <p style={{ lineHeight: '16px', whiteSpace: 'pre' }}>{day}</p>
                        </div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative', flexShrink: 0, width: '6px', lineHeight: '16px' }}>
                          <p style={{ lineHeight: '16px' }}>,</p>
                        </div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative', flexShrink: 0, textTransform: 'uppercase', lineHeight: '16px' }}>
                          <p style={{ lineHeight: '16px', fontSize: '12px', whiteSpace: 'pre' }}>{` ${event.Time || '9:30 AM'}`}</p>
                        </div>
                      </div>
                      <div className={styles.location}>
                        <p style={{ fontSize: '12px', lineHeight: '16px' }}>{event.Location || 'Location'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download event */}
                <div className={styles.downloadEvent}>
                  <div className={styles.downloadIcon}>
                    <Calendar20Regular />
                  </div>
                </div>
              </div>
              {/* Card border */}
              <div style={{
                position: 'absolute',
                border: '1px solid #edebe9',
                borderLeft: 0,
                borderRight: 0,
                inset: 0,
                pointerEvents: 'none'
              }} />
            </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <div className={`${styles.paginationDot} ${styles.paginationDotActive}`}>
            <div className={styles.paginationDotCenter} />
          </div>
          {[1, 2, 3].map((_, index) => (
            <div key={index} className={`${styles.paginationDot} ${styles.paginationDotInactive}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
