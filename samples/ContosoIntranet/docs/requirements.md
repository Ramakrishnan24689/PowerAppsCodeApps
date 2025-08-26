# Requirements Document — Figma MCP + GitHub Copilot → Power Apps Code App

## 1. Project Overview
The goal is to build a pixel-perfect SharePoint intranet UI as a Power Apps Code App using:
- **Figma MCP** (Model Context Protocol) to extract complete components from a Figma design file.
- **GitHub Copilot** to assist in code generation and component assembly.
- **Fluent UI v9** for UI components and design token compliance.
- **Power Platform CLI** for integration and deployment.
- **SharePoint Online** lists as the backend data source.

The resulting application must match the Figma design exactly, be responsive, accessible, and production-ready.

## 2. Objectives
- Achieve pixel-accurate implementation of the SharePoint Web UI Kit (Community) Figma design.
- Maintain Fluent UI v9 compliance, accessibility, and responsiveness.
- Integrate SharePoint Online data sources for tasks, news, events, quick links, hero, trending, and newshub content.
- Deploy as a functional Power Apps Code App.

## 3. Functional Requirements

### 3.1 Environment & Setup
- SharePoint environment with predefined lists and sample data (7 lists: ContosoEvents, ContosoHero, ContosoNews, ContosoQuickLinks, ContosoNewsHub, ContosoTasks, ContosoTrending).
- Node.js LTS (18+), npm/pnpm, and Power Platform CLI installed and authenticated.
- Access to the Figma design file in Dev Mode with MCP server connection.

### 3.2 Project Scaffolding
- Create a Vite + React 18 + TypeScript project.
- Pin React and React DOM to v18.2.0.
- Install Fluent UI v9, Fluent UI icons, Power Platform CLI SDK, and related dependencies.
- Configure `vite.config.ts` for Power Apps hosting (base path, port, aliasing).
- Initialize Power Apps Code App with `pac code init`.
- Produce `/src/design/figma-map.json` mapping Figma variables (typography, color, spacing, radius, shadow) to Fluent v9 tokens; use CSS variable fallbacks when no Fluent token exists.

### 3.3 Component Extraction & UI Assembly
- Use MCP Dev Mode to extract full Figma components (DO NOT SIMPLIFY).
- Follow the “READY” confirmation pattern: request explicit user confirmation before each Figma extraction.
- Map extracted Figma components to Fluent UI v9 components while preserving design fidelity.
- Assemble layout: Suite Header, App Bar (48px), Site Header, Footer; non-sticky footer with a single internal scroll container.
- Assemble content web parts: Hero, News, News Hub, Events, Industry News + synchronized Quick Links carousel.
- Compose pages and routes: Home (`/`) and Task List page (`/tasks`).

### 3.4 Data Integration
- Add SharePoint data sources for all 7 lists using `pac code add-data-source`.
- Generate TypeScript models and services for CRUD operations.
- Connect components to live SharePoint data (Tasks, News, Hero, Quick Links, Events, Trending, NewsHub).
- Image policy: use absolute SharePoint SiteAssets URLs for all image fields; avoid local `/assets/...` paths.
- No mock/stub data in committed code; all data must come from SharePoint services.

### 3.5 Routing & State Management
- Use React Router v6 for page navigation.
- Implement TanStack Query for data fetching, caching, retries, and error states.
- Support navigation between Landing page and Task List page; synchronize Industry News panel with Quick Links carousel state.

### 3.6 Quality Assurance & Deployment
- Enforce Fluent UI v9 usage (map v8 → v9 components).
- Ensure accessibility compliance (ARIA, keyboard navigation, WCAG 2.1 AA contrast).
- Test responsive behavior across breakpoints.
- Type safety and code quality: TypeScript strict and ESLint clean.
- Deploy with `pac code push` to Power Apps environment.

## 4. Non-Functional Requirements
- **Performance**: Fast load times, efficient data fetching, lazy loading where applicable.
- **Scalability**: Modular components, reusable layouts.
- **Maintainability**: Clear file structure, TypeScript strict mode.
- **Reliability**: Retry logic for SharePoint throttling; provide loading/error UI states instead of stub data.

## 5. Constraints
- Must use complete Figma components — no simplified placeholders.
- Must maintain Microsoft branding as per Figma design.
- Requires a Power Apps environment with Code Apps enabled.
- SharePoint connector ID, List GUIDs, and double-encoded site URLs must be provided.
- Apply the connector result wrapper until the SDK returns `{ isSuccess, result }` (see `docs/power-apps-sdk-bug-workaround.md` and `src/utils/powerAppsResultFix.ts`).
- Do not commit Connector IDs, site URLs, or List GUIDs to version control.

## 6. Deliverables
- Fully functional Power Apps Code App with pixel-perfect UI from Figma.
- Source code in Vite + React 18 + TypeScript.
- Generated TypeScript models and services for all SharePoint lists.
- Deployment-ready package via Power Platform CLI.

## 7. Acceptance Criteria
- Visual match to Figma design across breakpoints.
- All data-driven components fetch and render live SharePoint data from all 7 lists.
- Fluent UI v9 compliance verified.
- Accessibility and responsiveness meet specified standards.
- No browser console errors; TypeScript and ESLint checks pass.
- Successful deployment to Power Apps environment.
