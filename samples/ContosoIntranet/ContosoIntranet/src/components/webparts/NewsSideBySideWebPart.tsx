// NewsSideBySideWebPart.tsx - Exact Figma "News: Side-by-side" implementation
import { useQuery } from '@tanstack/react-query';
import { makeStyles, Text, Spinner } from '@fluentui/react-components';
import { ContosoNewsService } from '../../Services/ContosoNewsService';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';
import type { ContosoNews } from '../../Models/ContosoNewsModel';

// Hook to fetch news from SharePoint
const useNewsData = (maxItems = 4) => {
  return useQuery({
    queryKey: ['newsSideBySide', maxItems],
    queryFn: async (): Promise<ContosoNews[]> => {
      try {
        const result = await ContosoNewsService.getAll({
          top: maxItems,
          orderBy: ['Created desc']
        });
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

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    zIndex: 2
  },
  
  newsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  newsRow: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  newsItem: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '1px',
    minWidth: '1px',
    paddingBottom: '20px',
    paddingTop: '0',
    paddingLeft: '0',
    paddingRight: '0',
    position: 'relative',
    flexShrink: 0,
    '&::after': {
      content: '""',
      position: 'absolute',
      border: '0px 0px 1px 0px solid #edebe9',
      bottom: 0,
      left: 0,
      right: 0,
      pointerEvents: 'none'
    }
  },
  
  newsContent: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  newsImage: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '112px',
    position: 'relative',
    flexShrink: 0,
    width: '196px',
    border: '1px solid #e1dfdd'
  },
  
  newsTextContent: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '1px',
    minWidth: '1px',
    padding: '0',
    position: 'relative',
    flexShrink: 0
  },
  
  newsItemContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  newsKicker: {
    backgroundColor: '#03787c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '2px',
    paddingBottom: '2px',
    position: 'relative',
    borderRadius: '2px',
    flexShrink: 0
  },
  
  kickerText: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    fontStyle: 'normal',
    lineHeight: '16px',
    color: '#ffffff',
    position: 'relative',
    flexShrink: 0,
    textTransform: 'uppercase',
    whiteSpace: 'pre'
  },
  
  newsListBase: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontWeight: 400,
    fontStyle: 'normal',
    overflow: 'hidden',
    paddingBottom: '0',
    paddingTop: '3px',
    paddingLeft: '0',
    paddingRight: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%'
  },
  
  newsTitle: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '22px',
    maxHeight: '44px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
    flexShrink: 0,
    color: '#323130',
    width: '100%'
  },
  
  newsDescription: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    height: '20px',
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
    flexShrink: 0,
    color: '#605e5c',
    whiteSpace: 'nowrap',
    width: '100%'
  },
  
  newsMetadata: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0
  },
  
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '107px'
  },
  
  nameAndDate: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0
  },
  
  author: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: '0',
    paddingRight: '5px',
    paddingTop: '0',
    paddingBottom: '0',
    position: 'relative',
    flexShrink: 0
  },
  
  authorText: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    fontStyle: 'normal',
    lineHeight: '16px',
    color: '#323130',
    position: 'relative',
    flexShrink: 0,
    whiteSpace: 'pre'
  },
  
  dateContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0
  },
  
  dateText: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    fontStyle: 'normal',
    lineHeight: '16px',
    color: '#605e5c',
    position: 'relative',
    flexShrink: 0,
    width: '40px'
  }
});

export default function NewsSideBySideWebPart() {
  const styles = useStyles();
  const { data: newsItems = [], isLoading, error } = useNewsData(4);

  const getAuthorName = (author: unknown, authorClaims?: string): string => {
    if (authorClaims) return authorClaims;
    if (!author) return 'Unknown Author';
    if (typeof author === 'object' && author !== null) {
      const authorObj = author as { DisplayName?: string; Title?: string; Name?: string };
      return authorObj.DisplayName || authorObj.Title || authorObj.Name || 'Unknown Author';
    }
    return String(author);
  };

  const getCategoryName = (category: unknown, fallback?: string): string => {
    if (typeof category === 'object' && category !== null) {
      const categoryObj = category as { Title?: string; Value?: string };
      return categoryObj.Title || categoryObj.Value || fallback || 'NEWS';
    }
    return fallback || 'NEWS';
  };

  // Helper function to format news item data
  const formatNewsItem = (item: ContosoNews, index: number) => {
    return {
      id: item.ID || index + 1,
      title: item.Title || 'No title',
      description: item.Summary || 'Description goes here, 1 row max',
      author: getAuthorName(item.Author, item["Author#Claims"]),
      date: item.Created ? new Date(item.Created).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date',
      category: getCategoryName(item.Category, item.OData__ColorTag),
      imageUrl: item.ImageUrl || ''
    };
  };

  if (isLoading) {
    return (
      <div className={styles.container} data-name="News: Side-by-side">
        <Spinner size="medium" label="Loading news..." />
      </div>
    );
  }

  if (error || newsItems.length === 0) {
    return (
      <div className={styles.container} data-name="News: Side-by-side">
        <Text>No news articles available</Text>
      </div>
    );
  }

  const formattedItems = newsItems.map(formatNewsItem);
  
  return (
    <div className={styles.container} data-name="News: Side-by-side">
      <div className={styles.newsContainer} data-name="Container">
        {/* Row 1 */}
        <div className={styles.newsRow} data-name="Row 1">
          {formattedItems.slice(0, 2).map((item) => (
            <div key={item.id} className={styles.newsItem} data-name="Content wrap">
              <div className={styles.newsContent} data-name="Content">
                <div 
                  className={styles.newsImage}
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                  data-name="Image" 
                />
                <div className={styles.newsTextContent} data-name="Content">
                  <div className={styles.newsItemContent} data-name="News item content / Small">
                    <div className={styles.newsKicker} data-name="News Kicker">
                      <div className={styles.kickerText}>
                        {item.category}
                      </div>
                    </div>
                    <div className={styles.newsListBase} data-name=".base/news: list">
                      <div className={styles.newsTitle}>
                        {item.title}
                      </div>
                      <div className={styles.newsDescription}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className={styles.newsMetadata} data-name="News metadata">
                    <div className={styles.detailsContainer} data-name="Details-container">
                      <div className={styles.nameAndDate} data-name="Name + date">
                        <div className={styles.author} data-name="Author">
                          <div className={styles.authorText}>
                            {item.author}
                          </div>
                        </div>
                        <div className={styles.dateContainer} data-name="Date">
                          <div className={styles.dateText}>
                            {item.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Row 2 */}
        <div className={styles.newsRow} data-name="Row 2">
          {formattedItems.slice(2, 4).map((item) => (
            <div key={item.id} className={styles.newsItem} data-name="Content wrap">
              <div className={styles.newsContent} data-name="Content">
                <div 
                  className={styles.newsImage}
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                  data-name="Image" 
                />
                <div className={styles.newsTextContent} data-name="Content">
                  <div className={styles.newsItemContent} data-name="News item content / Small">
                    <div className={styles.newsKicker} data-name="News Kicker">
                      <div className={styles.kickerText}>
                        {item.category}
                      </div>
                    </div>
                    <div className={styles.newsListBase} data-name=".base/news: list">
                      <div className={styles.newsTitle}>
                        {item.title}
                      </div>
                      <div className={styles.newsDescription}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <div className={styles.newsMetadata} data-name="News metadata">
                    <div className={styles.detailsContainer} data-name="Details-container">
                      <div className={styles.nameAndDate} data-name="Name + date">
                        <div className={styles.author} data-name="Author">
                          <div className={styles.authorText}>
                            {item.author}
                          </div>
                        </div>
                        <div className={styles.dateContainer} data-name="Date">
                          <div className={styles.dateText}>
                            {item.date}
                          </div>
                        </div>
                      </div>
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
