# 🚀 SharePoint Setup for Contoso Intranet

## Overview
PowerShell script to create SharePoint lists and sample data for the Power Apps Code application.

## Quick Start
```powershell
.\setup-sharepoint-environment.ps1 -SharePointSiteUrl "https://yourtenant.sharepoint.com/sites/contoso-intranet"
```

## Authentication
- The script defaults to SharePoint web login: it will open a browser window and prompt you to sign in.
- If you prefer another method, run the appropriate Connect command manually beforehand or modify the script locally:
	- UseWebLogin (default): `Connect-PnPOnline -Url <site> -UseWebLogin`
	- Interactive: `Connect-PnPOnline -Url <site> -Interactive`
	- Device code: `Connect-PnPOnline -Url <site> -DeviceLogin`
  
Note: Some organizations require admin consent for the PnP Management Shell app when using Interactive/DeviceLogin.

## Requirements
- **PowerShell 5.1+** (Windows) or **PowerShell 7+** (cross-platform)
- **SharePoint Online** with list creation permissions

## What Gets Created
- **7 SharePoint lists**: ContosoEvents, ContosoHero, ContosoNews, ContosoQuickLinks, ContosoNewsHub, ContosoTasks, ContosoTrending
- **34 sample items** total (Events:4, Hero:5, News:4, QuickLinks:3, NewsHub:12, Tasks:6, Trending:6)
- **Custom columns** for each list (including ImageUrl where applicable)
- **Images** uploaded to SiteAssets/IntranetImages with absolute URLs stored in lists

## Cross-Platform Usage
```bash
# Install PowerShell 7+ if needed
# macOS: brew install --cask powershell
# Linux: Use package manager

# Run script
pwsh -File setup-sharepoint-environment.ps1 -SharePointSiteUrl "YOUR_URL"
```

## Next Steps
After SharePoint setup:
```powershell
cd ../ContosoIntranet
pnpm install
# Add data sources (see docs/implementation-plan.md → Phase A5), then:
pnpm dev
```

## Troubleshooting
- **Module issues**: `Install-Module PnP.PowerShell -Force -Scope CurrentUser`
- **Permissions**: Ensure Site Owner/Member access
- **No data appears**: Check browser console/network for SharePoint service errors and confirm list items exist
