// src/themes/figmaTheme.ts
import { 
  createLightTheme,
  createDarkTheme
} from '@fluentui/react-components';
import type { 
  BrandVariants,
  Theme
} from '@fluentui/react-components';

// Brand colors extracted from Figma Communication Site
const contosoSharePointBrand: BrandVariants = {
  10: '#000f10',
  20: '#001d1f',
  30: '#002a2d',
  40: '#00373b',
  50: '#004449',
  60: '#005157',
  70: '#005f65',
  80: '#006d73',
  90: '#03787c', // Primary brand color from Figma
  100: '#0d8b8f',
  110: '#1a9ea2',
  120: '#28b1b5',
  130: '#37c4c8',
  140: '#47d7db',
  150: '#58eaee',
  160: '#6afdff'
};

// Create light theme based on Figma Communication Site
export const contosoLightTheme: Theme = {
  ...createLightTheme(contosoSharePointBrand),
  // Override specific brand tokens to match Figma exactly
  colorBrandBackground: '#03787c',
  colorBrandBackgroundHover: '#026a6f', 
  colorBrandBackgroundPressed: '#025357',
  colorBrandForeground1: '#03787c',
  colorBrandForeground2: '#ffffff',
  colorBrandStroke1: '#03787c',
  colorBrandStroke2: '#026a6f',
  
  // Override neutral colors to match Figma
  colorNeutralBackground1: '#ffffff',
  colorNeutralBackground2: '#f8f8f8',
  colorNeutralBackground3: '#f3f2f1',
  colorNeutralBackground4: '#edebe9',
  colorNeutralBackground5: '#e1dfdd',
  colorNeutralBackground6: '#d2d0ce',
  
  colorNeutralForeground1: '#323130',
  colorNeutralForeground2: '#605e5c',
  colorNeutralForeground3: '#8a8886',
  colorNeutralForeground4: '#c8c6c4',
  
  colorNeutralStroke1: '#d2d0ce',
  colorNeutralStroke2: '#e1dfdd',
  
  // Typography overrides to match Figma
  fontFamilyBase: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif',
  fontFamilyMonospace: 'Consolas, "Courier New", monospace',
  
  // Spacing tokens for consistent layouts
  spacingHorizontalXXS: '2px',
  spacingHorizontalXS: '4px',
  spacingHorizontalS: '8px',
  spacingHorizontalM: '12px',
  spacingHorizontalL: '16px',
  spacingHorizontalXL: '20px',
  spacingHorizontalXXL: '24px',
  spacingHorizontalXXXL: '32px',
  
  spacingVerticalXXS: '2px',
  spacingVerticalXS: '4px',
  spacingVerticalS: '8px',
  spacingVerticalM: '12px',
  spacingVerticalL: '16px',
  spacingVerticalXL: '20px',
  spacingVerticalXXL: '24px',
  spacingVerticalXXXL: '32px',
  
  // Border radius from Figma
  borderRadiusSmall: '2px',
  borderRadiusMedium: '4px',
  borderRadiusLarge: '8px',
  borderRadiusXLarge: '12px',
  
  // Shadows from Figma
  shadow2: '0px 2px 4px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)',
  shadow4: '0px 4px 8px 0px rgba(0,0,0,0.14), 0px 0px 4px 0px rgba(0,0,0,0.12)',
  shadow8: '0px 8px 16px 0px rgba(0,0,0,0.14), 0px 0px 8px 0px rgba(0,0,0,0.12)',
  shadow16: '0px 16px 32px 0px rgba(0,0,0,0.14), 0px 0px 16px 0px rgba(0,0,0,0.12)',
  shadow28: '0px 28px 56px 0px rgba(0,0,0,0.14), 0px 0px 28px 0px rgba(0,0,0,0.12)',
  shadow64: '0px 64px 128px 0px rgba(0,0,0,0.14), 0px 0px 64px 0px rgba(0,0,0,0.12)'
};

// Create dark theme based on Figma Communication Site  
export const contosoDarkTheme: Theme = {
  ...createDarkTheme(contosoSharePointBrand),
  // Keep brand colors consistent in dark mode
  colorBrandBackground: '#03787c',
  colorBrandBackgroundHover: '#0d8b8f',
  colorBrandBackgroundPressed: '#1a9ea2',
  colorBrandForeground1: '#28b1b5',
  colorBrandForeground2: '#ffffff',
  colorBrandStroke1: '#03787c',
  colorBrandStroke2: '#0d8b8f',
  
  // Dark theme neutral overrides
  colorNeutralBackground1: '#1f1f1f',
  colorNeutralBackground2: '#2d2d2d',
  colorNeutralBackground3: '#3a3a3a',
  colorNeutralBackground4: '#404040',
  colorNeutralBackground5: '#4a4a4a',
  colorNeutralBackground6: '#525252',
  
  colorNeutralForeground1: '#ffffff',
  colorNeutralForeground2: '#d2d0ce',
  colorNeutralForeground3: '#c8c6c4',
  colorNeutralForeground4: '#8a8886',
  
  colorNeutralStroke1: '#525252',
  colorNeutralStroke2: '#404040',
  
  // Typography consistent with light theme
  fontFamilyBase: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif',
  fontFamilyMonospace: 'Consolas, "Courier New", monospace',
  
  // Consistent spacing
  spacingHorizontalXXS: '2px',
  spacingHorizontalXS: '4px',
  spacingHorizontalS: '8px',
  spacingHorizontalM: '12px',
  spacingHorizontalL: '16px',
  spacingHorizontalXL: '20px',
  spacingHorizontalXXL: '24px',
  spacingHorizontalXXXL: '32px',
  
  spacingVerticalXXS: '2px',
  spacingVerticalXS: '4px',
  spacingVerticalS: '8px',
  spacingVerticalM: '12px',
  spacingVerticalL: '16px',
  spacingVerticalXL: '20px',
  spacingVerticalXXL: '24px',
  spacingVerticalXXXL: '32px',
  
  // Consistent border radius
  borderRadiusSmall: '2px',
  borderRadiusMedium: '4px',
  borderRadiusLarge: '8px',
  borderRadiusXLarge: '12px',
  
  // Dark theme shadows
  shadow2: '0px 2px 4px 0px rgba(0,0,0,0.28), 0px 0px 2px 0px rgba(0,0,0,0.24)',
  shadow4: '0px 4px 8px 0px rgba(0,0,0,0.28), 0px 0px 4px 0px rgba(0,0,0,0.24)',
  shadow8: '0px 8px 16px 0px rgba(0,0,0,0.28), 0px 0px 8px 0px rgba(0,0,0,0.24)',
  shadow16: '0px 16px 32px 0px rgba(0,0,0,0.28), 0px 0px 16px 0px rgba(0,0,0,0.24)',
  shadow28: '0px 28px 56px 0px rgba(0,0,0,0.28), 0px 0px 28px 0px rgba(0,0,0,0.24)',
  shadow64: '0px 64px 128px 0px rgba(0,0,0,0.28), 0px 0px 64px 0px rgba(0,0,0,0.24)'
};

// Type definitions for custom tokens (optional but recommended)
export interface ContosoTheme extends Theme {
  colorSuiteHeaderBackground: string;
  colorSuiteHeaderBrandAccent: string;
  colorTenantBackground: string;
  colorSiteHeaderBackground: string;
  colorSiteHeaderForeground: string;
  colorContentBackground: string;
  colorCardBackground: string;
  colorCardBorder: string;
  colorIndustryNewsBackground: string;
  controlHeightSuiteHeader: string;
  controlHeightSiteHeader: string;
  controlHeightAppBarButton: string;
  controlWidthAppBar: string;
}

// Theme provider helper
export function getContosoTheme(isDarkMode: boolean): Theme {
  return isDarkMode ? contosoDarkTheme : contosoLightTheme;
}

// Export theme variants for component usage
export const themeVariants = {
  light: contosoLightTheme,
  dark: contosoDarkTheme
} as const;

export type ThemeVariant = keyof typeof themeVariants;
