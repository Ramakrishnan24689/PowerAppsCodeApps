// c:\PowerAppsCodeApps\ContosoIntranet\src\pages\HomePage.tsx

import { makeStyles } from '@fluentui/react-components';
import HeroWebPart from '../components/webparts/HeroWebPart';
import NewsSideBySideWebPart from '../components/webparts/NewsSideBySideWebPart';
import EventsWebPart from '../components/webparts/EventsWebPart';
import IndustryNewsWebPart from '../components/webparts/IndustryNewsWebPart';
import NewsCarouselWebPart from '../components/webparts/NewsCarouselWebPart';
import NewsListWebPart from '../components/webparts/NewsListWebPart';
import GetInvolvedWebPart from '../components/webparts/GetInvolvedWebPart';
import { getImageUrl } from '../utils/imageUtils';

const useStyles = makeStyles({
  homePage: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1366px', // Match Figma Communication Site width
    margin: '0 auto', // Center the content
  },
  
  // Section layouts matching Figma specifications with proper centering
  sectionOneColumn: {
    backgroundColor: '#ffffff',
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingLeft: '0', // No extra padding - ResponsiveLayout handles AppBar spacing
    paddingRight: '0',
    paddingTop: '32px',
    paddingBottom: '32px',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    isolation: 'isolate',
    '@media (max-width: 1024px)': {
      paddingLeft: '0', // No extra padding
      paddingRight: '0',
    },
    '@media (max-width: 768px)': {
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '16px',
      paddingBottom: '16px',
    },
  },
  
  columnFullWidth: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '40px',
    minWidth: '1px',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    zIndex: 1,
    isolation: 'isolate'
  },
  
  // Two column section (792px + 380px = 1172px + 32px gap = 1204px content)
  sectionOneThirdRight: {
    backgroundColor: '#ffffff',
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingLeft: '0', // No extra padding - ResponsiveLayout handles AppBar spacing
    paddingRight: '0',
    paddingTop: '32px',
    paddingBottom: '32px',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    isolation: 'isolate',
    '@media (max-width: 1024px)': {
      paddingLeft: '0',
      paddingRight: '0',
      flexDirection: 'column', // Stack columns on tablet
    },
    '@media (max-width: 768px)': {
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '16px',
      paddingBottom: '16px',
    },
  },
  
  columnTwoThirds: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '40px',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '792px',
    zIndex: 2,
    isolation: 'isolate',
    '@media (max-width: 1024px)': {
      width: '100%', // Full width on tablet
    },
  },
  
  columnOneThird: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '40px',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    width: '380px',
    zIndex: 1,
    isolation: 'isolate',
    '@media (max-width: 1024px)': {
      width: '100%', // Full width on tablet
    },
  },
  
  // Two column section with background
  sectionTwoColumns: {
    backgroundColor: '#f3f2f1',
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingLeft: '0', // No extra padding - ResponsiveLayout handles AppBar spacing
    paddingRight: '0',
    paddingTop: '32px',
    paddingBottom: '32px',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    isolation: 'isolate',
    '@media (max-width: 1024px)': {
      paddingLeft: '0',
      paddingRight: '0',
      flexDirection: 'column', // Stack columns
    },
    '@media (max-width: 768px)': {
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '16px',
      paddingBottom: '16px',
    },
  },
  
  columnEqual: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '40px',
    minWidth: '1px',
    overflow: 'hidden',
    padding: '0',
    position: 'relative',
    flexShrink: 0,
    isolation: 'isolate'
  },
  
  // One-third left section
  sectionOneThirdLeft: {
    backgroundColor: '#ffffff',
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingLeft: '0', // No extra padding - ResponsiveLayout handles AppBar spacing
    paddingRight: '0',
    paddingTop: '32px',
    paddingBottom: '32px',
    position: 'relative',
    flexShrink: 0,
    width: '100%',
    isolation: 'isolate',
    '@media (max-width: 1024px)': {
      paddingLeft: '0',
      paddingRight: '0',
      flexDirection: 'column', // Stack columns
    },
    '@media (max-width: 768px)': {
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '16px',
      paddingBottom: '16px',
    },
  }
});

export default function HomePage() {
  const styles = useStyles();

  return (
    <div className={styles.homePage}>
      {/* Section: One column - Hero Tiles */}
      <section className={styles.sectionOneColumn}>
        <div className={styles.columnFullWidth}>
          <HeroWebPart />
        </div>
      </section>
      
      {/* Section: One column - News Side-by-side */}
      <section className={styles.sectionOneColumn}>
        <div className={styles.columnFullWidth}>
          <NewsSideBySideWebPart />
        </div>
      </section>
      
      {/* Section: One column - Industry News Hub */}
      <section className={styles.sectionOneColumn}>
        <div className={styles.columnFullWidth}>
          <IndustryNewsWebPart />
        </div>
      </section>
      
      {/* Section: One column - Company Events Filmstrip */}
      <section className={styles.sectionOneColumn}>
        <div className={styles.columnFullWidth}>
          <EventsWebPart title="Company Events" />
        </div>
      </section>
      
      {/* Section: One-third right - News Carousel + List */}
      <section className={styles.sectionOneThirdRight}>
          <div className={styles.columnTwoThirds}>
            <NewsCarouselWebPart />
          </div>
          <div className={styles.columnOneThird}>
            <NewsListWebPart />
          </div>
      </section>
      
      {/* Section: Two columns - Get Involved + Image */}
      <section className={styles.sectionTwoColumns}>
        <GetInvolvedWebPart />
      </section>
      
      {/* Section: One-third left - Upcoming workshops + Hero Layers */}
      <section className={styles.sectionOneThirdLeft}>
          <div className={styles.columnOneThird} style={{ zIndex: 2 }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              maxWidth: '479px',
              padding: '0',
              position: 'relative',
              flexShrink: 0,
              width: '100%',
              zIndex: 1
            }}>
              <div style={{ 
                fontFamily: '"Segoe UI", sans-serif',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '26px',
                color: '#323130'
              }}>
                Upcoming workshops
              </div>
              {/* Compact event cards placeholder */}
              <div>Compact Events List</div>
            </div>
          </div>
          <div className={styles.columnTwoThirds} style={{ zIndex: 1 }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              maxWidth: '1023px',
              minWidth: '768px',
              padding: '0',
              position: 'relative',
              flexShrink: 0,
              width: '100%',
              zIndex: 1
            }}>
              {/* Hero Layers - Large background image */}
              <div style={{
                height: '400px',
                position: 'relative',
                flexShrink: 0,
                width: '100%',
                backgroundImage: `url('${getImageUrl('Why Story Telling Matters.png')}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}>
                {/* Optional overlay for text content */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 50%)',
                  borderRadius: '4px'
                }} />
              </div>
          </div>
        </div>
      </section>
      
      {/* Section: One column - Final Hero Tiles */}
      <section className={styles.sectionOneColumn}>
          <div className={styles.columnFullWidth}>
            {/* Bottom hero tiles placeholder */}
            <div style={{
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
              zIndex: 1
            }}>
              <div style={{
                flex: '1 1 0%',
                backgroundImage: `url('${getImageUrl('Open Door Policy.jpg')}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '450px',
                minHeight: '1px',
                minWidth: '1px',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute',
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.49) 100%)',
                  bottom: '0',
                  height: '350px',
                  left: '0',
                  opacity: 0.7,
                  right: '0'
                }} />
                <div style={{
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
                }}>
                  <div style={{
                    fontFamily: '"Segoe UI", sans-serif',
                    fontWeight: 600,
                    fontSize: '28px',
                    lineHeight: '36px',
                    color: '#ffffff'
                  }}>
                    Open door policy.
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color: '#ffffff' }}>
                    <span style={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 600, fontSize: '16px', lineHeight: '23px' }}>Learn more</span>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                      <path d="M8.5 4.5L13 9L8.5 13.5M13 9H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div style={{
                flex: '1 1 0%',
                backgroundImage: `url('${getImageUrl('App Designed for Collaboration.png')}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '450px',
                minHeight: '1px',
                minWidth: '1px',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute',
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.49) 100%)',
                  bottom: '0',
                  height: '350px',
                  left: '0',
                  opacity: 0.7,
                  right: '0'
                }} />
                <div style={{
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
                }}>
                  <div style={{
                    fontFamily: '"Segoe UI", sans-serif',
                    fontWeight: 600,
                    fontSize: '28px',
                    lineHeight: '36px',
                    color: '#ffffff'
                  }}>
                    Three steps to improve product performance.
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', color: '#ffffff' }}>
                    <span style={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 600, fontSize: '16px', lineHeight: '23px' }}>Read more</span>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                      <path d="M8.5 4.5L13 9L8.5 13.5M13 9H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
}
