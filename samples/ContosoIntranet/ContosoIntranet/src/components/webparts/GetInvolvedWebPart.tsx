// GetInvolvedWebPart.tsx - Get Involved section with SharePoint data
import { useQuery } from '@tanstack/react-query';
import { makeStyles, Spinner } from '@fluentui/react-components';
import { ContosoNewsService } from '../../Services/ContosoNewsService';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';
import type { ContosoNews } from '../../Models/ContosoNewsModel';
import { getImageUrl } from '../../utils/imageUtils';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    '@media (max-width: 1024px)': {
      flexDirection: 'column',
    }
  },

  imageColumn: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: '1023px',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    zIndex: 1
  },

  imageContainer: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '400px',
    width: '100%',
    borderRadius: '4px'
  },

  contentColumn: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    zIndex: 2
  },

  title: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '28px',
    lineHeight: '36px',
    color: '#323130',
    width: '100%'
  },

  description: {
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '22px',
    color: '#323130',
    width: '100%',
    marginBottom: '16px'
  },

  buttonContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },

  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#03787c',
    border: 'none',
    borderRadius: '4px',
    color: '#ffffff',
    cursor: 'pointer',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    padding: '8px 16px',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: '#026a6f'
    }
  },

  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: '1px solid #323130',
    borderRadius: '4px',
    color: '#323130',
    cursor: 'pointer',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    padding: '8px 16px',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: '#f3f2f1'
    }
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

interface GetInvolvedWebPartProps {
  categoryFilter?: string;
}

// Hook to fetch get involved content from SharePoint
const useGetInvolvedData = (categoryFilter = 'Get Involved') => {
  return useQuery({
    queryKey: ['getInvolved', categoryFilter],
    queryFn: async (): Promise<ContosoNews | null> => {
      try {
        const result = await ContosoNewsService.getAll({
          filter: `OData__ColorTag eq '${categoryFilter}'`,
          top: 1,
          orderBy: ['Created desc']
        });
        const fixedResult = fixPowerAppsResult<ContosoNews[]>(result);
        
        if (!fixedResult.isSuccess) {
          console.warn('Error loading get involved content from SharePoint:', fixedResult.error);
          return null;
        }
        const items = fixedResult.result || [];
        return items.length > 0 ? items[0] : null;
      } catch (error) {
        console.error('Exception in get involved fetch:', error);
        return null;
      }
    },
    staleTime: 300000, // Cache for 5 minutes
  });
};

export default function GetInvolvedWebPart({ categoryFilter = 'Get Involved' }: GetInvolvedWebPartProps) {
  const styles = useStyles();
  const { data: getInvolvedItem, isLoading, error } = useGetInvolvedData(categoryFilter);

  if (error) {
    console.error('Error loading get involved content from SharePoint:', error);
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          Failed to load content. Please check your SharePoint connection.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>
          <Spinner size="medium" />
          Loading content...
        </div>
      </div>
    );
  }

  // Use SharePoint data if available
  if (!getInvolvedItem) {
    return null; // Don't render anything if no data
  }

  // Use SharePoint data only
  const title = getInvolvedItem.Title;
  const description = getInvolvedItem.Summary || '';
  const imageUrl = getInvolvedItem.ImageUrl ? getImageUrl(getInvolvedItem.ImageUrl, 'Get Involved - make a difference.jpg') : null;

  return (
    <div className={styles.container}>
      {imageUrl && (
        <div className={styles.imageColumn}>
          <div 
            className={styles.imageContainer}
            style={{
              backgroundImage: `url('${imageUrl}')`
            }} 
          />
        </div>
      )}
      
      <div className={styles.contentColumn}>
        <div className={styles.title}>
          {title}
        </div>
        
        <div className={styles.description}>
          {description}
        </div>
        
        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton}>
            Learn More
          </button>
          <button className={styles.secondaryButton}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
