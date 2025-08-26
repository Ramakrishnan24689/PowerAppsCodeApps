# SharePoint Intranet UI Components - Specification Reference

> **Alternative for Figma MCP**: Use this specification reference when Figma dev mode is not available. All implementations use Fluent UI React v9.

## 🔄 **Usage with Implementation Plan**

Replace Figma MCP calls with these specifications:
- `mcp_figma_get_code` nodeId `1909-32747` → **HomePage Components** section
- `mcp_figma_get_code` nodeId `2123-317659` → **TaskListPage Components** section  
- Layout generation steps → **Layout Components** section

---

## 🏗️ **Application Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│ SuiteHeader (#323130, 48px height)                         │
├────┬────────────────────────────────────────────────────────┤
│App │ SiteHeader (#03787c, 104px height)                    │
│Bar │                                                        │
│48px├────────────────────────────────────────────────────────┤
│    │ Content Area (HomePage or TaskListPage)               │
│    │                                                        │
├────┼────────────────────────────────────────────────────────┤
│    │ Footer                                                 │
└────┴────────────────────────────────────────────────────────┘
```

**Navigation**: React Router - `/` (HomePage), `/tasks` (TaskListPage)  
**Framework**: React 18 + TypeScript + Vite + Fluent UI React v9  
**Layout Pattern**: All pages use SuiteHeader + AppBar + SiteHeader + Content + Footer

---

## 📱 **HomePage Components**

### **Hero Web Part**
**Purpose**: Featured content showcase with primary story + 4 secondary items  
**Layout**: CSS Grid - 1080px primary (spans 2 rows) + 4×520px secondary tiles (2×2 grid)  
**Data**: Primary{title, imageUrl, ctaText} + Secondary[4]{title, imageUrl}  
**Styling**: Background images with rgba(0,0,0,0.3) primary / rgba(0,0,0,0.2) secondary overlays  
**Typography**: Fluent tokens - 32px primary title, 24px secondary titles, white text  
**Components**: Fluent Button for CTA, makeStyles for grid layout  
**Assets**: `/assets/images/New Chief Marketing Office.jpg` + 4 secondary images  

### **News Web Part** 
**Purpose**: Latest company news in 2×2 card grid  
**Layout**: 2×2 grid with 24px gaps between cards  
**Data**: Array[4] of {title, description, category, author, date, imageUrl}  
**Card Specs**: 196px × 112px images (16:9), category badge (#03787c)  
**Typography**: 16px bold titles (2-line max), 14px description (1-line max)  
**Components**: Fluent Card, Text, Badge components  

### **Events Web Part**
**Purpose**: Upcoming events in 4-column card layout  
**Layout**: 4 columns, 258px × 240px cards with date overlays  
**Data**: Array[4] of {day, month, category, title, time, location}  
**Date Overlay**: 72px × 72px top-left, 32px bold day, 12px uppercase month  
**Components**: Fluent Card, Text, Badge for categories  

### **News Hub Web Part**
**Purpose**: Combined news cards + sidebar content layout  
**Layout**: Main content area + right sidebar with additional news items  
**Components**: Extend News Web Part pattern with sidebar layout  

### **Industry News + Quick Links**
**Purpose**: Text content + carousel of quick access items  
**Layout**: 1/3 text content (380px) + 2/3 carousel (792px), background #f0f9fa  
**Carousel**: 2×3 grid with pagination dots and navigation arrows  
**Data**: Text content + array of {title, thumbnail} for quick links  
**Images**: 120px × 80px thumbnails  
**Components**: Fluent Button for navigation, custom carousel with Fluent styling  

---

## 📋 **TaskListPage Components**

### **Page Layout**
**Purpose**: Task management interface with consistent layout structure  
**Layout**: SuiteHeader + AppBar + SiteHeader + Content + Footer  
**Route**: `/tasks` - accessible via AppBar navigation  
**Components**: Use identical layout components as HomePage  

### **Welcome Section**
**Purpose**: Page header with greeting and task summary  
**Content**: "Good morning, Megan" + task count summary  
**Typography**: Fluent tokens for heading hierarchy  
**Components**: Fluent Text components with proper semantic levels  

### **Trending Cards Section**
**Purpose**: 2×2 grid of trending/priority tasks  
**Layout**: 4 cards in 2×2 grid with consistent spacing  
**Data**: Array[4] of {title, assignedTo, imageUrl}  
**Card Specs**: Equal-sized cards with background images and text overlays  
**Components**: Fluent Card components with background images  
**Assets**: 4 collaboration images from `/assets/images/` directory  

### **Task Table Section** 
**Purpose**: Comprehensive task list with management capabilities  
**Layout**: Data table with checkboxes, task details, assignee avatars  
**Columns**: Checkbox | Task Name | Assigned To | Due Date | Status  
**Data**: Array of task objects with all required fields  
**Components**: Fluent Table, Checkbox, Avatar, Badge components  
**Features**: Sortable columns, multi-select, row selection  

### **Toolbar Section**
**Purpose**: Task management actions and controls  
**Layout**: Horizontal toolbar with action buttons  
**Actions**: Add Task, Delete Selected, Assign, Filter, Search  
**Components**: Fluent Button, SearchBox, Dropdown components  
**State**: Connected to table selection state for enable/disable logic  

---

## 🔧 **Layout Components**

### **SuiteHeader**
**Purpose**: Office 365 suite header bar  
**Specs**: Height 48px, background #323130  
**Components**: Fluent CommandBar pattern for waffle menu, search, profile  

### **AppBar** 
**Purpose**: Left navigation sidebar  
**Specs**: Width 48px collapsed, expandable on hover  
**Components**: Fluent Nav components with Home and Tasks icons  
**Navigation**: Links to `/` (HomePage) and `/tasks` (TaskListPage)  

### **SiteHeader**
**Purpose**: Site-specific header with title and breadcrumbs  
**Specs**: Height 104px, background #03787c  
**Components**: Fluent Breadcrumb, Text components  
**Content**: Site title + navigation breadcrumbs  

### **Footer**
**Purpose**: Standard page footer  
**Components**: Fluent Link, Text components  
**Content**: Copyright and legal links  

---

## 🎯 **Implementation Mapping**

**Phase B2.1**: Hero Web Part → Use Hero specifications above  
**Phase B2.2**: News Web Part → Use News specifications above  
**Phase B2.3**: Events Web Part → Use Events specifications above  
**Phase B2.4**: News Hub Web Part → Use News Hub specifications above  
**Phase B2.5**: Industry News + Quick Links → Use Industry News specifications above  
**Phase B2.6**: TaskListPage → Use TaskListPage Components specifications above  
**Phase B3**: Layout Assembly → Use Layout Components specifications above  

**Project Structure**:
```
src/
├── components/
│   ├── layout/          # SuiteHeader, AppBar, SiteHeader, Footer
│   ├── webparts/        # Hero, News, Events, NewsHub, IndustryNews
│   └── pages/           # HomePage, TaskListPage
├── App.tsx             # FluentProvider + Router setup
└── main.tsx
```

**Key Dependencies**:
- `@fluentui/react-components` (primary UI library)
- `@fluentui/react-icons` (icons for navigation)
- `react-router-dom` (navigation)
- All styling via Fluent makeStyles and tokens

---

*This reference provides complete specifications for implementing the SharePoint Intranet UI without Figma MCP dependencies.*
