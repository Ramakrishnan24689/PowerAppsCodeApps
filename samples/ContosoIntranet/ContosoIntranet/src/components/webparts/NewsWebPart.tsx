// NewsWebPart.tsx - News articles in a 2x2 grid layout
import React, { useState } from 'react';
import { 
  Text,
  makeStyles,
  shorthands,
  tokens,
  Spinner
} from '@fluentui/react-components';
import { useQuery } from '@tanstack/react-query';
import { ContosoNewsService } from '../../Services/ContosoNewsService';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';
import type { ContosoNews } from '../../Models/ContosoNewsModel';

// Component for handling image loading with fallbacks
const ImageWithFallback: React.FC<{
  src?: string;
  alt: string;
  className: string;
  fallbackText: string;
}> = ({ src, alt, className, fallbackText }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // If no src provided or image failed to load, show fallback immediately
  if (!src || imageError) {
    return (
      <div
        className={className}
        style={{
          backgroundColor: tokens.colorNeutralBackground3,
          border: `1px solid ${tokens.colorNeutralStroke2}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tokens.colorNeutralForeground2,
          fontSize: '12px',
          fontWeight: tokens.fontWeightSemibold,
          textAlign: 'center',
          padding: '8px'
        }}
        role="img"
        aria-label={alt}
      >
        {fallbackText}
      </div>
    );
  }
  
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Show loading state */}
      {!imageLoaded && !imageError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: tokens.colorNeutralBackground3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.colorNeutralForeground2,
            fontSize: '12px'
          }}
        >
          Loading...
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: imageLoaded ? 'block' : 'none'
        }}
        onError={() => {
          console.log(`Image failed to load: ${src}`);
          setImageError(true);
        }}
        onLoad={() => {
          console.log(`Image loaded successfully: ${src}`);
          setImageLoaded(true);
        }}
      />
    </div>
  );
};

const useStyles = makeStyles({
  newsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%'
  },
  
  newsRow: {
    display: 'flex',
    ...shorthands.gap('32px'),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '20px',
    },
  },
  
  newsItem: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    ...shorthands.padding('0', '0', '20px', '0'),
    position: 'relative',
    cursor: 'pointer',
    
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      height: '1px',
      backgroundColor: 'var(--figma-NeutralStroke4-Rest)',
      pointerEvents: 'none'
    },
    
    '&:hover .newsTitle': {
      textDecoration: 'underline'
    }
  },
  
  newsContent: {
    display: 'flex',
    ...shorthands.gap('20px'),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%'
  },
  
  newsImage: {
    width: '196px',
    height: '112px',
    flexShrink: 0,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    position: 'relative'
  },
  
  newsDetails: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    minWidth: '0'
  },
  
  newsKicker: {
    backgroundColor: 'var(--brand-primary)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...shorthands.padding('2px', '8px'),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    alignSelf: 'flex-start'
  },
  
  kickerText: {
    fontSize: '12px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundInverted,
    lineHeight: '16px',
    textTransform: 'uppercase'
  },
  
  newsContentBody: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    ...shorthands.padding('3px', '0', '0', '0'),
    width: '100%'
  },
  
  newsTitle: {
    fontSize: '16px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: '22px',
    maxHeight: '44px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    width: '100%'
  },
  
  newsDescription: {
    fontSize: '14px',
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
    lineHeight: '20px',
    height: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%'
  },
  
  newsMetadata: {
    display: 'flex',
    ...shorthands.gap('8px'),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  
  authorName: {
    fontSize: '12px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: '16px',
    whiteSpace: 'nowrap'
  },
  
  newsDate: {
    fontSize: '12px',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    lineHeight: '16px',
    width: '40px'
  }
});

interface NewsWebPartProps {
  /** Section title for the news web part */
  title?: string;
  /** Optional category filter for news */
  categoryFilter?: string;
  /** Maximum number of articles to display */
  maxArticles?: number;
}

// Custom hook for news data
function useNews(categoryFilter?: string, maxArticles = 4) {
  return useQuery({
    queryKey: ['news', categoryFilter, maxArticles],
    queryFn: async () => {
      const result = await ContosoNewsService.getAll({
        filter: categoryFilter ? `Category/Title eq '${categoryFilter}'` : undefined,
        top: maxArticles,
        orderBy: ['PublishDate desc']
      });
      const fixedResult = fixPowerAppsResult<ContosoNews[]>(result);
      if (!fixedResult.isSuccess) {
        throw new Error(fixedResult.error || 'Failed to fetch news');
      }
      return fixedResult.result || [];
    },
    staleTime: 60000, // Cache for 1 minute
  });
}

export default function NewsWebPart({
  title = 'Latest News',
  categoryFilter,
  maxArticles = 4
}: NewsWebPartProps) {
  const styles = useStyles();
  const { data: newsArticles = [], isLoading, error } = useNews(categoryFilter, maxArticles);

  const handleArticleClick = (article: ContosoNews) => {
    if (article["{Link}"]) {
      window.open(article["{Link}"], '_blank');
    } else {
      console.log(`Navigate to article: ${article.Title}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, article: ContosoNews) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleArticleClick(article);
    }
  };

  const getAuthorName = (author: unknown): string => {
    if (!author) return 'Admin';
    if (typeof author === 'object' && author !== null) {
      const authorObj = author as { DisplayName?: string; Title?: string; Name?: string };
      return authorObj.DisplayName || authorObj.Title || authorObj.Name || 'Admin';
    }
    return String(author);
  };

  if (isLoading) {
    return (
      <section className={styles.newsContainer}>
        <Text as="h2" size={600} weight="semibold">{title}</Text>
        <Spinner size="medium" label="Loading news..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.newsContainer}>
        <Text as="h2" size={600} weight="semibold">{title}</Text>
        <Text>Failed to load news articles</Text>
      </section>
    );
  }

  // Split articles into rows of 2
  const rows = [];
  for (let i = 0; i < newsArticles.length; i += 2) {
    rows.push(newsArticles.slice(i, i + 2));
  }

  return (
    <section className={styles.newsContainer} role="region" aria-labelledby="news-title">
      {title && (
        <Text as="h2" id="news-title" size={600} weight="semibold">
          {title}
        </Text>
      )}
      
      <div className={styles.newsContainer}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.newsRow}>
            {row.map((article: ContosoNews) => {
              const publishDate = article.PublishDate 
                ? new Date(article.PublishDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                : 'No date';
              
              const authorName = getAuthorName(article.Author);
              const categoryName = typeof article.Category === 'object' && article.Category 
                ? (article.Category as any).Title || 'News'
                : article.OData__ColorTag || 'News';
              
              return (
                <article
                  key={article.ID}
                  className={styles.newsItem}
                  onClick={() => handleArticleClick(article)}
                  onKeyDown={(e) => handleKeyDown(e, article)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${article.Title} by ${authorName}, ${publishDate}`}
                >
                  <div className={styles.newsContent}>
                    <ImageWithFallback
                      src={article.ImageUrl}
                      alt={article.Title}
                      className={styles.newsImage}
                      fallbackText={categoryName}
                    />
                    
                    <div className={styles.newsDetails}>
                      <div className={styles.newsKicker}>
                        <Text className={styles.kickerText}>
                          {categoryName}
                        </Text>
                      </div>
                      
                      <div className={styles.newsContentBody}>
                        <Text className={`${styles.newsTitle} newsTitle`}>
                          {article.Title}
                        </Text>
                        <Text className={styles.newsDescription}>
                          {article.Summary || 'Description goes here, 1 row max'}
                        </Text>
                      </div>
                      
                      <div className={styles.newsMetadata}>
                        <Text className={styles.authorName}>
                          {authorName}
                        </Text>
                        <Text className={styles.newsDate}>
                          {publishDate}
                        </Text>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            
            {/* Fill empty space if odd number of articles */}
            {row.length === 1 && <div style={{ flex: 1 }} />}
          </div>
        ))}
      </div>
    </section>
  );
}
