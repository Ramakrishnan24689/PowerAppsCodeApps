# Implementation Plan — Hybrid: Adopt Figma UI + GitHub Copilot = Power Apps Code App

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Step-by-Step Workflow](#step-by-step-workflow)
- [Phase A — Project Scaffolding](#phase-a--project-scaffolding)
- [Phase B — Figma Extraction, Page Assembly & Routing](#phase-b--figma-extraction-page-assembly--routing)
- [Phase C — SharePoint Data Integration](#phase-c--sharepoint-data-integration)
- [Phase D — QA & Fluent v9 Enforcement](#phase-d--qa--fluent-v9-enforcement)
- [Phase E — Run & Deploy](#phase-e--run--deploy)
- [Execution Workflow & Quality Gates](#execution-workflow--quality-gates)
- [Known Issues & Workarounds](#known-issues--workarounds)


## Overview
This implementation follows a **component-level Figma extraction** approach to build a pixel-perfect SharePoint intranet as a Power Apps Code App:

- **Prerequisites**: SharePoint environment setup (7 lists with sample data)
- **Phase A**: Project scaffolding with React 18 + Fluent UI v9 + Power Platform CLI
- **Phase B**: Figma extraction, page assembly & routing
- **Phase C**: Complete SharePoint data integration (tasks, news, hero, events, quick links)
- **Phase D**: QA & Fluent v9 Enforcement
- **Phase E**: Run & Deploy

> **Alternative**: If Figma MCP is not available, use [`docs/ui-component-reference.md`](ui-component-reference.md) for implementation specifications.

**Key Success Factors**: Use complete Figma components (not simplified placeholders), maintain synchronized carousel functionality, ensure Fluent UI v9 compliance.

## Prerequisites

**Location**: `prereq-scripts/` directory in workspace root

**1. Run SharePoint Setup Script**
```powershell
# Navigate to prerequisite scripts
cd prereq-scripts

# Execute SharePoint environment setup
.\setup-sharepoint-environment.ps1 -SharePointSiteUrl "YOUR_SHAREPOINT_SITE_URL"
```

**2. What This Creates**
- SharePoint lists: 7 lists (`ContosoEvents`, `ContosoHero`, `ContosoNews`, `ContosoQuickLinks`, `ContosoNewsHub`, `ContosoTasks`, `ContosoTrending`)
- Custom columns with proper field types for each list
- Sample data: 34 total items across all lists (4 events, 5 hero, 4 news, 3 quicklinks, 12 newshub, 6 tasks, 6 trending)
- Proper permissions and configuration

**3. Prerequisites Completion Checklist** (must be complete before Phase A)
- [ ] PnP.PowerShell installed
- [ ] Site accessible (Connect-PnPOnline succeeds)
- [ ] All 7 lists exist (ContosoHero, ContosoNews, ContosoNewsHub, ContosoQuickLinks, ContosoEvents, ContosoTasks, ContosoTrending)
- [ ] Sample data counts match (total ~34 items)
- [ ] **Image URLs use SharePoint SiteAssets paths** (not local /assets/images/)
- [ ] List GUIDs recorded (Note these after the setup-sharepoint-environment script are executed successfully)
- [ ] Connector ID recorded (local notes only)
- [ ] Site URL recorded (raw)

**Verification Gate (Stop if incomplete)**: Do not start A1 until every box above is checked.

**⚠️ IMPORTANT**: Complete SharePoint setup **BEFORE** running `pac code add-data-source`

## Step-by-Step Workflow
**Read, understand & follow:**
- `docs/requirements.md`
- `docs/implementation-plan.md`
- `prereq-scripts/README.md`

**IMAGE ASSET MANAGEMENT: All Figma Images Must Be Mapped**

📸 **IMAGE HANDLING FOR ALL WEB PARTS:**
- **🚨 CRITICAL: All required images are available in `../assets/images/` - use best judgment to map content**
- **ALL images from Figma frames** must be extracted and mapped for every web part component
- **Image names correspond to titles/content** making mapping straightforward  
- **Copy/move images** from `/assets/images/` to `/public/assets/images/` for React serving
- **Update image paths** in both SharePoint lists and React components to match exact Figma content

**CONVERSATIONAL WORKFLOW: Component-Level Figma Extraction for Pixel-Perfect Results**

🤖 **COPILOT CONVERSATION PATTERN:**

**Before using any `get_code` tools, Copilot must:**

1. **INFORM the user** which specific Figma frame/component will be used
2. **ASK the user to confirm** the exact frame is active in Figma Desktop
3. **WAIT for user confirmation** before proceeding with MCP tool calls
4. **ONLY THEN** call the `get_code` tool

## 🤖 AI Workflow Rules

**Sequential Execution**: Execute steps in exact order, verify each completion before proceeding
**Directory Context**: Always locate correct directory before commands to avoid directory confusion
**Critical Dependencies**: Phase C0 (SharePoint bug workaround) must execute BEFORE any SharePoint service calls
**Verification Gates**: Check console/network for actual SharePoint data loading, not just UI rendering

## Phase A — Project Scaffolding

**Goal**: Create a clean Vite + React + TS app, initialize as Power Apps Code App, and prepare for MCP component extraction.

### **A1: Create Base Vite App** (Only after Verification Gate passed)
1) Create base app
```bash
npm create vite@latest ContosoIntranet -- --template react-ts
cd ContosoIntranet
npm install
```

### **A2: Install Required Packages**
1) Pin React to v18.2.0 and install required packages
```bash
# Pin React to v18.2.0 (Power Apps Code SDK requirement)
npm install react@18.2.0 react-dom@18.2.0
npm install -D @types/react@^18.0.0 @types/react-dom@^18.0.0

# Install Fluent UI v9 and other required packages
npm install @fluentui/react-components @fluentui/react-icons 
npm install -D typescript vite @types/node

# Verify React version
npm list react
```

### **A3: Configure Vite**
1) Configure Vite with proper settings
Create `vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  base: './',
  server: { host: '::', port: 3000 }, // fallback: host: true or '0.0.0.0'
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
```

### **A4: Initialize Power Apps Code App**
1) Initialize Power Apps Code App
```bash
pac code init --displayName "ContosoIntranet" -l ../assets/SharePoint.svg
```
This adds `power.config.json` and prepares the project for Code App packaging.

### **A5: Add SharePoint Data Sources**
1) Add SharePoint Data Sources for All Lists

**IMPORTANT**: Before running these commands, you need to obtain:
- **SharePoint Site URL**: The URL used when running the prerequisite scripts (Which would have received before running .\setup-sharepoint-environment.ps1)
- **Connector ID**: Ask user for their SharePoint Online connector ID
- **List GUIDs**: Will be available after running the SharePoint setup scripts(Which were noted after running .\setup-sharepoint-environment.ps1)

```bash
# Note: Replace placeholders with actual values:
# - CONNECTOR_ID: User's SharePoint Online connector ID 
# - DOUBLE_ENCODED_SITE_URL: SharePoint site URL (double URL-encoded)
# - LIST_GUID: Each list's GUID from SharePoint setup script output

# Add ContosoEvents data source
pac code add-data-source -a "shared_sharepointonline" -c "CONNECTOR_ID" -t "CONTOSO_EVENTS_LIST_GUID" -d "DOUBLE_ENCODED_SITE_URL"

# Add ContosoHero data source
pac code add-data-source -a "shared_sharepointonline" -c "CONNECTOR_ID" -t "CONTOSO_HERO_LIST_GUID" -d "DOUBLE_ENCODED_SITE_URL"

# Add ContosoNews data source  
pac code add-data-source -a "shared_sharepointonline" -c "CONNECTOR_ID" -t "CONTOSO_NEWS_LIST_GUID" -d "DOUBLE_ENCODED_SITE_URL"

# Add ContosoQuickLinks data source
pac code add-data-source -a "shared_sharepointonline" -c "CONNECTOR_ID" -t "CONTOSO_QUICKLINKS_LIST_GUID" -d "DOUBLE_ENCODED_SITE_URL"

# Add ContosoTasks data source
pac code add-data-source -a "shared_sharepointonline" -c "CONNECTOR_ID" -t "CONTOSO_TASKS_LIST_GUID" -d "DOUBLE_ENCODED_SITE_URL"

# Add ContosoTrending data source
pac code add-data-source -a "shared_sharepointonline" -c "CONNECTOR_ID" -t "CONTOSO_TRENDING_LIST_GUID" -d "DOUBLE_ENCODED_SITE_URL"
```

**Example Command Structure:**
```bash
pac code add-data-source -a "shared_sharepointonline" -c "3ab365f7923143459d519f9b7bf20ae4" -t "517c3631-28b1-4826-9755-6d549615c4ad" -d "https%253A%252F%252Fcontoso.sharepoint.com%252Fsites%252FSharePoint-Dev"
```

**Parameter Explanation:**
- `-a "shared_sharepointonline"`: API name for SharePoint Online connector
- `-c "CONNECTOR_ID"`: SharePoint Online connector ID (user-specific)
- `-t "LIST_GUID"`: GUID of the SharePoint list (output from setup scripts)
- `-d "DOUBLE_ENCODED_SITE_URL"`: SharePoint site URL (double URL-encoded)

**Auto-Generated Files**: After running these commands, Power Platform CLI will create:
- `src/Models/ContosoEventsModel.ts` - TypeScript interfaces for Events
- `src/Services/ContosoEventsService.ts` - CRUD operations for Events
- `src/Models/ContosoHeroModel.ts` - TypeScript interfaces for Hero content
- `src/Services/ContosoHeroService.ts` - CRUD operations for Hero content
- `src/Models/ContosoNewsModel.ts` - TypeScript interfaces for News
- `src/Services/ContosoNewsService.ts` - CRUD operations for News
- `src/Models/ContosoNewsHubModel.ts` - TypeScript interfaces for NewsHub
- `src/Services/ContosoNewsHubService.ts` - CRUD operations for NewsHub
- `src/Models/ContosoQuickLinksModel.ts` - TypeScript interfaces for Quick Links
- `src/Services/ContosoQuickLinksService.ts` - CRUD operations for Quick Links
- `src/Models/ContosoTasksModel.ts` - TypeScript interfaces for Tasks
- `src/Services/ContosoTasksService.ts` - CRUD operations for Tasks
- `src/Models/ContosoTrendingModel.ts` - TypeScript interfaces for Trending
- `src/Services/ContosoTrendingService.ts` - CRUD operations for Trending



### **A6: Install Power SDK**
1) Install the Power SDK (from GitHub release)
```bash
npm install -D "@pa-client/power-code-sdk@https://github.com/microsoft/PowerAppsCodeApps/releases/download/v0.0.2/6-18-pa-client-power-code-sdk-0.0.1.tgz"
```
> Important: This SDK may not be available on npmjs.com; install from the GitHub release as shown.

### **A7: Configure Development Scripts**
1) Add Power Apps Code integration to `package.json`:
```json
{
  "scripts": {
    "dev": "vite && pac code run"
  }
}
```
> Note: This combines Vite development server with Power Apps Code runtime for full integration testing

### **A8: Setup PowerProvider**
1) Generate Complete UI via MCP + Copilot as Foundation

**CRITICAL: This is the foundation for MCP component extraction. The existing UI will be replaced with pixel-perfect Figma extractions.**

2) Add PowerProvider component
- Add a new file under the `src` folder named `PowerProvider.tsx` and grab the code from `assets/PowerProvider.tsx`
- Save the file.

3) Update `main.tsx` to include PowerProvider
- Add the following import under the existing imports:
```ts
import PowerProvider from './PowerProvider.tsx'
```
- Update the StrictMode wrapper from:
```tsx
<StrictMode>
  <App />
</StrictMode>
```
- To:
```tsx
<StrictMode>
  <PowerProvider>
    <App />
  </PowerProvider>
</StrictMode>
```

### **🚨 CRITICAL (Definition of Done)**
**Phase A incomplete until React 18.2.0 installed, Power Apps SDK configured, and PowerProvider working before proceeding to Phase B**

**⚠️ DO NOT PROCEED TO PHASE B UNTIL PHASE A IS FULLY COMPLETE**

---

## Phase B — Figma Extraction, Page Assembly & Routing

**Export Standard**: All React components must use `export default function ComponentName()` pattern.

> **Alternative**: If Figma MCP is not available, use [`docs/ui-component-reference.md`](ui-component-reference.md) for implementation specifications.

**🚨 CRITICAL**: Verify correct component before extraction. AppBar = vertical left navigation (48px width), SiteHeader = horizontal top bar (104px height). Double-check nodeId matches intended component purpose.

### Components — Mapping Rules

- CSS backgrounds: always use `url("<imageUrl>")` to handle spaces (e.g., Hero/News tiles).
- Image fields: use absolute SharePoint SiteAssets URLs (not local `/assets/...`).
- Spacing/typography: prefer Fluent v9 tokens to match Figma rhythm exactly.
- **🚨 CRITICAL THEME FIDELITY**: When calling `get_code` or `get_variable_defs`, ensure extracted theme colors, backgrounds, borders, and visual styling match the Figma design exactly as extracted - do not modify or approximate colors during implementation.

**🚨 CRITICAL: All required images are available in `../assets/images/` - use best judgment to map Figma content to existing images**

### **B1: SharePoint Layout Components**

#### B1.1: Suite Header Component
> **Figma Frame**: Suite Header (Microsoft 365 top navigation)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-32733&m=dev
> 2. Select the "Suite Header" frame
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-32733`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-32733` to extract:
   - Fluent Design System colors (suite header background, text colors)
   - Typography variables (app names, user info text)
   - Spacing variables (horizontal padding, vertical alignment)
   - Icon spacing and sizing tokens
3. **Map to Token System**: Update `figma-map.json` with extracted variables, focus on Fluent Design System compliance, suite header elevation, consistent spacing
4. **Build Component**: Generate `src/components/layout/SuiteHeader.tsx` using both extracted tokens and Figma code
5. **Apply Design System**: Map Figma elements to Fluent UI components with token-based styling
6. **Ensure Responsiveness**: Preserve responsive behavior and Fluent Design System consistency

**Additional Requirements:**
- Fixed height: 48px.
- Include waffle icon (GridDots) with `aria-label="App launcher"`.

#### B1.2: App Bar Navigation
> **Figma Frame**: App Bar (**VERIFY: should show vertical left navigation panel**)
> **Before extraction**: Confirm frame shows 48px wide left sidebar, not horizontal bar
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-32734&m=dev
> 2. Select the "App Bar" frame  
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-32734`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-32734` to extract:
   - Navigation background colors (app bar surface, hover states)
   - Icon colors and sizing (navigation icons, active states)
   - Spacing variables (icon padding, vertical gaps between nav items)
   - Border and divider tokens (separator lines, focus indicators)
3. **Map to Token System**: Update `figma-map.json` with extracted variables, focus on navigation interaction states, vertical layout consistency, icon alignment
4. **Build Component**: Generate `src/components/layout/AppBar.tsx` using both extracted tokens and Figma code
5. **Add Functionality**: Implement navigation state management with token-based styling
6. **Enable Routing**: Add routing integration with React Router

**Layout Rules:**
- Width: 48px; visually touches the SuiteHeader (also 48px tall).

#### B1.3: Site Header Component
> **Figma Frame**: Site Header (SharePoint site branding area)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-32736&m=dev
> 2. Select the "Site Header" frame
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-32736`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-32736` to extract:
   - Site design system colors (background, logo treatment, accent colors)
   - Typography variables (site title, navigation labels, breadcrumb text)
   - Spacing variables (logo margins, navigation spacing, header height)
   - Border radius and shadow tokens (header elevation, card treatments)
3. **Map to Token System**: Update `figma-map.json` with extracted variables, focus on SharePoint design system consistency, header hierarchy, responsive navigation
4. **Build Component**: Generate `src/components/layout/SiteHeader.tsx` using both extracted tokens and Figma code
5. **Add Branding**: Add SharePoint design system elements and navigation with token-based styling
6. **Enable Responsiveness**: Implement responsive site navigation

#### B1.4: Footer Component
> **Figma Frame**: Footer (SharePoint site footer with links and information)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-32757&m=dev
> 2. Select the "Footer" frame
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-32757`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-32757` to extract:
   - Footer background and text colors (footer surface, link colors, muted text)
   - Typography variables (footer links, copyright text, logo text)
   - Spacing variables (footer padding, link spacing, section gaps)
   - Border and divider tokens (footer separators, section borders)
3. **Map to Token System**: Update `figma-map.json` with extracted variables, focus on footer link hierarchy, responsive layout, design system consistency
4. **Build Component**: Generate `src/components/layout/Footer.tsx` using both extracted tokens and Figma code
5. **Add Navigation**: Add logo container and footer links with token-based styling
6. **Enable Responsiveness**: Apply responsive footer navigation

### **B1.5: Global Design Token Consolidation**

**After extracting tokens from all layout components:**

1. **Consolidate** all `get_variable_defs` results into master `src/design/figma-map.json`
2. **Create** `src/design/tokens.css` with CSS custom properties for unmapped tokens
3. **Update** FluentProvider theme configuration with custom token overrides
4. **Verify** token consistency across all extracted layout components

**Critical Token Categories:**
- **Typography**: Map to `@fluentui/tokens` typography scale
- **Colors**: Prefer semantic tokens (`colorNeutralBackground1`, etc.)
- **Spacing**: Use Fluent spacing tokens (`spacingVerticalS`, etc.)
- **Elevation**: Map to Fluent shadow tokens
- **Border Radius**: Use Fluent radius tokens (`borderRadiusMedium`, etc.)

**Token Mapping Example:**
```json
{
  "figma": {
    "color/surface/primary": "#ffffff",
    "spacing/stack/medium": "16px",
    "typography/body/medium": {
      "fontFamily": "Segoe UI",
      "fontSize": "14px",
      "fontWeight": "400"
    }
  },
  "fluent": {
    "color/surface/primary": "colorNeutralBackground1",
    "spacing/stack/medium": "spacingVerticalM", 
    "typography/body/medium": "body1"
  },
  "css": {
    "color/surface/primary": "--color-surface-primary",
    "spacing/stack/medium": "--spacing-stack-medium"
  }
}
```

### **🚨 DESIGN TOKEN VERIFICATION GATE**

**Before proceeding to content components (B2), verify:**

- [ ] `figma-map.json` exists with complete token mapping
- [ ] `tokens.css` created with unmapped custom properties  
- [ ] FluentProvider configured with theme overrides
- [ ] All layout components use consistent token references
- [ ] No hardcoded colors, spacing, or typography values remain in layout components
- [ ] Token usage documented for content component extraction

**Stop here if any tokens are missing or inconsistently applied**

### **B2: SharePoint Content Components**

#### B2.1: Hero Web Part
> **Figma Frame**: Hero Section (Large featured content area)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-33068&m=dev
> 2. Select the "Hero" frame
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-33068`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-33068` to extract:
   - Hero-specific colors (gradient overlays, text colors on images, CTAs)
   - Typography variables (hero titles, subtitle text, call-to-action labels)
   - Spacing variables (hero padding, tile gaps, content margins)
   - Shadow and elevation tokens (hero card shadows, hover effects)
3. **Inherit & Map Tokens**: Combine global layout tokens from B1.5 with Hero-specific mappings in `figma-map.json`, focus on content readability over images, gradient treatments, responsive scaling
4. **Build Component**: Generate `src/components/webparts/HeroWebPart.tsx` applying both global and Hero-specific tokens
5. **Handle Assets**: Copy image assets and update paths to use token-based styling
6. **Implement Layout**: Create tile-based layout with gradient overlays using design tokens

#### B2.2: News Web Part
> **Figma Frame**: News Web Part (News articles with images)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-46110&m=dev
> 2. Select the "News Web Part" frame
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-46110`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-46110` to extract:
   - News card colors (card backgrounds, border treatments, hover states)
   - Typography variables (news titles, metadata text, category badges)
   - Spacing variables (card padding, grid gaps, content margins)
   - Badge and category styling tokens (news category colors, badge radius)
3. **Inherit & Map Tokens**: Combine global layout tokens from B1.5 with News-specific mappings in `figma-map.json`, focus on card hierarchy, category differentiation, responsive grid behavior
4. **Build Component**: Generate `src/components/webparts/NewsWebPart.tsx` applying both global and News-specific tokens
5. **Implement Grid**: Create 2x2 grid layout with news articles using token-based styling
6. **Add Metadata**: Add news category badges and metadata with design token compliance

**Notes:**
- Use a row-level divider (`::after`) on each two-up row and a CSS grid for consistent column alignment.
- Include News Carousel variant with pagination dots when present in the Figma frame.

#### B2.3: NewsHub Web Part
> **Figma Frame**: NewsHub (Navigation tiles)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-46111&m=dev
> 2. Select the "NewsHub" frame
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-46111`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-46111` to extract:
   - NewsHub tile colors (tile backgrounds, image overlays, text treatments)
   - Typography variables (tile titles, sidebar headlines, navigation labels)
   - Spacing variables (tile gaps, sidebar padding, grid alignment)
   - Image treatment tokens (background sizing, overlay opacity, border radius)
3. **Inherit & Map Tokens**: Combine global layout tokens from B1.5 with NewsHub-specific mappings in `figma-map.json`, focus on grid consistency, sidebar-main content relationship, responsive behavior
4. **Build Component**: Generate `src/components/webparts/NewsHubWebPart.tsx` applying both global and NewsHub-specific tokens
5. **Implement Grid**: Create 3x2 grid layout with news cards using token-based styling
6. **Add Sidebar**: Add sidebar list with news headlines using design token compliance

**Notes:**
- Use token-based gaps; image backgrounds must use `backgroundImage: url("...")` quoting.

#### B2.4: Events Web Part
> **Figma Frame**: Events List (Upcoming events)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-46395&m=dev
> 2. Select the "Events Web Part" frame
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-46395`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-46395` to extract:
   - Event card colors (card backgrounds, date overlay colors, hover states)
   - Typography variables (event titles, date text, location/time details)
   - Spacing variables (filmstrip gaps, card padding, pagination spacing)
   - Date overlay styling tokens (prominent date background, text contrast)
3. **Inherit & Map Tokens**: Combine global layout tokens from B1.5 with Events-specific mappings in `figma-map.json`, focus on date prominence, horizontal scroll behavior, card uniformity
4. **Build Component**: Generate `src/components/webparts/EventsWebPart.tsx` applying both global and Events-specific tokens
5. **Implement Filmstrip**: Create horizontal filmstrip layout using token-based styling
6. **Add Date Overlays**: Add prominent date overlays and pagination dots with design token compliance

#### B2.5: Industry News Web Part (Synchronized with Quick Links)
> **Figma Frame**: Industry News Section (Companion to Quick Links carousel)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-32747&m=dev
> 2. Select the "Industry News" frame
> 3. Ensure frame is ACTIVE and SELECTED
> 
> **Reply 'READY' when frame is active**

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `1909-32747`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `1909-32747` to extract:
   - Industry news panel colors (panel background, carousel controls, active states)
   - Typography variables (industry news titles, quick links labels, navigation text)
   - Spacing variables (1/3 vs 2/3 layout gaps, carousel spacing, synchronized margins)
   - Carousel interaction tokens (navigation arrows, pagination dots, transition timing)
3. **Inherit & Map Tokens**: Combine global layout tokens from B1.5 with Industry News-specific mappings in `figma-map.json`, focus on synchronized component relationship, carousel UX, responsive breakpoint behavior
4. **Build Component**: Generate `src/components/webparts/IndustryNewsWebPart.tsx` applying both global and Industry News-specific tokens
5. **Implement Layout**: Create 1/3 + 2/3 column layout using token-based styling
6. **Add Carousel**: Add Quick Links carousel with navigation using design token compliance

**Layout Requirements:**
- Quick Links carousel: 2/3 width with navigation arrows and dots
- Industry News panel: 1/3 width, updates content based on active carousel slide
- Synchronized state management between both components
- Smooth transitions when carousel slide changes

#### B2.6: Task List Page Component
> **Figma Frame**: Task List View (Microsoft 365 UI Kit)
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/vB3o7GwSIFImzuD2UdJumK/Microsoft-365-UI-Kit--Community-?node-id=2123-317659&m=dev
> 2. Select the "Task List" frame
> 3. Ensure frame is ACTIVE and SELECTED

**Implementation Steps:**
1. **Generate Component**: Call `get_code` with nodeId `2123-317659`
2. **Extract Design Tokens**: Call `get_variable_defs` with nodeId `2123-317659` to extract:
   - Task list interface colors (list backgrounds, row hover states, selection colors)
   - Typography variables (task titles, metadata text, status labels, priority indicators)
   - Spacing variables (list row height, column spacing, action button margins)
   - Interactive element tokens (checkboxes, dropdown controls, sort indicators)
3. **Inherit & Map Tokens**: Combine global layout tokens from B1.5 with Task List-specific mappings in `figma-map.json`, focus on list interaction patterns, task status visualization, data table accessibility
4. **Build Page Component**: Generate `src/components/pages/TaskListPage/index.tsx` with full layout and token-based styling
3. **TaskListPage must maintain full layout**: SuiteHeader → AppBar → SiteHeader → TaskContent → Footer
4. **Navigation via AppBar only**: Update AppBar component to handle routing between HomePage and TaskListPage
5. **Trending cards include images**: Figma shows thumbnail images in trending project cards - extract and map these images
6. Create pixel-perfect task list interface using Fluent UI v9
7. Include task creation, editing, filtering, and status management
8. Implement responsive task list layout for all devices
9. Complete the toolbar experience with a Form using Fluent UI V9
10. Add search and filtering capabilities
11. Preserve complete Figma TaskListPage design
12. To know more about the styling of the list and toolbar component refer this figma frame URL - https://www.figma.com/design/vB3o7GwSIFImzuD2UdJumK/Microsoft-365-UI-Kit--Community-?node-id=2127-394105&m=dev


### **B3: Page Assembly**

#### B3.1: Layout Verification & Component Composition
> **Purpose**: Verify all extracted components align correctly when composed together
> 
> **Figma Reference Frame**: Communication Site Layout
> 
> **ONLY AFTER user confirms 'READY':**
> 1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1909-32732&m=dev
> 2. Use this frame as **reference for verification** (not extraction)
> 3. Ensure frame is ACTIVE for visual comparison
> 
> **Reply 'READY' when frame is active for verification**

**Verification Steps:**
1. **Generate** `src/components/layout/MainLayout.tsx` to compose all extracted components
2. **Compare** composed layout against Figma Communication site frame
3. **Verify** spacing, positioning, and responsive behavior matches exactly
4. **Validate** component hierarchy and z-index layering
5. **Check** that no components are missing or misaligned
6. **Critical** - Cross Check all the section padding around each webpart which should match the Figma Template
7. Verify two-column widths are 792px (2/3) and 380px (1/3) with token gutters; ensure the right column does not shrink.
8. Ensure row-level dividers span both columns (avoid per-item borders) for aligned separators.

#### B3.2: SharePoint Landing Page Assembly & Responsive Testing
**Purpose**: Create the final page composition, setup routing infrastructure, and validate pixel-perfect alignment across all devices

**🚨 CRITICAL: Figma-Driven Responsive Layout Implementation**

**Figma Frame**: Communication Site Responsive Layouts (Different form factors)

**ONLY AFTER user confirms 'READY':**
1. Navigate to: https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community-?node-id=1898-13019&m=dev
2. Select the "Communication Site Responsive Layouts" frame
3. Ensure frame is ACTIVE and SELECTED
4. Study how layout components (SuiteHeader, AppBar, SiteHeader, content areas) are rearranged across different screen sizes

**🚨 CRITICAL: Reply 'READY' when frame is active and you can see the different form factor layouts**

**Before completing responsive validation, implement form factor-specific layouts as specified in Figma:**

**Implementation Steps:**
1. **Analyze Figma Form Factors**: Study how layout components are rearranged across different screen sizes in the active Figma frame
2. **Component Layout Modifications**: 
   - **Desktop (1366px+)**: Maintain current vertical AppBar, full headers
   - **Tablet (834px)**: Adapt AppBar behavior as shown in the figma frame
   - **Mobile (375px)**: Transform to hamburger menu, horizontal bottom navigation, single column layouts. Should be exactly similar to the figma frame.
3. **Apply to Both Experiences**: 
   - **Landing Page (/)**: Update SharePointLanding component with responsive layout
   - **Task Experience (/tasks)**: Update TaskListPage component with identical responsive patterns
4. **Layout Component Rearrangement**: Modify SuiteHeader, AppBar, SiteHeader to adapt their positioning and behavior per form factor
5. **Content Area Adaptation**: Ensure all webparts (Hero, News, Events, etc.) respond appropriately to layout changes

**Responsive Implementation Checklist**:
- [ ] **Form factor-specific layouts**: Components rearrange exactly as specified in Figma nodeId `1898-13019`
- [ ] **AppBar adaptation**: Vertical → Icons only → Hamburger menu → Bottom navigation as screen size decreases
- [ ] **SuiteHeader behavior**: Maintain functionality while adapting to mobile constraints
- [ ] **Content flow**: Single column layouts on mobile, proper spacing adjustments
- [ ] **Both page experiences**: Landing page AND task experience have identical responsive behavior
- [ ] **Large monitors to small devices (280px-4K+)**: No horizontal scrolling, proper scaling
- [ ] **Touch & mouse support**: Interactive elements work on all device types
- [ ] **Typography & images scale**: Content readable and properly sized at any resolution

**🚨 CRITICAL: This responsive implementation must be completed for BOTH experiences:**
- **SharePoint Landing Page** (`/`) - All webparts adapt to form factor
- **Task List Page** (`/tasks`) - Task interface adapts to same responsive patterns

**Composition Rules:**
- Use a single internal scroll container that wraps main content + footer; footer is non-sticky.
- Render the SiteHeader on the Home route (`/`) only.

**Routing Setup Steps:**
1. **Install Router and TanStack Query**
   ```bash
   npm install react-router-dom @tanstack/react-query
   ```

2. **Update main.tsx with all providers**
   ```tsx
   // src/main.tsx
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import { HashRouter } from 'react-router-dom'
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
   import { FluentProvider, webLightTheme } from '@fluentui/react-components'
   import PowerProvider from './PowerProvider'
   import App from './App'
   import './index.css'

   const queryClient = new QueryClient({
     defaultOptions: { 
       queries: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false } 
     },
   });

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <PowerProvider>
         <FluentProvider theme={webLightTheme}>
           <QueryClientProvider client={queryClient}>
             <HashRouter>
               <App />
             </HashRouter>
           </QueryClientProvider>
         </FluentProvider>
       </PowerProvider>
     </React.StrictMode>
   )
   ```

3. **Create Router-Enabled App.tsx**
   ```tsx
   // src/App.tsx
   import { Routes, Route } from 'react-router-dom'
   import SharePointLanding from './components/pages/SharePointLanding'
   import TaskListPage from './components/pages/TaskListPage'

   export default function App() {
     return (
       <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
         <main>
           <Routes>
             <Route path="/" element={<SharePointLanding />} />
             <Route path="/tasks" element={<TaskListPage />} />
           </Routes>
         </main>
       </div>
     )
   }
   ```

**Page Assembly Steps:**
1. **Compose** all components in `src/components/pages/SharePointLanding/index.tsx`:
   ```tsx
   import SuiteHeader from '../../layout/SuiteHeader';
   import AppBar from '../../layout/AppBar';
   import SiteHeader from '../../layout/SiteHeader';
   import HeroWebPart from '../../webparts/HeroWebPart';
   import NewsWebPart from '../../webparts/NewsWebPart';
   import QuickLinksWebPart from '../../webparts/QuickLinksWebPart';
   import EventsWebPart from '../../webparts/EventsWebPart';
   import MainLayout from '../../layout/MainLayout';
   ```

2. **Verification Checklist**:
   - [ ] All components render without errors
   - [ ] Layout matches Figma Communication site frame exactly
   - [ ] Component spacing and alignment correct
   - [ ] No visual regressions from individual component extraction

3. **🚨 CRITICAL: Complete Responsive Design Validation**:
   **AFTER completing UI workflow (landing page + task experience), ensure complete responsiveness for ALL form factors:**
   
   - [ ] **Large monitors to small devices (280px-4K+)**: No horizontal scrolling, proper scaling
   - [ ] **All web parts responsive**: Components adapt fluidly to any screen size
   - [ ] **Navigation works everywhere**: AppBar collapses/expands correctly across breakpoints  
   - [ ] **Touch & mouse support**: Interactive elements work on all device types
   - [ ] **Typography & images scale**: Content readable and properly sized at any resolution

4. **Validation Checklist**:
   - Test using browser dev tools across ALL standard breakpoints
   - Verify 44px minimum touch targets on mobile devices  
   - Ensure keyboard navigation works on all screen sizes

**🚨 CRITICAL: Fix #root container height:100vh to min-height:100vh and verify scrolling works before proceeding**

5. **Final Page Validation**:
   - [ ] Complete page functionality verified before moving to Phase C
   - [ ] No console errors or accessibility warnings  
   - [ ] Performance acceptable across all device types

---

## Phase C — SharePoint Data Integration

### **C0: 🚨 SharePoint Connector Bug Workaround (EXECUTE FIRST)**
**CRITICAL**: Must complete before ANY SharePoint service calls
> **Note**: No user confirmation required - proceed step-by-step until completion.

**Reminder:** Apply a `fixPowerAppsResult` wrapper across all services until the connector returns `{ isSuccess, result }`.

### **C1: Task Management Integration**

**Implementation Steps:**
1. Wire up existing TaskListPage component (created in Phase B2.6) with ContosoTasks SharePoint list
2. Connect to ContosoTasks using generated service
3. Implement CRUD operations using existing TanStack Query setup
4. Add search and filtering capabilities
5. Test task creation, editing, and deletion flows
6. Verify task filtering and sorting functionality

**Dependencies:**
- TaskListPage component (completed in Phase B2.6)
- ContosoTasks SharePoint list (created by prereq scripts)
- TanStack Query setup (from Phase B1)

### **C2: News & Content Integration**

**Implementation Steps:**
1. Update `NewsWebPart.tsx` to use `ContosoNewsService`
2. Update `HeroWebPart.tsx` to use `ContosoHeroService` for featured content
3. Connect `IndustryNewsWebPart.tsx` to ContosoNews with "Industry News" category filter
4. Preserve complete Figma designs while replacing static data with live SharePoint data

### **C3: Navigation & Links Integration**

**Implementation Steps:**
1. Update `QuickLinksWebPart.tsx` to use `ContosoQuickLinksService`
2. Implement dynamic link configuration and icon mapping
3. Add click tracking and analytics
4. Maintain responsive carousel behavior from Figma design

### **C4: Events Integration**

**Implementation Steps:**
1. Update `EventsWebPart.tsx` to use `ContosoEventsService`
2. Add calendar integration and date-based filtering
3. Implement event registration capabilities
4. Filter for upcoming events only

### **C5: Trending Content Integration**

**Implementation Steps:**
1. Connect trending cards in TaskListPage to `ContosoTrendingService`
2. Replace static trending data with live SharePoint data
3. Add click analytics and view tracking
4. Implement dynamic trending algorithm based on usage

### **C6: Real-time Data & Caching Strategy**

**Implementation Steps:**
1. Add loading states, error handling, and retry mechanisms
2. Implement cache invalidation and refresh strategies
3. Add real-time data updates and notification system
4. Create fallback content for offline scenarios

### **C7: SharePoint Connector Bug Workaround**

**Known Issue**: The Power Apps SharePoint connector returns `{success, data}` but TypeScript interfaces expect `{isSuccess, result}`.

**Solution**: Reference the documentation at `docs/power-apps-sdk-bug-workaround.md` for the complete workaround implementation.

**Implementation Steps:**
1. Follow the bug workaround documentation for each SharePoint service call
2. Apply the workaround to all generated SharePoint service methods
3. Test data retrieval across all components (News, Hero, Events, QuickLinks, Tasks, Trending)
4. Verify proper error handling and loading states

### **🚨 Phase C (Definition of Done) Completion Criteria**
**Phase C incomplete until SharePoint setup runs and works with actual list data AND all task experience including forms to add or edit task list item end to end via Toolbar**

- All webparts/pages read from SharePoint with no mock/stub data remaining; images load from SiteAssets absolute URLs.
- No browser console error should persist. Build and Run the project to confirm.

---

## Phase D — QA & Fluent v9 Enforcement 

### **D1.5: Design Token Compliance Testing**

**Verify token implementation across all components:**

1. **Theme Toggle Test**: Switch between light/dark themes, verify all components adapt properly
2. **Token Coverage Test**: Ensure no hardcoded values remain in components  
3. **Fluent Compliance Test**: Verify preference for Fluent v9 tokens over custom CSS
4. **Responsive Token Test**: Check spacing/typography scales at different breakpoints
5. **Brand Consistency Test**: Verify Fluent Design System colors match Figma exactly
6. **Figma-Map Validation**: Confirm `src/design/figma-map.json` contains complete token mappings
7. **Custom CSS Audit**: Review `src/design/tokens.css` for unmapped tokens only

**Token Implementation Acceptance Criteria:**
- [ ] All components use token-based styling (no hardcoded colors, spacing, typography)
- [ ] Theme switching works without visual breaks or flashing
- [ ] Custom CSS variables only used when Fluent v9 tokens unavailable
- [ ] Token naming follows consistent convention across all components
- [ ] `figma-map.json` documents all extracted tokens with proper Fluent mappings
- [ ] Layout and content components share consistent token usage patterns
- [ ] Design system colors (Fluent Design System) preserved from Figma extraction

### **QA Checklist - To be checked and completed:**
- [ ] **Fluent UI v9 Compliance**: All imports using @fluentui/react-components v9, no v8 dependencies found
- [ ] **FluentProvider Wrapping**: App properly wrapped with FluentProvider and theme configuration  
- [ ] **Semantic HTML**: Enhanced MainLayout with proper semantic regions (header, nav, main, footer)
- [ ] **Sticky Headers**: Implemented position: sticky headers with proper z-index layering
- [ ] **Responsive Design**: Comprehensive breakpoint coverage (480px, 768px, 1024px+) with mobile-first approach
- [ ] **Design Token Usage**: Complete token compliance verified via D1.5 testing (Fluent UI tokens, figma-map.json, consistent theming)
- [ ] **Accessibility**: ARIA labels, keyboard navigation (onKeyDown), focus management, and proper roles
- [ ] **Code Quality**: TypeScript compilation clean, ESLint warnings addressed, unused imports removed
- [ ] **Cross-Browser Compatibility**: Modern React + TypeScript patterns ensuring broad browser support

### **Key QA Results to be achieved:**
- **TypeScript Check**: [ ] No compilation errors (`npx tsc --noEmit` passes)
- **Responsive Test**: [ ] ResponsiveTestComponent validates breakpoints (320px-1920px)
- **Accessibility Audit**: [ ] 48+ aria-label/role attributes, keyboard navigation on interactive elements
- **Token Coverage**: [ ] Complete token implementation with figma-map.json, custom CSS audit, and theme compliance (verified in D1.5)
- **Component Standards**: [ ] All webparts follow consistent patterns with loading states and error handling

### **🚨 CRITICAL (Definition of Done)**
**Phase D incomplete until all TypeScript errors resolved, responsive design validated, and accessibility compliance verified before deployment**

**⚠️ DO NOT PROCEED TO PHASE E UNTIL PHASE D IS FULLY COMPLETE**

---

## Phase E — Run & Deploy

### **E1: Final Local Testing** 
- [ ] Development server running on http://localhost:3000/
- [ ] All SharePoint integrations active (6/6 services)
- [ ] Responsive design validated across breakpoints
- [ ] TypeScript compilation clean
- [ ] ESLint errors resolved

### **E2: Production Build Validation**
- [ ] Production build completed successfully (`npm run build`)
- [ ] TypeScript compilation passes with no errors
- [ ] Vite build optimized and assets properly chunked
- [ ] Removed unused dependencies

### **E3: Power Platform Deployment**
- [ ] Power Platform CLI authenticated (pac auth list)
- [ ] Power Apps Code App configuration verified (power.config.json)
- [ ] SharePoint connection references intact (6 data sources)
- [ ] **DEPLOYMENT READY**: `pac code push` prepared

### **E4: Post-Deployment Validation**
- [ ] App deployed to target Power Platform environment
- [ ] SharePoint data sources connected and functional
- [ ] Fluent UI v9 components rendering correctly
- [ ] Responsive design working across devices
- [ ] All 6 webparts operational with live SharePoint data

### **🚨 CRITICAL (Definition of Done)**
**Phase E incomplete until production build successful, no console errors in deployed app, and all data sources functional before marking complete**

**⚠️ DO NOT MARK PROJECT COMPLETE UNTIL PHASE E IS FULLY VERIFIED**

---

---

## Execution Workflow & Quality Gates

### **Sequential Component Extraction:**
1. **Start with Layout**: SuiteHeader → AppBar → SiteHeader
2. **Add Content**: Hero → News → QuickLinks → Events  
3. **Compose Page**: MainLayout assembly
4. **Connect Data**: SharePoint integration
5. **Test & Validate**: Pixel-perfect comparison

### **Quality Gates:**
- [ ] Each component matches Figma design exactly
- [ ] Responsive behavior preserved
- [ ] Fluent UI design tokens used consistently
- [ ] Fluent UI v9 components used exclusively - refer to [Component Mapping Guide](https://react.fluentui.dev/?path=/docs/concepts-migration-from-v8-component-mapping--docs) for v8 → v9 equivalents
- [ ] TypeScript interfaces properly defined
- [ ] SharePoint data integration working
- [ ] Cross-browser compatibility verified
- [ ] No mock/stub data committed; all data comes from SharePoint services.

### **Component Extraction Benefits:**
✅ **Pixel Accuracy**: Each component matches Figma exactly  
✅ **Maintainability**: Components are isolated and reusable  
✅ **Scalability**: Easy to add new pages with existing components  
✅ **Design System Compliance**: Consistent Fluent UI usage  
✅ **Responsive Fidelity**: Preserves Figma's responsive behavior  
✅ **Type Safety**: Full TypeScript support for each component

---

## Known Issues & Workarounds

### **SharePoint Connector Bug**
**Issue**: Power Apps SharePoint connector returns `{success, data}` but TypeScript interfaces expect `{isSuccess, result}`.

**Solution**: Reference `docs/power-apps-sdk-bug-workaround.md` for complete implementation details.

**Affected Components**: All SharePoint integrations (NewsWebPart, HeroWebPart, EventsWebPart, QuickLinksWebPart, IndustryNewsCarousel, TaskListPage)

---

**⚠️ SECURITY NOTE**: Do not commit Connection ID, site URL, or list GUIDs to version control

---

## Critical Deployment Rules 🚨

**Scope Control**: Do not create additional files or deviate from project structure/implementation plan  
**Production**: Remove test components, validate scrolling, verify image loading  
**Layout**: AppBar vertical sidebar, content must scroll properly