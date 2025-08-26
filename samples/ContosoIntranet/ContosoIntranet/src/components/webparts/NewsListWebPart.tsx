// NewsListWebPart.tsx - Simple News List with SharePoint data
import { useQuery } from '@tanstack/react-query';
import { makeStyles, Spinner } from '@fluentui/react-components';
import { ContosoNewsService } from '../../Services/ContosoNewsService';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';
import type { ContosoNews } from '../../Models/ContosoNewsModel';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    zIndex: 1
  },

  title: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '20px',
    color: '#323130',
    lineHeight: '26px'
  },

  newsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%'
  },

  newsItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px 0',
    borderBottom: '1px solid #edebe9',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f3f2f1'
    }
  },

  newsTitle: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    color: '#323130',
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  newsDate: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    color: '#605e5c',
    lineHeight: '16px'
  },

  loadingMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#605e5c'
  },

  errorMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#d13438'
  }
});

interface NewsListWebPartProps {
  title?: string;
  maxItems?: number;
}

// Hook to fetch news data for list
const useNewsListData = (maxItems = 5) => {
  return useQuery({
    queryKey: ['newsList', maxItems],
    queryFn: async (): Promise<ContosoNews[]> => {
      try {
        const result = await ContosoNewsService.getAll({
          top: maxItems,
          orderBy: ['Created desc']
        });
        const fixedResult = fixPowerAppsResult<ContosoNews[]>(result);
        
        if (!fixedResult.isSuccess) {
          console.warn('Error loading news list from SharePoint:', fixedResult.error);
          return [];
        }
        return fixedResult.result || [];
      } catch (error) {
        console.error('Exception in news list fetch:', error);
        return [];
      }
    },
    staleTime: 300000, // Cache for 5 minutes
  });
};

export default function NewsListWebPart({ title = "News List", maxItems = 5 }: NewsListWebPartProps) {
  const styles = useStyles();
  const { data: newsItems = [], isLoading, error } = useNewsListData(maxItems);

  if (error) {
    console.error('Error loading news list from SharePoint:', error);
    return (
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.errorMessage}>
          Failed to load news. Please check your SharePoint connection.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.loadingMessage}>
          <Spinner size="small" />
          Loading news...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      
      {newsItems.length === 0 ? (
        <div className={styles.errorMessage}>
          No news available. Please add news articles to your SharePoint list.
        </div>
      ) : (
        <div className={styles.newsList}>
          {newsItems.map((item, index) => (
            <div key={item.ID || index} className={styles.newsItem}>
              <div className={styles.newsTitle}>
                {item.Title}
              </div>
              <div className={styles.newsDate}>
                {item.Created ? new Date(item.Created).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'No date'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
