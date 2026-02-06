# Application Shell Specification

## Overview
The application shell provides persistent navigation and layout for Go Global Dubbing Manager. It uses a sidebar navigation pattern optimized for an ERP-style application with multiple sections.

## Navigation Structure
- **Dashboard** → Default view (summary/overview)
- **Orders** → Gestión de órdenes y episodios
- **Assignment** → Asignación de trabajo y seguimiento
- **Vendors & Rates** → Configuración de vendors y tarifas
- **Settlement** → Liquidación y pagos

## User Menu
- **Location:** Bottom of sidebar
- **Contents:** User avatar, user name, logout option
- **Behavior:** Dropdown menu on click

## Layout Pattern
**Sidebar Navigation** — Vertical navigation on the left, main content area on the right.

- **Desktop:** Sidebar always visible, fixed width (~240px), content area takes remaining space
- **Tablet:** Sidebar can be toggled, hamburger menu button in header
- **Mobile:** Sidebar hidden by default, hamburger menu in header opens overlay sidebar

## Responsive Behavior
- **Desktop (≥1024px):** Full sidebar always visible
- **Tablet (768px - 1023px):** Sidebar toggleable via hamburger menu
- **Mobile (<768px):** Sidebar hidden, accessible via hamburger menu (overlay/drawer pattern)

## Design Notes
- Uses design tokens: blue-900 (primary), red-700 (secondary), stone (neutral)
- Typography: Montserrat for headings/nav items, Open Sans for body text
- Active navigation item highlighted with primary color
- User menu at bottom of sidebar for easy access
- Dashboard is the default landing page (shows summary/overview)

