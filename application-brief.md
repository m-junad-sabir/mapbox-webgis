# WebGIS CRUD Editor – Project Architecture & Development Specification

> **Project Type:** Portfolio / Demo Application
>
> **Purpose:** Demonstrate professional WebGIS development skills including GIS visualization, layer management, feature editing, CRUD operations, spatial data handling, and modern frontend/backend architecture.

---

# 1. Project Goal

Build a modern, responsive WebGIS application that allows users to:

- Upload GIS datasets
- Visualize GIS layers
- Edit GIS features
- Perform CRUD operations
- Manage GIS layers
- Add bookmarks
- Raise QC flags/issues
- Search locations and GIS features

This is **NOT** an enterprise application.

The application intentionally excludes:

- Authentication
- Authorization
- User Roles
- Dashboards
- Workflow Engine
- GeoServer
- WMS/WFS
- Vector Tile Generation
- Raster Processing
- Printing
- Reporting

The focus is purely GIS Editing.

---

# 2. Technology Stack

## Frontend

- Vue 3
- Vite
- Tailwind CSS → Layout, spacing, and utility styling.
- Flowbite Vue → General application UI components.
- Custom Vue Components → GIS-specific toolbars, map controls, layer panels, and editing tools.
- Pinia
- Vue Router
- Axios
- MapLibre GL JS
- MapTiler SDK
- TerraDraw

## Backend

- Node.js
- Express.js

## Database

- Supabase
- PostgreSQL
- PostGIS

## Deplyoment and Hosting
- I will use Vercel and Github for this by self.
---

# 3. System Architecture

```
Vue 3 + Vite

        │

      Axios

        │

Node.js + Express REST API

        │

Supabase (PostGIS)
```

---

# 4. Development Philosophy

The application should look and behave like a lightweight professional GIS platform similar to:

- ArcGIS Online
- QGIS Web Client
- GeoNode
- MapStore

while remaining intentionally simple.

The project should prioritize:

- Clean Architecture
- Responsive UI
- Reusable Components
- Modern UX
- GIS Best Practices

---

# 5. Responsive Design Requirements

The application MUST be responsive.

---

## Desktop

Screen Width:

1024px+

Features:

- Permanent sidebar
- Floating toolbar
- Right-side collapsible panels
- Multi-column dialogs

---

## Tablet

768px – 1023px

Features:

- Collapsible sidebar
- Floating toolbar
- Slide-over panels

---

## Mobile

320px – 767px

Features:

- Fullscreen map
- Hamburger navigation
- Bottom sheet panels
- Floating Action Buttons
- Large touch targets

---

# Responsive Rules

Every component MUST adapt automatically.

Including:

- Navbar
- Sidebar
- Toolbar
- Layer Panel
- Search
- Upload Dialog
- Bookmark Panel
- QC Flag Panel
- Basemap Gallery
- Popups
- Forms
- Cards
- Buttons
- Icons

Avoid fixed widths whenever possible.

---

# 6. UI Layout

Desktop Layout

```
-----------------------------------------------------
 Navbar
-----------------------------------------------------

 Sidebar        Map View            Right Panel

                 Toolbar

-----------------------------------------------------
 Status Bar
-----------------------------------------------------
```

---

Tablet Layout

```
--------------------------------------

Navbar

Map View

Floating Toolbar

Slide-over Sidebar

Bottom Status Bar
```

---

Mobile Layout

```
-------------------------

Navbar

Search

Map

Floating Buttons

Bottom Drawer
```

---

# 7. Application Modules

## Navigation

- Navbar
- Sidebar
- Status Bar

---

## Map

- MapLibre Map
- Navigation Controls
- Compass
- Scale
- Coordinates
- Fullscreen

---

## Layer Management

- Layer List
- Layer Visibility
- Layer Opacity
- Zoom To Layer
- Remove Layer

---

## GIS Editing

- Draw Point
- Draw Line
- Draw Polygon
- Draw Rectangle
- Draw Circle
- Edit Geometry
- Delete Geometry

---

## Upload

Supported Formats:

- GeoJSON
- KML
- KMZ
- ZIP Shapefile

---

## Identify

Click Feature

↓

Popup

↓

Display Attributes

↓

Edit Attributes

---

## Bookmarks

Save

- Center
- Zoom
- Bearing
- Pitch

Jump back later.

---

## QC Flags

User clicks

↓

Map

↓

Issue Dialog

Fields

- Issue
- Description
- Status

Display flag icon on map.

---

## Search

Two search modes.

### Location Search

MapTiler Geocoder

---

### GIS Search

Search active layer attributes.

Example

```
School

↓

School ABC

↓

Zoom To Feature
```

---

## Measure

- Distance
- Area
- Clear

---

## Basemap Gallery

- Streets
- Satellite
- Hybrid
- Terrain
- Dark
- Light

---

# 8. User Interface Components

Navigation

- Navbar
- Sidebar
- Status Bar

Panels

- Layer Panel
- Search Panel
- Upload Panel
- Bookmark Panel
- QC Panel
- Basemap Panel

Dialogs

- Upload
- Edit Attributes
- Bookmark
- QC Flag

Toolbars

- Draw
- Edit
- Delete
- Measure
- Identify
- Zoom
- Fullscreen

---

# 9. Recommended Folder Structure

```
src/

assets/

components/

    common/

    map/

    sidebar/

    toolbar/

    layer/

    upload/

    search/

    bookmark/

    qc/

    dialogs/

    panels/

composables/

layouts/

router/

services/

stores/

styles/

utils/

views/

App.vue

main.js
```

---

# 10. Backend Structure

```
server/

config/

controllers/

routes/

services/

middleware/

utils/

uploads/

app.js

server.js
```

---

# 11. Database Schema

## layers

| Column | Type |
|----------|------|
| id | uuid |
| name | text |
| geometry_type | text |
| color | text |
| created_at | timestamp |

---

## features

| Column | Type |
|----------|------|
| id | uuid |
| layer_id | uuid |
| geometry | geometry |
| properties | jsonb |

---

## bookmarks

| Column | Type |
|----------|------|
| id | uuid |
| name | text |
| center | jsonb |
| zoom | numeric |

---

## flags

| Column | Type |
|----------|------|
| id | uuid |
| feature_id | uuid |
| geometry | geometry |
| issue | text |
| remarks | text |
| status | text |

---

# 12. REST API

## Layers

```
GET      /layers

POST     /layers

PUT      /layers/:id

DELETE   /layers/:id
```

---

## Features

```
GET      /layers/:layerId/features

POST     /layers/:layerId/features

PUT      /features/:id

DELETE   /features/:id
```

---

## Upload

```
POST /upload
```

Workflow

```
Upload File

↓

Backend

↓

Parse

↓

Store Features

↓

Create Layer

↓

Return Layer ID
```

---

## Bookmarks

```
GET

POST

DELETE
```

---

## QC Flags

```
GET

POST

PUT

DELETE
```

---

# 13. GIS Data Flow

```
Upload GIS File

↓

Express API

↓

Parse GeoJSON

↓

Insert Features

↓

Store Geometry in PostGIS

↓

Return Layer

↓

Load Layer

↓

CRUD Operations

↓

Update Database

↓

Refresh Map
```

---

# 14. Component Responsibilities

## Map Component

Responsible only for:

- Rendering map
- Rendering layers
- Rendering drawings
- Rendering popups

Should NOT contain business logic.

---

## Sidebar

Responsible for

- Layer List
- Search
- Upload
- Bookmarks
- QC

---

## Toolbar

Responsible for

- Draw
- Edit
- Delete
- Measure
- Identify

---

## Services

Responsible for

REST API communication only.

No UI logic.

---

## Stores

Responsible for

Application state.

Examples

- Active Layer
- Selected Feature
- Map State
- Bookmarks
- Flags

---

# 15. Development Phases

## Phase 1

Project Setup

- Vue
- Tailwind and Flowbite
- Pinia
- Router
- Axios

---

## Phase 2

Map Integration

- MapLibre
- MapTiler
- TerraDraw

---

## Phase 3

Responsive Layout

- Navbar
- Sidebar
- Toolbar
- Panels

---

## Phase 4

Layer Management

- Add Layer
- Remove Layer
- Opacity
- Visibility

---

## Phase 5

Upload

- GeoJSON
- KML
- KMZ
- ZIP Shapefile

---

## Phase 6

Feature CRUD

- Add
- Edit
- Delete

---

## Phase 7

Identify Popup

- Show Attributes
- Edit Attributes

---

## Phase 8

Bookmarks

---

## Phase 9

QC Flags

---

## Phase 10

Search

- Location Search
- GIS Search

---

## Phase 11

UI Polish

- Animations
- Loading
- Notifications
- Error Handling
- Empty States

---

# 16. UI Design Principles

The application should follow these principles:

- Modern
- Minimal
- Responsive
- GIS-focused
- Modular
- Reusable
- Accessible
- Fast
- Clean
- Professional

The map should always remain the primary focus of the interface.

---

# 17. Coding Standards

- Use Composition API.
- Prefer `<script setup>`.
- Keep components small and focused.
- Separate UI from business logic.
- Use composables for reusable map functionality.
- Centralize API calls in the `services` directory.
- Use Pinia only for shared application state.
- Avoid inline styles.
- Tailwind utility classes or Flowbite UI Componenets.
- Write clear, self-documenting code with meaningful names.
- Keep files modular to support future expansion.

---

# 18. Future Enhancements (Out of Scope)

These are intentionally excluded from Version 1 but should be considered during architecture to avoid blocking future growth:

- Authentication & Authorization
- User Profiles
- Role-Based Access Control (RBAC)
- GeoServer Integration
- WMS/WFS/WFS-T Support
- Raster Layer Support
- Vector Tile Support
- Advanced Styling Editor
- Snapping & Topology Editing
- Undo/Redo History
- Offline Editing
- Real-Time Collaboration (WebSockets)
- Layer Permissions
- Print/PDF Export
- Spatial Analysis Tools
- Time Slider
- Versioned Editing
- Mobile PWA Support
- Internationalization (i18n)

---

# 19. Definition of Done

The project is considered complete when:

- The application is fully responsive across mobile, tablet, and desktop.
- Users can upload supported GIS formats and visualize them.
- GIS layers can be managed (visibility, opacity, zoom, removal).
- Features can be created, edited, and deleted.
- Feature attributes can be viewed and updated.
- Bookmarks can be created and revisited.
- QC flags can be placed and managed.
- Search works for both locations and layer attributes.
- Data persists through the Express API and Supabase/PostGIS.
- The UI is polished, consistent, and suitable for a professional portfolio demonstration.
- Add comments at the places where i have to add information related to Secrets and Environment Variables or configuration links. Such as for Maptiler and Supabase.