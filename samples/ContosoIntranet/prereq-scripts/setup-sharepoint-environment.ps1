# SharePoint Environment Setup Script - Fixed Version
# Creates SharePoint lists and sample data for Contoso Intranet Power Apps Code App

param(
    [Parameter(Mandatory=$true)]
    [string]$SharePointSiteUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$TaskListName = "ContosoTasks",
    
    [Parameter(Mandatory=$false)]
    [string]$NewsListName = "ContosoNews",
    
    [Parameter(Mandatory=$false)]
    [string]$HeroListName = "ContosoHero",
    
    [Parameter(Mandatory=$false)]
    [string]$QuickLinksListName = "ContosoQuickLinks",
    
    [Parameter(Mandatory=$false)]
    [string]$NewsHubListName = "ContosoNewsHub",
    
    [Parameter(Mandatory=$false)]
    [string]$EventsListName = "ContosoEvents",
    
    [Parameter(Mandatory=$false)]
    [string]$TrendingListName = "ContosoTrending"
)

Write-Host "SharePoint Environment Setup for Contoso Intranet" -ForegroundColor Green
Write-Host "Site URL: $SharePointSiteUrl" -ForegroundColor Cyan
Write-Host "Task List: $TaskListName" -ForegroundColor Cyan  
Write-Host "News List: $NewsListName" -ForegroundColor Cyan
Write-Host "Hero List: $HeroListName" -ForegroundColor Cyan
Write-Host "Quick Links List: $QuickLinksListName" -ForegroundColor Cyan
Write-Host "NewsHub List: $NewsHubListName" -ForegroundColor Cyan
Write-Host "Events List: $EventsListName" -ForegroundColor Cyan
Write-Host "Trending List: $TrendingListName" -ForegroundColor Cyan

try {
    # Install PnP.PowerShell if not available
    Write-Host "`nChecking PowerShell modules..." -ForegroundColor Yellow
    if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
        Write-Host "Installing PnP.PowerShell module..." -ForegroundColor Yellow
        Install-Module -Name PnP.PowerShell -Force -AllowClobber -Scope CurrentUser
        Write-Host "PnP.PowerShell installed" -ForegroundColor Green
    } else {
        Write-Host "PnP.PowerShell module is available" -ForegroundColor Green
    }

    # Connect to SharePoint with flexible auth
    Write-Host "`nConnecting to SharePoint..." -ForegroundColor Yellow
    try {
        # Compute server-relative site path early for later use
        $siteUri = [System.Uri]$SharePointSiteUrl
        $serverRelativeSitePath = $siteUri.AbsolutePath.TrimEnd('/')
        if ([string]::IsNullOrWhiteSpace($serverRelativeSitePath)) { $serverRelativeSitePath = "/" }

        # Use Web Login (opens browser prompt). This was previously working reliably.
        Connect-PnPOnline -Url $SharePointSiteUrl -UseWebLogin -ErrorAction Stop
        Write-Host "Connected to SharePoint successfully" -ForegroundColor Green
    } catch {
        throw "Failed to authenticate to SharePoint: $($_.Exception.Message)"
    }
    
    
    # Get current user for assignments (robust)
    $web = Get-PnPWeb -Includes CurrentUser
    $currentUser = $web.CurrentUser
    $currentUserLogin = $null
    $currentUserEmail = $null
    if ($null -ne $currentUser) {
        $currentUserLogin = $currentUser.LoginName
        $currentUserEmail = $currentUser.Email
    }
    Write-Host "Current user: $currentUserLogin" -ForegroundColor Cyan

    # Upload images to Site Assets
    Write-Host "`nUploading images to Site Assets..." -ForegroundColor Yellow
    try {
        # Detect Site Assets library (prefer web-relative identity; fallback to server-relative)
        $siteAssets = Get-PnPList -Identity "SiteAssets" -ErrorAction SilentlyContinue
        if (-not $siteAssets) {
            $siteAssets = Get-PnPList -Identity "$serverRelativeSitePath/SiteAssets" -ErrorAction SilentlyContinue
        }
        if ($siteAssets) {
            Write-Host "Site Assets library found at: $($siteAssets.RootFolder.ServerRelativeUrl)" -ForegroundColor Green
        } else {
            Write-Host "Site Assets library not returned by API; proceeding (will attempt folder/file ops under 'SiteAssets')." -ForegroundColor Yellow
            # Do NOT create a new library named 'Site Assets' without URL; that would create '/Site%20Assets'.
            # If creation is ever needed, use: New-PnPList -Title 'Site Assets' -Url 'SiteAssets' -Template DocumentLibrary
        }

        # Check if IntranetImages folder already exists
        $folderExists = $false
        try {
            Get-PnPFolder -Url "SiteAssets/IntranetImages" | Out-Null
            $folderExists = $true
            Write-Host "IntranetImages folder already exists" -ForegroundColor Yellow
        } catch {
            Write-Host "IntranetImages folder does not exist, creating it..." -ForegroundColor Yellow
        }

    # Create IntranetImages folder in Site Assets if it doesn't exist
        if (-not $folderExists) {
            try {
                Add-PnPFolder -Name "IntranetImages" -Folder "SiteAssets"
                Write-Host "Created IntranetImages folder in Site Assets" -ForegroundColor Green
            } catch {
                Write-Host "Failed to create IntranetImages folder: $($_.Exception.Message)" -ForegroundColor Red
                Write-Host "Trying alternative approach..." -ForegroundColor Yellow
                try {
                    # Alternative approach using New-PnPFolder
                    $web = Get-PnPWeb
                    $folder = $web.GetFolderByServerRelativeUrl("$serverRelativeSitePath/SiteAssets")
                    $newFolder = $folder.Folders.Add("IntranetImages")
                    Invoke-PnPQuery
                    Write-Host "Created IntranetImages folder using alternative method" -ForegroundColor Green
                } catch {
                    Write-Host "Alternative folder creation also failed: $($_.Exception.Message)" -ForegroundColor Red
                    throw "Cannot create IntranetImages folder"
                }
            }
        }

        # Define images to upload from assets folder
        $imagesPath = Join-Path $PSScriptRoot "../assets/images"
        $images = @(
            "App Designed for Collaboration.png",
            "Building a responsible ecosystem.jpg",
            "Classroom collaboration.png", 
            "Collaboration Journey.png",
            "Communicating Product Value.jpg",
            "Get Involved - make a difference.jpg",
            "New Chief Marketing Office.jpg",
            "One million drones sold.jpg",
            "Open Door Policy.jpg",
            "President;s Keynote.jpg",
            "Singapore Building Update.jpg",
            "Student mentorship opportunity.jpg",
            "Why Story Telling Matters.png"
        )

        # Upload each image to Site Assets/IntranetImages
        $uploadedCount = 0
        foreach ($image in $images) {
            $sourcePath = Join-Path $imagesPath $image
            if (Test-Path $sourcePath) {
                try {
                    # Check if file already exists (URL-encode filename for -Url)
                    $encodedImage = [System.Uri]::EscapeDataString($image)
                    $existingFile = Get-PnPFile -Url "SiteAssets/IntranetImages/$encodedImage" -ErrorAction SilentlyContinue
                    if ($existingFile) {
                        Write-Host "Already exists: $image" -ForegroundColor Yellow
                        $uploadedCount++
                    } else {
                        Add-PnPFile -Path $sourcePath -Folder "SiteAssets/IntranetImages"
                        Write-Host "Uploaded: $image" -ForegroundColor Green
                        $uploadedCount++
                    }
                } catch {
                    Write-Host "Failed to upload: $image - $($_.Exception.Message)" -ForegroundColor Red
                }
            } else {
                Write-Host "Image not found: $sourcePath" -ForegroundColor Red
            }
        }
        Write-Host "Uploaded $uploadedCount images to SiteAssets/IntranetImages" -ForegroundColor Green
    } catch {
        Write-Host "Error uploading images: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Continuing with list creation..." -ForegroundColor Yellow
    }

    # Create Task List
    Write-Host "`nCreating Task List: $TaskListName" -ForegroundColor Yellow
    $taskList = Get-PnPList -Identity $TaskListName -ErrorAction SilentlyContinue
    if (-not $taskList) {
        $taskList = New-PnPList -Title $TaskListName -Template GenericList
        Write-Host "Created Task List: $TaskListName" -ForegroundColor Green
        
        # Add custom columns
        Add-PnPField -List $TaskListName -DisplayName "Status" -InternalName "Status" -Type Choice -Choices @("Not Started", "In Progress", "Completed", "Deferred") -ErrorAction SilentlyContinue
        Add-PnPField -List $TaskListName -DisplayName "Priority" -InternalName "Priority" -Type Choice -Choices @("Low", "Normal", "High", "Critical") -ErrorAction SilentlyContinue
        Add-PnPField -List $TaskListName -DisplayName "DueDate" -InternalName "DueDate" -Type DateTime -ErrorAction SilentlyContinue
        Add-PnPField -List $TaskListName -DisplayName "AssignedTo" -InternalName "AssignedTo" -Type User -ErrorAction SilentlyContinue
        Add-PnPField -List $TaskListName -DisplayName "Description" -InternalName "Description" -Type Note -ErrorAction SilentlyContinue
        Write-Host "Added custom columns to Task List" -ForegroundColor Green
        
        # Add sample data (AssignedTo will be set to current user programmatically)
        $taskItems = @(
            @{ Title = "Meeting notes"; Status = "In Progress"; Priority = "High"; Description = "Review quarterly reports and prepare summary" },
            @{ Title = "Vision doc"; Status = "Not Started"; Priority = "Normal"; Description = "Update timeline for the upcoming product launch" },
            @{ Title = "Thursday presentation"; Status = "Completed"; Priority = "Normal"; Description = "Schedule and organize the monthly team meeting" },
            @{ Title = "Upcoming plans"; Status = "In Progress"; Priority = "High"; Description = "Prepare presentation for the board meeting" },
            @{ Title = "New data results"; Status = "Not Started"; Priority = "Low"; Description = "Update project documentation and user guides" },
            @{ Title = "Culture conversation"; Status = "In Progress"; Priority = "High"; Description = "Review pull requests and provide feedback" }
        )

        foreach ($item in $taskItems) {
            # Build values and set AssignedTo to current user if available
            $values = @{ Title = $item.Title; Status = $item.Status; Priority = $item.Priority; Description = $item.Description }
            if ($currentUserLogin) {
                try { $values['AssignedTo'] = (Ensure-PnPUser -LoginName $currentUserLogin -ErrorAction Stop).LoginName } catch { $values['AssignedTo'] = $currentUserLogin }
            }

            try { Add-PnPListItem -List $TaskListName -Values $values | Out-Null } catch { Write-Host "Failed to add task item (kept AssignedTo): $($_.Exception.Message)" -ForegroundColor Yellow }
        }
        Write-Host "Added 6 sample items to Task List" -ForegroundColor Green
    } else {
        Write-Host "Task List already exists: $TaskListName" -ForegroundColor Yellow
        # If the list exists but has no items, seed sample items now (with safe user resolution)
        try {
            $existingTaskItems = Get-PnPListItem -List $TaskListName -PageSize 1 -ErrorAction SilentlyContinue
            if (-not $existingTaskItems) {
                Write-Host "Seeding sample items into existing Task List" -ForegroundColor Yellow
                $taskItems = @(
                    @{ Title = "Meeting notes"; Status = "In Progress"; Priority = "High"; Description = "Review quarterly reports and prepare summary" },
                    @{ Title = "Vision doc"; Status = "Not Started"; Priority = "Normal"; Description = "Update timeline for the upcoming product launch" },
                    @{ Title = "Thursday presentation"; Status = "Completed"; Priority = "Normal"; Description = "Schedule and organize the monthly team meeting" },
                    @{ Title = "Upcoming plans"; Status = "In Progress"; Priority = "High"; Description = "Prepare presentation for the board meeting" },
                    @{ Title = "New data results"; Status = "Not Started"; Priority = "Low"; Description = "Update project documentation and user guides" },
                    @{ Title = "Culture conversation"; Status = "In Progress"; Priority = "High"; Description = "Review pull requests and provide feedback" }
                )
                foreach ($item in $taskItems) {
                    $values = @{ Title = $item.Title; Status = $item.Status; Priority = $item.Priority; Description = $item.Description }
                    if ($currentUserLogin) {
                        try { $values['AssignedTo'] = (Ensure-PnPUser -LoginName $currentUserLogin -ErrorAction Stop).LoginName } catch { $values['AssignedTo'] = $currentUserLogin }
                    }
                    try { Add-PnPListItem -List $TaskListName -Values $values | Out-Null } catch { Write-Host "Failed to add task item (kept AssignedTo): $($_.Exception.Message)" -ForegroundColor Yellow }
                }
                Write-Host "Added 6 sample items to Task List" -ForegroundColor Green
            }
        } catch { Write-Host "Failed to inspect existing Task List items: $($_.Exception.Message)" -ForegroundColor Yellow }
    }

    # Create News List
    Write-Host "`nCreating News List: $NewsListName" -ForegroundColor Yellow
    $newsList = Get-PnPList -Identity $NewsListName -ErrorAction SilentlyContinue
    if (-not $newsList) {
        $newsList = New-PnPList -Title $NewsListName -Template GenericList
        Write-Host "Created News List: $NewsListName" -ForegroundColor Green
        
        # Add custom columns (check if they exist first)
        try { Add-PnPField -List $NewsListName -DisplayName "Summary" -InternalName "Summary" -Type Note } catch { Write-Host "Summary field already exists" -ForegroundColor Yellow }
        try { Add-PnPField -List $NewsListName -DisplayName "ImageUrl" -InternalName "ImageUrl" -Type URL } catch { Write-Host "ImageUrl field already exists" -ForegroundColor Yellow }
        try { Add-PnPField -List $NewsListName -DisplayName "Category" -InternalName "Category" -Type Choice -Choices @("Company News", "Industry News", "Product Updates", "Events") } catch { Write-Host "Category field already exists" -ForegroundColor Yellow }
        try { Add-PnPField -List $NewsListName -DisplayName "PublishDate" -InternalName "PublishDate" -Type DateTime } catch { Write-Host "PublishDate field already exists" -ForegroundColor Yellow }
        Write-Host "Added custom columns to News List" -ForegroundColor Green
        
        # Add sample data
        $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
        $newsItems = @(
            @{ Title = "New Chief Marketing Officer Joins the Team"; Summary = "We are excited to announce the appointment of our new Chief Marketing Officer"; Category = "Company News"; ImageUrl = ("{0}/{1}" -f $imgBase, "New Chief Marketing Office.jpg") },
            @{ Title = "Building a Responsible Ecosystem"; Summary = "Our commitment to sustainability and responsible business practices"; Category = "Company News"; ImageUrl = ("{0}/{1}" -f $imgBase, "Building a responsible ecosystem.jpg") },
            @{ Title = "Singapore Building Update"; Summary = "Latest updates on our new Singapore office construction"; Category = "Company News"; ImageUrl = ("{0}/{1}" -f $imgBase, "Singapore Building Update.jpg") },
            @{ Title = "Student Mentorship Opportunity"; Summary = "Join our student mentorship program and make a difference"; Category = "Company News"; ImageUrl = ("{0}/{1}" -f $imgBase, "Student mentorship opportunity.jpg") }
        )
        
        foreach ($item in $newsItems) {
            Add-PnPListItem -List $NewsListName -Values $item
        }
        Write-Host "Added 4 sample items to News List" -ForegroundColor Green
    } else {
        Write-Host "News List already exists: $NewsListName" -ForegroundColor Yellow
        try {
            $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
            $map = @{
                "New Chief Marketing Officer Joins the Team" = "New Chief Marketing Office.jpg"
                "Building a Responsible Ecosystem"        = "Building a responsible ecosystem.jpg"
                "Singapore Building Update"                = "Singapore Building Update.jpg"
                "Student Mentorship Opportunity"          = "Student mentorship opportunity.jpg"
            }
            $newsItemsExisting = Get-PnPListItem -List $NewsListName -PageSize 200
            foreach ($it in $newsItemsExisting) {
                $img = $it.FieldValues["ImageUrl"]
                if ($null -eq $img -or ($img -is [string] -and [string]::IsNullOrWhiteSpace($img))) {
                    $title = $it.FieldValues["Title"]
                    if ($map.ContainsKey($title)) {
                        $newUrl = ("{0}/{1}" -f $imgBase, $map[$title])
                        Set-PnPListItem -List $NewsListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Set News ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    }
                } elseif ($img -is [string]) {
                    if ($img.StartsWith("/assets/images", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $fileName = Split-Path -Path $img -Leaf
                        $newUrl = ("{0}/{1}" -f $imgBase, $fileName)
                        Set-PnPListItem -List $NewsListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Fixed News ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    } elseif ($img.StartsWith("/SiteAssets/", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $newUrl = ("{0}{1}" -f $SharePointSiteUrl.TrimEnd('/'), $img)
                        Set-PnPListItem -List $NewsListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Normalized server-relative News ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    }
                }
            }
        } catch {
            Write-Host "Failed to normalize existing News ImageUrl values: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    # Create Hero List
    Write-Host "`nCreating Hero List: $HeroListName" -ForegroundColor Yellow
    $heroList = Get-PnPList -Identity $HeroListName -ErrorAction SilentlyContinue
    if (-not $heroList) {
        $heroList = New-PnPList -Title $HeroListName -Template GenericList
        Write-Host "Created Hero List: $HeroListName" -ForegroundColor Green
        
        # Add custom columns
        Add-PnPField -List $HeroListName -DisplayName "Subtitle" -InternalName "Subtitle" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $HeroListName -DisplayName "ImageUrl" -InternalName "ImageUrl" -Type URL -ErrorAction SilentlyContinue
        Add-PnPField -List $HeroListName -DisplayName "LinkUrl" -InternalName "LinkUrl" -Type URL -ErrorAction SilentlyContinue
        Add-PnPField -List $HeroListName -DisplayName "CallToAction" -InternalName "CallToAction" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $HeroListName -DisplayName "IsActive" -InternalName "IsActive" -Type Boolean -ErrorAction SilentlyContinue
        Add-PnPField -List $HeroListName -DisplayName "TileType" -InternalName "TileType" -Type Text -ErrorAction SilentlyContinue
        Write-Host "Added custom columns to Hero List" -ForegroundColor Green
        
        # Build absolute image URLs for Site Assets/IntranetImages
        $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))

        # Add sample data - EXACT FIGMA HERO CONTENT with absolute URLs
        $heroItems = @(
            @{ Title = "Miriam Graham, our new Chief Marketing Officer."; Subtitle = ""; CallToAction = "Call to action text. 40 characters max."; IsActive = $true; ImageUrl = ("{0}/{1}" -f $imgBase, "New Chief Marketing Office.jpg"); TileType = "primary" },
            @{ Title = "Open door policy."; Subtitle = ""; CallToAction = ""; IsActive = $true; ImageUrl = ("{0}/{1}" -f $imgBase, "Open Door Policy.jpg"); TileType = "secondary" },
            @{ Title = "Communicating product value"; Subtitle = ""; CallToAction = ""; IsActive = $true; ImageUrl = ("{0}/{1}" -f $imgBase, "Communicating Product Value.jpg"); TileType = "secondary" },
            @{ Title = "Singapore building update."; Subtitle = ""; CallToAction = ""; IsActive = $true; ImageUrl = ("{0}/{1}" -f $imgBase, "Singapore Building Update.jpg"); TileType = "secondary" },
            @{ Title = "Student mentorship opportunities."; Subtitle = ""; CallToAction = ""; IsActive = $true; ImageUrl = ("{0}/{1}" -f $imgBase, "Student mentorship opportunity.jpg"); TileType = "secondary" }
        )
        
        foreach ($item in $heroItems) {
            Add-PnPListItem -List $HeroListName -Values $item
        }
        Write-Host "Added 5 sample items to Hero List" -ForegroundColor Green
    } else {
        Write-Host "Hero List already exists: $HeroListName" -ForegroundColor Yellow
        try {
            # Fix existing hero items that may have relative ImageUrl values
            $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
            $heroItemsExisting = Get-PnPListItem -List $HeroListName -PageSize 200
            foreach ($it in $heroItemsExisting) {
                $img = $it.FieldValues["ImageUrl"]
                if ($null -ne $img -and ($img -is [string])) {
                    if ($img.StartsWith("/assets/images", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $fileName = Split-Path -Path $img -Leaf
                        $newUrl = ("{0}/{1}" -f $imgBase, $fileName)
                        Set-PnPListItem -List $HeroListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Fixed Hero ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    }
                    elseif ($img.StartsWith("/SiteAssets/", [System.StringComparison]::OrdinalIgnoreCase)) {
                        # Convert server-relative URL to absolute
                        $newUrl = ("{0}{1}" -f $SharePointSiteUrl.TrimEnd('/'), $img)
                        Set-PnPListItem -List $HeroListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Normalized server-relative Hero ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    }
                }
            }
        } catch {
            Write-Host "Failed to normalize existing Hero ImageUrl values: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    # Create Quick Links List
    Write-Host "`nCreating Quick Links List: $QuickLinksListName" -ForegroundColor Yellow
    $quickLinksList = Get-PnPList -Identity $QuickLinksListName -ErrorAction SilentlyContinue
    if (-not $quickLinksList) {
        $quickLinksList = New-PnPList -Title $QuickLinksListName -Template GenericList
        Write-Host "Created Quick Links List: $QuickLinksListName" -ForegroundColor Green
        
        # Add custom columns
        Add-PnPField -List $QuickLinksListName -DisplayName "ImageUrl" -InternalName "ImageUrl" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $QuickLinksListName -DisplayName "BackgroundColor" -InternalName "BackgroundColor" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $QuickLinksListName -DisplayName "Url" -InternalName "Url" -Type URL -ErrorAction SilentlyContinue
        Add-PnPField -List $QuickLinksListName -DisplayName "SortOrder" -InternalName "SortOrder" -Type Number -ErrorAction SilentlyContinue
        Write-Host "Added custom columns to Quick Links List" -ForegroundColor Green
        
        # Add sample data matching Figma Quick Links design
        $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
        $quickLinksItems = @(
            @{ Title = "Building a responsible ecosystem."; ImageUrl = ("{0}/{1}" -f $imgBase, "Building a responsible ecosystem.jpg"); BackgroundColor = "#c5e9ea"; SortOrder = 1 },
            @{ Title = "Singapore building update"; ImageUrl = ("{0}/{1}" -f $imgBase, "Singapore Building Update.jpg"); BackgroundColor = "#c5e9ea"; SortOrder = 2 },
            @{ Title = "Get involved, make a difference."; ImageUrl = ("{0}/{1}" -f $imgBase, "Get Involved - make a difference.jpg"); BackgroundColor = "#c5e9ea"; SortOrder = 3 },
            @{ Title = "Have your say Time is running out"; ImageUrl = ("{0}/{1}" -f $imgBase, "Have your say Time is running out.jpg"); BackgroundColor = "#c5e9ea"; SortOrder = 4 },
            @{ Title = "One million drones sold"; ImageUrl = ("{0}/{1}" -f $imgBase, "One million drones sold.jpg"); BackgroundColor = "#c5e9ea"; SortOrder = 5 },
            @{ Title = "Student mentorship opportunity"; ImageUrl = ("{0}/{1}" -f $imgBase, "Student mentorship opportunity.jpg"); BackgroundColor = "#c5e9ea"; SortOrder = 6 }
        )
        
        foreach ($item in $quickLinksItems) {
            Add-PnPListItem -List $QuickLinksListName -Values $item
        }
        Write-Host "Added 6 sample items to Quick Links List" -ForegroundColor Green
    } else {
        Write-Host "Quick Links List already exists: $QuickLinksListName" -ForegroundColor Yellow
        try {
            $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
            $qlItemsExisting = Get-PnPListItem -List $QuickLinksListName -PageSize 200
            foreach ($it in $qlItemsExisting) {
                $img = $it.FieldValues["ImageUrl"]
                if ($img -is [string]) {
                    if ($img.StartsWith("/assets/images", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $fileName = Split-Path -Path $img -Leaf
                        $newUrl = ("{0}/{1}" -f $imgBase, $fileName)
                        Set-PnPListItem -List $QuickLinksListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Fixed QuickLinks ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    } elseif ($img.StartsWith("/SiteAssets/", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $newUrl = ("{0}{1}" -f $SharePointSiteUrl.TrimEnd('/'), $img)
                        Set-PnPListItem -List $QuickLinksListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Normalized server-relative QuickLinks ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    }
                }
            }
        } catch {
            Write-Host "Failed to normalize existing QuickLinks ImageUrl values: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    # Create NewsHub List
    Write-Host "`nCreating NewsHub List: $NewsHubListName" -ForegroundColor Yellow
    $newsHubList = Get-PnPList -Identity $NewsHubListName -ErrorAction SilentlyContinue
    if (-not $newsHubList) {
        $newsHubList = New-PnPList -Title $NewsHubListName -Template GenericList
        Write-Host "Created NewsHub List: $NewsHubListName" -ForegroundColor Green
        
        # Add custom columns
        Add-PnPField -List $NewsHubListName -DisplayName "Author" -InternalName "AuthorName" -Type Text -Required -ErrorAction SilentlyContinue
        Add-PnPField -List $NewsHubListName -DisplayName "PublishDate" -InternalName "PublishDate" -Type Text -Required -ErrorAction SilentlyContinue  
        Add-PnPField -List $NewsHubListName -DisplayName "Views" -InternalName "ViewCount" -Type Number -Required -ErrorAction SilentlyContinue
        Add-PnPField -List $NewsHubListName -DisplayName "ImageUrl" -InternalName "ImageUrl" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $NewsHubListName -DisplayName "ItemType" -InternalName "ItemType" -Type Text -Required -ErrorAction SilentlyContinue
        Write-Host "Added custom columns to NewsHub List" -ForegroundColor Green
        
        # Add sample data - Card Items (6 items)
        $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
        $newsHubCardItems = @(
            @{ Title = "Building a responsible ecosystem"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ImageUrl = ("{0}/{1}" -f $imgBase, "Building a responsible ecosystem.jpg"); ItemType = "card" },
            @{ Title = "Have your say Time is running out"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ImageUrl = ("{0}/{1}" -f $imgBase, "Have your say Time is running out.jpg"); ItemType = "card" },
            @{ Title = "One million drones sold"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ImageUrl = ("{0}/{1}" -f $imgBase, "One million drones sold.jpg"); ItemType = "card" },
            @{ Title = "Open door policy"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ImageUrl = ("{0}/{1}" -f $imgBase, "Open Door Policy.jpg"); ItemType = "card" },
            @{ Title = "Communicating product value"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ImageUrl = ("{0}/{1}" -f $imgBase, "Communicating Product Value.jpg"); ItemType = "card" },
            @{ Title = "Student mentorship opportunity"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ImageUrl = ("{0}/{1}" -f $imgBase, "Student mentorship opportunity.jpg"); ItemType = "card" }
        )
        
        foreach ($item in $newsHubCardItems) {
            Add-PnPListItem -List $NewsHubListName -Values $item
        }
        Write-Host "Added 6 card items to NewsHub List" -ForegroundColor Green
        
        # Add sample data - List Items (6 items)
        $newsHubListItems = @(
            @{ Title = "Building a responsible ecosystem"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ItemType = "list" },
            @{ Title = "Have your say Time is running out"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ItemType = "list" },
            @{ Title = "One million drones sold"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ItemType = "list" },
            @{ Title = "Open door policy"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ItemType = "list" },
            @{ Title = "Communicating product value"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ItemType = "list" },
            @{ Title = "Student mentorship opportunity"; AuthorName = "Mona Kane"; PublishDate = "June 15"; ViewCount = 256; ItemType = "list" }
        )
        
        foreach ($item in $newsHubListItems) {
            Add-PnPListItem -List $NewsHubListName -Values $item
        }
        Write-Host "Added 6 list items to NewsHub List" -ForegroundColor Green
    } else {
        Write-Host "NewsHub List already exists: $NewsHubListName" -ForegroundColor Yellow
        try {
            $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
            $map = @{
                "Building a responsible ecosystem"     = "Building a responsible ecosystem.jpg"
                "Have your say Time is running out"    = "Have your say Time is running out.jpg"
                "One million drones sold"             = "One million drones sold.jpg"
                "Open door policy"                     = "Open Door Policy.jpg"
                "Communicating product value"          = "Communicating Product Value.jpg"
                "Student mentorship opportunity"       = "Student mentorship opportunity.jpg"
            }
            $newsHubItemsExisting = Get-PnPListItem -List $NewsHubListName -PageSize 200
            foreach ($it in $newsHubItemsExisting) {
                $img = $it.FieldValues["ImageUrl"]
                if ($null -eq $img -or ($img -is [string] -and [string]::IsNullOrWhiteSpace($img))) {
                    $title = $it.FieldValues["Title"]
                    if ($map.ContainsKey($title)) {
                        $newUrl = ("{0}/{1}" -f $imgBase, $map[$title])
                        Set-PnPListItem -List $NewsHubListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Set NewsHub ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    }
                } elseif ($img -is [string]) {
                    if ($img.StartsWith("/assets/images", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $fileName = Split-Path -Path $img -Leaf
                        $newUrl = ("{0}/{1}" -f $imgBase, $fileName)
                        Set-PnPListItem -List $NewsHubListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Fixed NewsHub ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    } elseif ($img.StartsWith("/SiteAssets/", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $newUrl = ("{0}{1}" -f $SharePointSiteUrl.TrimEnd('/'), $img)
                        Set-PnPListItem -List $NewsHubListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Normalized server-relative NewsHub ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    }
                }
            }
        } catch {
            Write-Host "Failed to normalize existing NewsHub ImageUrl values: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    # Create Events List
    Write-Host "`nCreating Events List: $EventsListName" -ForegroundColor Yellow
    $eventsList = Get-PnPList -Identity $EventsListName -ErrorAction SilentlyContinue
    if (-not $eventsList) {
        $eventsList = New-PnPList -Title $EventsListName -Template GenericList
        Write-Host "Created Events List: $EventsListName" -ForegroundColor Green
        
        # Add custom columns
        Add-PnPField -List $EventsListName -DisplayName "EventDate" -InternalName "EventDate" -Type DateTime -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "Location" -InternalName "Location" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "Description" -InternalName "Description" -Type Note -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "Category" -InternalName "Category" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "Day" -InternalName "Day" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "Month" -InternalName "Month" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "DayRange" -InternalName "DayRange" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "MonthRange" -InternalName "MonthRange" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "Weekday" -InternalName "Weekday" -Type Text -ErrorAction SilentlyContinue
        Add-PnPField -List $EventsListName -DisplayName "Time" -InternalName "Time" -Type Text -ErrorAction SilentlyContinue
        Write-Host "Added custom columns to Events List" -ForegroundColor Green
        
        # Add sample data matching Figma Events design
        $eventsItems = @(
            @{ Title = "Q&A with Patti"; Category = "Leadership connection"; Day = "1"; Month = "JUN"; Weekday = "Mon"; Time = "9:30 AM"; Location = "Location"; Description = "Leadership Q&A session" },
            @{ Title = "Day of giving"; Category = "Volunteering"; Day = "1"; Month = "JUL"; Weekday = "Mon"; Time = "9:30 AM"; Location = "Location"; Description = "Company volunteering event" },
            @{ Title = "Global sales conference"; Category = ""; Day = "4"; DayRange = "4-8"; Month = "JUL"; Weekday = "Mon"; Time = "9:30 AM"; Location = "Location"; Description = "Annual sales conference" },
            @{ Title = "Leadership summit"; Category = "Leadership connection"; Day = "30"; DayRange = "30-2"; Month = "AUG"; MonthRange = "AUG-SEPT"; Weekday = "Mon"; Time = "9:30 AM"; Location = "Location"; Description = "Leadership development summit" }
        )
        
        foreach ($item in $eventsItems) {
            Add-PnPListItem -List $EventsListName -Values $item
        }
        Write-Host "Added 4 sample items to Events List" -ForegroundColor Green
    } else {
        Write-Host "Events List already exists: $EventsListName" -ForegroundColor Yellow
    }

    # Create Trending List
    Write-Host "`nCreating Trending List: $TrendingListName" -ForegroundColor Yellow
    $trendingList = Get-PnPList -Identity $TrendingListName -ErrorAction SilentlyContinue
    if (-not $trendingList) {
        $trendingList = New-PnPList -Title $TrendingListName -Template GenericList
        Write-Host "Created Trending List: $TrendingListName" -ForegroundColor Green
        
        # Add custom columns
        Add-PnPField -List $TrendingListName -DisplayName "ViewCount" -InternalName "ViewCount" -Type Number -ErrorAction SilentlyContinue
        Add-PnPField -List $TrendingListName -DisplayName "Category" -InternalName "Category" -Type Choice -Choices @("Documents", "News", "Events", "Resources") -ErrorAction SilentlyContinue
        Add-PnPField -List $TrendingListName -DisplayName "Url" -InternalName "Url" -Type URL -ErrorAction SilentlyContinue
        Add-PnPField -List $TrendingListName -DisplayName "TrendingScore" -InternalName "TrendingScore" -Type Number -ErrorAction SilentlyContinue
        # New: Image support for Trending cards
        try { Add-PnPField -List $TrendingListName -DisplayName "ImageUrl" -InternalName "ImageUrl" -Type URL } catch { Write-Host "ImageUrl field already exists on Trending" -ForegroundColor Yellow }
        Write-Host "Added custom columns to Trending List" -ForegroundColor Green
        
        # Add sample data with images stored in Site Assets/IntranetImages
        $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
        $trendingItems = @(
            @{ Title = "App designed for collaboration"; Category = "Documents"; ViewCount = 245; TrendingScore = 95; ImageUrl = ("{0}/{1}" -f $imgBase, "App Designed for Collaboration.png") },
            @{ Title = "Classroom collaboration"; Category = "Documents"; ViewCount = 189; TrendingScore = 87; ImageUrl = ("{0}/{1}" -f $imgBase, "Classroom collaboration.png") },
            @{ Title = "Collaboration journey"; Category = "Resources"; ViewCount = 156; TrendingScore = 82; ImageUrl = ("{0}/{1}" -f $imgBase, "Collaboration Journey.png") },
            @{ Title = "Communicating product value"; Category = "News"; ViewCount = 134; TrendingScore = 78; ImageUrl = ("{0}/{1}" -f $imgBase, "Communicating Product Value.jpg") },
            @{ Title = "Get involved - make a difference"; Category = "Events"; ViewCount = 112; TrendingScore = 71; ImageUrl = ("{0}/{1}" -f $imgBase, "Get Involved - make a difference.jpg") },
            @{ Title = "Open door policy"; Category = "News"; ViewCount = 98; TrendingScore = 65; ImageUrl = ("{0}/{1}" -f $imgBase, "Open Door Policy.jpg") }
        )
        
        foreach ($item in $trendingItems) {
            Add-PnPListItem -List $TrendingListName -Values $item
        }
        Write-Host "Added 6 sample items to Trending List" -ForegroundColor Green
    } else {
        Write-Host "Trending List already exists: $TrendingListName" -ForegroundColor Yellow
        # Ensure ImageUrl field exists and normalize/set values for existing items
        try { Add-PnPField -List $TrendingListName -DisplayName "ImageUrl" -InternalName "ImageUrl" -Type URL } catch { }
        try {
            $imgBase = ("{0}/SiteAssets/IntranetImages" -f $SharePointSiteUrl.TrimEnd('/'))
            $fallbackImages = @(
                "App Designed for Collaboration.png",
                "Classroom collaboration.png",
                "Collaboration Journey.png",
                "Communicating Product Value.jpg",
                "Get Involved - make a difference.jpg",
                "Open Door Policy.jpg"
            )
            $existing = Get-PnPListItem -List $TrendingListName -PageSize 500
            $i = 0
            foreach ($it in $existing) {
                $img = $it.FieldValues["ImageUrl"]
                if ($null -eq $img -or ($img -is [string] -and [string]::IsNullOrWhiteSpace($img))) {
                    $fileName = $fallbackImages[$i % $fallbackImages.Length]
                    $newUrl = ("{0}/{1}" -f $imgBase, $fileName)
                    Set-PnPListItem -List $TrendingListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                    Write-Host "Set Trending ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    $i++
                } elseif ($img -is [string]) {
                    if ($img.StartsWith("/assets/images", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $fileName = Split-Path -Path $img -Leaf
                        $newUrl = ("{0}/{1}" -f $imgBase, $fileName)
                        Set-PnPListItem -List $TrendingListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Fixed Trending ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    } elseif ($img.StartsWith("/SiteAssets/", [System.StringComparison]::OrdinalIgnoreCase)) {
                        $newUrl = ("{0}{1}" -f $SharePointSiteUrl.TrimEnd('/'), $img)
                        Set-PnPListItem -List $TrendingListName -Identity $it.Id -Values @{ ImageUrl = $newUrl } | Out-Null
                        Write-Host "Normalized server-relative Trending ImageUrl for item $($it.Id): $newUrl" -ForegroundColor Green
                    }
                }
            }
        } catch {
            Write-Host "Failed to normalize existing Trending ImageUrl values: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    # Get List GUIDs for Power Apps configuration
    Write-Host "`n=== IMPORTANT: Save these List GUIDs for Power Apps setup ===" -ForegroundColor Cyan
    $lists = @($TaskListName, $NewsListName, $HeroListName, $QuickLinksListName, $NewsHubListName, $EventsListName, $TrendingListName)
    foreach ($listName in $lists) {
        $list = Get-PnPList -Identity $listName
        Write-Host "$listName GUID: $($list.Id)" -ForegroundColor Yellow
    }
    Write-Host "=== End of List GUIDs ===" -ForegroundColor Cyan

    Write-Host "`nSharePoint environment setup completed successfully!" -ForegroundColor Green
    Write-Host "Total items created: 43 (across 7 lists)" -ForegroundColor Green
    Write-Host "Lists: ContosoTasks(6), ContosoNews(4), ContosoHero(5), ContosoQuickLinks(6), ContosoNewsHub(12), ContosoEvents(4), ContosoTrending(6)" -ForegroundColor Green
    Write-Host "Images uploaded to Site Assets/IntranetImages" -ForegroundColor Green
    Write-Host "`nNext Step: Copy images to React public folder and proceed with Phase A - Project Scaffolding" -ForegroundColor Cyan

} catch {
    Write-Error "Failed to setup SharePoint environment: $($_.Exception.Message)"
    Write-Host "Please check your permissions and SharePoint site URL" -ForegroundColor Red
} finally {
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
}
