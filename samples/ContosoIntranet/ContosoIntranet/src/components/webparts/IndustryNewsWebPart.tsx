import { useQuery } from '@tanstack/react-query';
import { makeStyles } from '@fluentui/react-components';
import { ContosoNewsService } from '../../Services/ContosoNewsService';
import type { ContosoNews } from '../../Models/ContosoNewsModel';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';

// Industry News - exact Figma News: Hub specifications
const useStyles = makeStyles({
  // Main container
  newsHub: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    width: '100%',
    zIndex: 1
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
    lineHeight: '26px',
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
    lineHeight: '20px',
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
    gap: '0',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    width: '100%'
  },

  // Grid layout
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    width: '100%'
  },

  // Card styles
  newsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    backgroundColor: '#ffffff',
    border: '1px solid #edebe9',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  // Image section
  cardImage: {
    position: 'relative',
    width: '100%',
    height: '160px',
    overflow: 'hidden'
  },

  // Text content
  cardText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '16px',
    position: 'relative',
    width: '100%'
  },

  cardTextContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    width: '100%'
  },

  // Category
  category: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '16px',
    fontStyle: 'normal',
    color: '#03787c',
    position: 'relative',
    textTransform: 'uppercase',
    flexShrink: 0
  },

  // Article title
  articleTitle: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    fontStyle: 'normal',
    color: '#323130',
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    flexShrink: 0
  },

  // Metadata row
  metadata: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative'
  },

  metadataText: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
    fontStyle: 'normal',
    color: '#605e5c',
    position: 'relative'
  },

  separator: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#8a8886',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#605e5c'
  },

  // Loading, error, and empty states
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
  },

  emptyMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#8a8886'
  }
});

interface IndustryNewsWebPartProps {
  title?: string;
}

// Hook to fetch industry news from SharePoint
const useIndustryNews = () => {
  return useQuery({
    queryKey: ['industryNews'],
    queryFn: async (): Promise<ContosoNews[]> => {
      try {
        const result = await ContosoNewsService.getAll();
        const fixedResult = fixPowerAppsResult<ContosoNews[]>(result);
        
        if (!fixedResult.isSuccess) {
          console.warn('Error loading news from SharePoint:', fixedResult.error);
          return [];
        }
        return fixedResult.result || [];
      } catch (error) {
        console.error('Exception in news fetch:', error);
        return [];
      }
    },
    staleTime: 300000, // Cache for 5 minutes
  });
};

export default function IndustryNewsWebPart({ title = "Industry News" }: IndustryNewsWebPartProps) {
  const styles = useStyles();
  const { data: sharePointNews = [], isLoading, error } = useIndustryNews();
  
  const getAuthorName = (author: unknown): string => {
    if (!author) return 'Admin';
    if (typeof author === 'object' && author !== null) {
      const authorObj = author as { DisplayName?: string; Title?: string; Name?: string };
      return authorObj.DisplayName || authorObj.Title || authorObj.Name || 'Admin';
    }
    return String(author);
  };

  console.log(sharePointNews);
  if (error) {
    console.error('Error loading news from SharePoint:', error);
    return (
      <div className={styles.newsHub}>
        <div className={styles.errorMessage}>
          Failed to load news. Please check your SharePoint connection.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.newsHub}>
        <div className={styles.loadingMessage}>
          Loading news...
        </div>
      </div>
    );
  }

  if (sharePointNews.length === 0) {
    return (
      <div className={styles.newsHub}>
        <div className={styles.emptyMessage}>
          No news available. Please add news articles to your SharePoint list.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.newsHub}>
      {/* Title section */}
      <div className={styles.titleSection}>
        <div className={styles.titleHeader}>
          <div className={styles.title}>
            <p>{title}</p>
          </div>
          <div className={styles.seeAll}>
            <div className={styles.seeAllLink}>
              <p>See all</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className={styles.contentSection}>
        <div className={styles.newsGrid}>
          {sharePointNews.map((item: ContosoNews, index: number) => (
            <div key={index} className={styles.newsCard}>
              {/* Image section */}
              <div className={styles.cardImage}>
                {item.ImageUrl ? (
                  <img 
                    src={item.ImageUrl} 
                    alt={item.Title} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }} 
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f3f2f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#605e5c',
                    fontSize: '14px'
                  }}>
                    Industry News
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className={styles.cardText}>
                <div className={styles.cardTextContent}>
                  {/* Category */}
                  <div className={styles.category}>
                    <p>{typeof item.Category === 'object' && item.Category ? (item.Category as { Value?: string; Title?: string }).Value || (item.Category as { Value?: string; Title?: string }).Title || 'Industry' : item.OData__ColorTag || 'Industry'}</p>
                  </div>

                  {/* Title */}
                  <div className={styles.articleTitle}>
                    <p>{item.Title}</p>
                  </div>

                  {/* Metadata */}
                  <div className={styles.metadata}>
                    <div className={styles.metadataText}>
                      <p>{getAuthorName(item.Author)}</p>
                    </div>
                    <div className={styles.separator}>
                      <p>•</p>
                    </div>
                    <div className={styles.metadataText}>
                      <p>{item.Created ? new Date(item.Created).toLocaleDateString() : ''}</p>
                    </div>
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