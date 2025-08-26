# Copilot Project Instructions: Figma MCP → React + Fluent 2

## Objective

Convert the **SharePoint Web UI Kit (Community)** Figma file into a static React application that is:

- Pixel-accurate to the referenced frames
- Implemented with **Fluent UI React v9** and Fluent 2 design tokens
- Accessible, responsive, and themable
- Cleanly organized and production-ready

**Source file:**\
[SharePoint Web UI Kit (Community)](https://www.figma.com/design/6tBIVlUQ7HCxMlHQb6rv62/SharePoint-Web-UI-Kit--Community)\
All UI must be generated from MCP context in Copilot, not from static exports.

---

## Inputs and Context

1. Use the **Figma Dev Mode MCP server** to read:
   - Frames, components, variants
   - Typography, color, spacing, radius, shadow tokens
   - Constraints, Auto Layout, grids
2. Treat the following frames as initial pages. If alternative frame names exist, discover them and list them before generating code:
   - SharePoint Landing (Home)
   - Task List (/tasks)
   - News
   - Documents
   - People
   - Search Results

---

## Tech Stack and Project Scaffold

Create a new repository with:

- **React 18 + TypeScript** using **Vite**
- **Fluent UI React v9**: `@fluentui/react-components`
- **Fluent tokens**: `@fluentui/tokens`
- **React Router v6**
- Styling: **Fluent v9 styles** (Griffel) and minimal CSS variables for layout when needed
- Tooling: ESLint, Prettier, TypeScript strict
- Tests: Vitest + Testing Library
- Optional visual check: Playwright screenshot test scaffold

---

## Power Apps Code App Fundamentals

### **Core Requirements**
- **React Version**: Pin to React 18.2.0 (Power Apps Code SDK requirement)
- **Port Requirement**: Development server must run on port 3000
- **Dev Script**: Update package.json: `"dev": "start vite && start pac code run"` (runs both Vite and Power Platform runtime)
- **PowerProvider**: Always wrap app with PowerProvider component
- **Power Platform CLI**: Initialize with `pac code init` for Code App packaging
- **Build Process**: Combines Vite + Power Platform runtime

### **Component Standards**
- **Export Pattern**: All React components must use `export default function ComponentName()` pattern
- **SharePoint Connector Workaround**: Apply `fixPowerAppsResult` wrapper before any SharePoint service usage

---

## Figma Integration Workflow

### **Figma MCP Extraction Process**
**Before using any `get_code` tools:**
1. **INFORM the user** which specific Figma frame/component will be used
2. **ASK the user to confirm** the exact frame is active in Figma Desktop  
3. **WAIT for user confirmation** before proceeding with MCP tool calls
4. **ONLY THEN** call the `get_code` tool

### **Design Token Fidelity**
- **🚨 CRITICAL THEME FIDELITY**: Extract and use Figma colors, backgrounds, borders exactly as provided - do not modify during implementation.
- **Fluent UI v9 Preference**: Imports should come from `@fluentui/react-components` when possible

---

## Development Best Practices

### **Sequential Development Process**
- **Phase Advancement**: Advance through phases end-to-end automatically and sequentially
- **Verification Gates**: Pause only when explicit user confirmation is required (e.g., Figma "READY" gates)
- **Definition of Done**: After each phase, run completion checklist. If phase fails checks, stop and report before continuing
- **Directory Context**: Always locate correct directory before commands to avoid confusion

### **Quality Standards**
- **TypeScript**: No compilation errors (`npx tsc --noEmit` must pass)
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels and keyboard navigation
- **Responsive Design**: Test across all breakpoints (320px-4K+) with no horizontal scrolling
- **Design Token Usage**: All components use token-based styling, no hardcoded colors/spacing

---

## General Behavior

- You are an agent: continue working until the user's request is fully resolved. 
  Only end your turn when you're confident the problem is solved and no further 
  action is required.

- Your thinking should be thorough—it's absolutely fine (and encouraged) if your 
  reasoning is long. Think step by step before and after each action you take.

- Plan extensively before making any function calls. Reflect critically after 
  each one. Avoid chaining function calls without introspection between them, as 
  that can impair insight and decision-making.

- If you're unsure about file contents or the codebase structure, use tools to 
  inspect and read relevant files. Never guess or make assumptions.

- Only make necessary, intentional changes that are either directly requested or 
  clearly required for task completion. Avoid editing unrelated or unclear areas.

## Code Quality and Style

- Prefer simple solutions that are easy to understand and maintain.

- Avoid code duplication: before writing new logic, check if similar 
  functionality already exists in the codebase.

- Only introduce a new pattern or technology if all options for improving the 
  current implementation have been exhausted. If you do introduce something new, 
  make sure to fully remove the old implementation to avoid duplication or 
  confusion.

- Keep the codebase clean and organized. Use consistent patterns and naming 
  conventions where applicable.

- Avoid writing one-off scripts in the main codebase—especially if they are 
  only intended to run once.

- Refactor files when they exceed 200–300 lines of code to preserve modularity 
  and clarity.

- Never overwrite the .env file without asking for and receiving explicit 
  confirmation.

- Follow best practices around formatting and consistency. Use linters, 
  formatters, and style guides where appropriate.

## Theming and Tokens

- Wrap the app with a **FluentProvider** using `webLightTheme` by default and support `webDarkTheme` with a toggle.
- Read Figma tokens via MCP. For each Figma variable, map to an exact Fluent token if available; if none exist, document the Figma value in `figma-map.json` and apply it via custom CSS variables.

---

## Mapping Rules

1. Typography: Map Figma text styles to Fluent tokens.
2. Color: Prefer Fluent semantic tokens; if unavailable, record custom values.
3. Spacing: Preserve Figma spacing, map to Fluent tokens when possible.
4. Radius/Shadows: Use Fluent equivalents.
5. Components: Replace primitives with Fluent components.
6. Layout: Match constraints and breakpoints exactly.
7. Icons: Use only if present in Figma, from Fluent UI icon set.

---

## Accessibility

- Ensure all interactive controls have visible labels or accessible names.
- Use correct landmarks and keyboard navigation.
- Meet WCAG 2.1 AA contrast.

---

## Routing

- Implement routes **"/" → SharePointLanding** and **"/tasks" → TaskListPage**.
- Optionally add additional routes that map to other approved frames once the primary two are complete.

---

## Responsiveness

- Match Figma constraints across standard breakpoints.

---

## Code Generation Steps

1. **Ensure MCP connection** is active and Figma file is loaded.
2. Discover design scope, propose route map, and generate `figma-map.json`.
3. Scaffold app with FluentProvider, theme toggle, and base layout.
4. Generate layout and page components from MCP context.
5. Wire up routes for "/" and "/tasks".
6. **Pixel Pass**: Run pixel pass across breakpoints (1440, 1280, 1024, 768, 375px), provide screenshots, and list discrepancies before fixing.
7. Ensure lint, type checks, and basic tests pass.

---

## Acceptance Criteria

- Visual fidelity with Figma across all breakpoints verified through Pixel Pass screenshots.
- Strict Fluent v9 compliance with no legacy v8 imports.
- Accessibility compliance (WCAG 2.1 AA) including keyboard navigation, labels, and contrast.
- Responsive layouts matching Figma constraints.
- Routing implemented for "/" → SharePointLanding and "/tasks" → TaskListPage.
- All console errors resolved; lint, type checks, and tests must pass.
- All code outputs provided as full file blocks with file paths in comments above each block.

---

## Global Definition of Done (DoD)

- **C0 workaround**: SharePoint connector result wrapper applied before any SharePoint service usage.
- **Fluent UI v9 only**: Imports must come from `@fluentui/react-components`; no v8 usage.
- **Routing**: At minimum, routes for `/` and `/tasks` exist and render expected layouts.
- **Image policy**: Images must come from SharePoint SiteAssets absolute URLs, not local `/assets`.
- **No mock data**: Ensure production data wiring is in place before marking a phase complete.

---

## Execution Guardrails (Merged)

- **Phase Advancement**: Advance through all phases end-to-end automatically and Sequentially. Pause **only** when a Figma “READY” gate is required; ask for READY and wait.
- **Figma Fallback**: Only if Figma MCP is unavailable, use `docs/ui-component-reference.md` as the spec and continue. Otherwise, do not refer to that document.
- **SharePoint Workaround**: Apply the C0 SharePoint connector workaround (see `power-apps-sdk-bug-workaround.md`) **before** any SharePoint calls.
- **Component Rules**: Use Fluent UI v9 only (`@fluentui/react-components`). All generated components must use `export default function ComponentName()`.
- **DoD Checks**: After each phase, run its checklist. If a phase fails checks, stop and report before continuing.

---

## Foundational Copilot Instructions

- **Read-first rule**: If `implementation-plan.md` exists, read it fully and follow it. If anything conflicts, ask once; otherwise follow the plan.
- **No guessing or assumptions**: Never guess IDs, node paths, or missing values. If unknown, list likely candidates and required formats, then pause for confirmation.
- **Minimal, surgical edits**: Only modify files listed in the plan or closely related ones. Show diffs before large refactors.
- **Deterministic setup**: Pin dependency versions, update the lockfile, and run formatter and type-checker after code generation.
- **Idempotent scripts**: Add or update npm/pnpm scripts so steps can be rerun exactly.
- **Proof of fidelity**: After UI generation, provide side-by-side screenshots and a discrepancy list for each breakpoint before marking as done.
- **Error recovery**: Retry failed MCP/Figma queries once; if still failing, output the exact error message and suggest manual alternatives.
- **Fail loud, early**: Do not continue with placeholders if a critical step fails.
- **Summary Files not needed**: Do not generate summary files.

### Common Issues and Troubleshooting

- **Port 3000 Required**: Power Apps Code Apps require port 3000
- **PowerProvider Issues**: Ensure PowerProvider.tsx is properly configured
- **Build Errors**: Run `npm run build` before deploying
- **Authentication**: Use same browser profile as Power Platform tenant