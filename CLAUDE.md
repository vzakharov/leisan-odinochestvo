# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page landing site for an online self-discovery group focused on the theme of loneliness ("Один — или просто не встречен?"). The site is built with vanilla HTML, CSS, and JavaScript - no build tools or frameworks required.

**Key characteristics:**
- Static site with no dependencies or package managers
- Russian language content
- Heavy focus on visual storytelling through sequential animations and floating imagery
- Mobile-responsive design with breakpoints at 768px and 480px

## Development Workflow

**Starting a local server:**
```bash
# Any static server will work, for example:
python3 -m http.server 8000
# OR
python -m SimpleHTTPServer 8000
# Then visit http://localhost:8000
```

**Viewing the site:**
Open [index.html](index.html) directly in a browser, or use a local server for best results.

**Testing animations:**
- Visit the site normally to see sequential text animations
- Add `#reset` to the URL to clear localStorage and replay animations
- Animations are saved in localStorage after first view to avoid repetition

## Architecture

### Core Files

- **[index.html](index.html)** - Single-page structure with 8 semantic sections
- **[styles.css](styles.css)** - Complete styling with CSS custom properties
- **[script.js](script.js)** - Animation system and interaction logic
- **[images/](images/)** - Background gradients and floating contemplation images

### Section Architecture

The page is divided into distinct `.block` sections, each with a specific purpose:

1. **block-invitation** - Opening animated text sequence with sequential fade-ins
2. **block-about** - Two-column grid: text content + sticky info card
3. **block-contemplation** - Animated floating images with poetic text overlay
4. **block-topics** - Program topics with sticky pricing card
5. **block-facilitators** - Facilitator bios with placeholder photos
6. **block-echo** - Closing reflective text

### Animation System

**Text breathing animations** ([script.js:22-78](script.js#L22-L78)):
- Uses IntersectionObserver to trigger animations when sections enter viewport
- Checks `localStorage.animationsShown` to skip animations on repeat visits
- Sequential fade-in controlled by `data-delay` attributes on elements
- Configurable delays per line in HTML

**Floating images** ([script.js:80-167](script.js#L80-L167)):
- Four images in `.block-contemplation` that appear, drift, and fade
- Edge-biased positioning (90% chance to appear in outer 20% of space)
- Each image cycles independently with staggered start times
- Mobile-responsive with reduced sizes and faster cycles

### Styling Architecture

**CSS Custom Properties** ([styles.css:8-45](styles.css#L8-L45)):
- Color palette based on muted sunset gradients
- Spacing scale (xs/sm/md/lg/xl) for consistent rhythm
- Transition timing variables for animation consistency

**Block styling pattern:**
- Each block has unique gradient background
- Subtle divider lines with gradient opacity
- Minimum 100vh height for full-screen sections
- Gradual color transitions between adjacent sections

**Responsive strategy:**
- Two-column grids collapse to single column on mobile
- Sticky cards become position: relative on mobile
- Font sizes scale down at 768px and 480px breakpoints
- Floating image sizes reduce from 360px to 220px

## Common Modifications

### Updating contact information
Change the email in [index.html:112](index.html#L112) in the `.block-topics` section.

### Adjusting animation timing
- Modify `data-delay` attributes in HTML for text sequences
- Adjust timing constants in [script.js:93-159](script.js#L93-L159) for floating images
- Edit CSS transition variables in [styles.css:42-44](styles.css#L42-L44)

### Changing color schemes
All colors are defined as CSS custom properties in [styles.css:8-32](styles.css#L8-L32). Edit these variables to update the entire color scheme consistently.

### Adding or removing sections
- Each section follows the `.block` pattern with semantic class names
- Update gradient backgrounds to maintain smooth color flow
- Consider animation entry points in [script.js:38-40](script.js#L38-L40)

## Design Principles

- **Progressive disclosure**: Content reveals gradually through scroll and animations
- **Contemplative pacing**: Slow transitions (2.5s default) match the theme
- **Visual metaphor**: Sunset gradient journey from warm to cool tones mirrors emotional arc
- **Accessibility**: Respects `prefers-reduced-motion` to disable animations
- **Performance**: CSS transforms and opacity for smooth 60fps animations
