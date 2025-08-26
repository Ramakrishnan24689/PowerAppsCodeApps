# SharePoint Web UI Kit → Power Apps Code App (React + Fluent 2)

A **Power Apps Code Application** built with **React 18 + Fluent UI v9**, featuring UI generated from the SharePoint Web UI Kit (Community) in Figma via **Figma Dev Mode MCP Server** and **GitHub Copilot**.

## 📌 Overview

This project demonstrates:
- **Figma-to-Code workflow** using Figma MCP server and GitHub Copilot
- **Pixel-perfect React components** from Figma frames
- **Fluent 2 design tokens** mapped from Figma variables
- **Live SharePoint integration** with Power Apps Code

## 🤖 GitHub Copilot Starter Prompt

**Copy and paste this prompt into GitHub Copilot Chat to get started:**

```
Understand the requirements.md and build PowerApps Code Apps by following implementation-plan.md step-by-step (Prerequisites → Phases A–E) without skipping; stop at verification gates if incomplete; only ask for "READY" where required (e.g., Figma frames); ensure compliance with requirements.md (pixel-perfect UI, Fluent v9, accessibility, SharePoint data, deployment).
```

This prompt will guide Copilot through the complete development workflow following the project's established patterns and phase-based approach.

## 🚀 Features

- ✅ **Pixel-perfect UI** from SharePoint Web UI Kit
- ✅ **Fluent UI v9** components and design system
- ✅ **Responsive design** with Figma-matched breakpoints
- ✅ **Accessible** (WCAG 2.1 AA)
- ✅ **Live SharePoint data** (no mock/stub data committed)
- ✅ **Power Apps Code ready** with hash routing

## 🗂 Project Structure

```
├── ContosoIntranet/          # React application
│   ├── src/
│   │   ├── components/       # Generated from Figma + custom
│   │   ├── utils/           # SharePoint bug workarounds
│   │   ├── Models/          # Auto-generated SharePoint types
│   │   └── Services/        # Auto-generated SharePoint services
├── prereq-scripts/          # SharePoint setup scripts
├── docs/                    # Implementation guides
└── assets/                  # Images and resources
```

---

## 🔧 Prerequisites

- **Node.js 18+** and npm/pnpm/yarn
- **PowerShell 5.1+** (Windows) or **PowerShell 7+** (cross-platform)
- **Power Platform CLI** (`pac`) installed
- **SharePoint Online** with list creation permissions
- **VS Code** with GitHub Copilot Chat extension
- **Figma Desktop App** with Dev Mode MCP Server access

## ⚙️ Quick Start

### 1. Setup SharePoint Environment
```powershell
cd prereq-scripts
.\setup-sharepoint-environment.ps1 -SharePointSiteUrl "https://yourtenant.sharepoint.com/sites/contoso-intranet"
```

### 2. Install Dependencies
```powershell
cd ContosoIntranet
pnpm install
```

### 3. Deploy to Power Apps
```powershell
pac code push
```

### 4. Test Locally (Optional)
```powershell
pnpm dev
```

## 📋 SharePoint Integration

This app connects to **7 SharePoint lists** with live data:
- **ContosoTasks** (6 items) - Task management
- **ContosoNews** (4 items) - News articles  
- **ContosoHero** (5 items) - Hero banners
- **ContosoQuickLinks** (3 items) - Quick access links
- **ContosoEvents** (4 items) - Company events
- **ContosoTrending** (6 items) - Trending content
- **ContosoNewsHub** (12 items) - News navigation/tiles

### SharePoint Connector Bug Workaround
The app includes a fix for the Power Apps SharePoint connector interface mismatch. See `ContosoIntranet/src/utils/powerAppsResultFix.ts` and `docs/power-apps-sdk-bug-workaround.md`.

## 🖥 Figma MCP Workflow

1. **Connect to Figma MCP Server** in VS Code Copilot Chat
2. **Generate components** from SharePoint Web UI Kit frames
3. **Map Figma tokens** to Fluent 2 design system
4. **Perform pixel-perfect validation** across breakpoints

See `docs/development-guide.md` for detailed step-by-step implementation.

## 🧪 Development

```powershell
# Local development
cd ContosoIntranet
pnpm dev

# Build for production  
pnpm build

# Deploy updates
pac code push
```

## 🔧 Troubleshooting

- **SharePoint setup issues**: Check `prereq-scripts/README.md`
- **No data appears**: Verify SharePoint lists exist and contain items; check browser console/network for SharePoint service errors
- **Power Apps deployment fails**: Ensure `pac` CLI is authenticated (`pac auth list`)

## 🔐 Security
Do not commit Connector ID, site URL, or list GUIDs to version control.

## 📜 License
MIT
