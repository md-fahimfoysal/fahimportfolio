# Premium Academic/Editorial Typography System

## System Overview

A sophisticated, modern typography hierarchy designed for a mechanical engineering portfolio with aerospace interests. The system combines:
- **Elegant serif (Playfair Display)** for distinguished display and headings
- **Clean sans-serif (Inter)** for navigation, body, and technical information
- **Premium proportions** with careful letter-spacing and line-height
- **Clear hierarchy** from name → title → content → metadata

---

## Typographic Hierarchy

### Level 1: Name (Strongest Element)
**"MD Fahim Foysal"**
- Font: Playfair Display, Serif
- Size: 80px
- Weight: 700 (Bold)
- Letter-spacing: -0.045em (Tight for elegance)
- Line-height: 1.1
- Color: White with text-shadow for luminosity
- Purpose: Most prominent typographic element on page

### Level 2: Academic Title
**"Mechanical Engineering Student"** (typing animation)
- Font: Inter, Sans-serif
- Size: 20px
- Weight: 500
- Letter-spacing: -0.01em
- Color: rgba(255, 255, 255, 0.85)
- Purpose: Secondary introduction element

### Level 3: University & Location
**"Undergraduate at [University]"**
- Font: Inter, Sans-serif
- Size: 15px
- Weight: 600
- Letter-spacing: 0.02em (Slight expansion for emphasis)
- Text-transform: UPPERCASE
- Color: Electric teal (#5ff3ff)
- Purpose: Institutional credibility

### Level 4: Section Headings
**"About Me", "Projects", "Research"**
- Font: Playfair Display, Serif
- Size: 42px
- Weight: 700
- Letter-spacing: -0.035em
- Line-height: 1.2
- Color: White
- Decoration: Teal underline with subtle glow
- Purpose: Major content divisions

### Level 4.5: Small Section Headings
Used for subsections within pages
- Font: Playfair Display, Serif
- Size: 32px
- Weight: 700
- Letter-spacing: -0.035em
- Color: White

### Level 5: Card & Panel Headings
**Research titles, Achievement titles, Activity titles**
- Font: Playfair Display, Serif
- Size: 22px
- Weight: 700
- Letter-spacing: -0.03em
- Color: #e0ebff (Heading accent)
- Purpose: Content organization within sections

### Level 5.5: Small Card Headings
**About subsections, footer panel names**
- Font: Playfair Display, Serif (or Inter for less prominence)
- Size: 20px
- Weight: 700
- Letter-spacing: -0.01em to -0.03em
- Purpose: Slightly less prominent than Level 5

### Level 6: Detail & Summary Card Titles
**"Summary card headings", "Quick link titles"**
- Font: Inter, Sans-serif
- Size: 20px
- Weight: 700
- Letter-spacing: -0.01em
- Color: #e0ebff
- Purpose: Functional labeling of UI components

### Level 7: Body Text (Primary)
All paragraph text
- Font: Inter, Sans-serif
- Size: 15-16px
- Weight: 400
- Line-height: 1.65-1.75
- Letter-spacing: -0.005em
- Color: #e6f3ff (text-dark) or #eef2f7 (text-light)
- Purpose: Main readable content

### Level 8: Secondary Body Text
Course descriptions, metadata labels
- Font: Inter, Sans-serif
- Size: 14-15px
- Weight: 400-500
- Line-height: 1.6-1.7
- Letter-spacing: -0.005em
- Color: #8fa3b8 (text-muted)
- Purpose: Supporting information

### Level 9: Metadata & Labels
**Course codes, dates, badges, tags**
- Font: Inter, Sans-serif
- Size: 12-13px
- Weight: 600
- Letter-spacing: 0.01em
- Color: #8fa3b8 or teal accent
- Purpose: Technical information & categorization

### Level 10: Buttons & CTAs
- Font: Inter, Sans-serif
- Size: 15px
- Weight: 600
- Letter-spacing: 0.01em
- Color: White on teal background
- Purpose: Action elements

---

## Font Specifications

### Primary Display Font
**Playfair Display**
- Serif elegance for premium appearance
- Used for: Name, section headings, card titles, headings
- Import: Google Fonts
- Weights used: 700 (Bold)
- Character set: Latin extended
- Purpose: Establishes academic/editorial aesthetic

### Primary Body Font
**Inter**
- Clean, highly legible modern sans-serif
- Used for: Body text, navigation, labels, buttons, metadata
- Import: Google Fonts
- Weights used: 400, 500, 600, 700, 800
- Letter-spacing: Critical for premium appearance
- Purpose: Functional clarity & readability

### Fallback & Supporting Fonts
- **Noto Sans Bengali**: For multilingual support (Bengali text)
- **Serif system font**: Fallback for Playfair Display
- **Sans-serif system fonts**: Fallback for Inter (Arial, Helvetica, etc.)

---

## Typography Principles

### 1. Contrast & Hierarchy
- Name (80px) → Section titles (42px) → Headings (22px) → Body (16px) → Metadata (13px)
- Each level is visually distinct
- Clear visual scanning path for different information types

### 2. Letter-spacing Strategy
- **Display text**: Tight negative letter-spacing (-0.03em to -0.045em) for elegance
- **Body text**: Slightly negative (-0.005em) for cohesion
- **Metadata/buttons**: Slightly positive (0.01em to 0.02em) for clarity
- Premium effect: Tight headings, open body

### 3. Line-height & Readability
- **Display/Headings**: 1.1-1.2 (tight for impact)
- **Body text**: 1.65-1.75 (generous for readability)
- **Form labels**: 1.5-1.6 (balanced)
- Long-form content: Always ≥1.65 for eye comfort

### 4. Font Weight Strategy
- **Playfair Display**: Always 700 (Bold) for sophistication
- **Inter headings**: 700 for card titles, 600 for secondary elements
- **Inter body**: 400-500 (never less than 400)
- **Emphasis**: Use 700 for bold text within paragraphs

### 5. Color & Text Hierarchy
- **Primary headings**: #ffffff (pure white)
- **Secondary headings**: #e0ebff (light blue-white)
- **Body text**: #e6f3ff (bright cool white)
- **Secondary text**: #eef2f7 (off-white)
- **Metadata**: #8fa3b8 (blue-gray)
- **Accent text**: #00d9ff or #5ff3ff (teal)

### 6. Text Rendering Optimization
- `-webkit-font-smoothing: antialiased` (macOS Chrome)
- `-moz-osx-font-smoothing: grayscale` (Firefox)
- `text-rendering: optimizeLegibility` (all browsers)
- `font-feature-settings: 'cv11', 'cv02', 'ss01'` (OpenType features)

---

## Component Typography

### Navigation
- Font: Inter, 15px, 600 weight
- Letter-spacing: -0.005em
- Color: Teal (#6ef7ff) with glow
- Hover: Slightly brighter with increased text-shadow

### Buttons
- Font: Inter, 15px, 600 weight
- Letter-spacing: 0.01em
- Text-transform: None (preserve case)
- Color: White on teal background

### Form Labels
- Font: Inter, 13px, 700 weight
- Letter-spacing: -0.01em
- Color: #eef2f7

### Form Inputs
- Font: Inter, 14px, 400 weight
- Color: #eef2f7 (text), #8fa3b8 (placeholder)
- Focus: Teal border with glow

### Tags & Badges
- Font: Inter, 12px, 600 weight
- Letter-spacing: 0.01-0.02em
- Text-transform: None or UPPERCASE depending on context
- Color: Teal accent

### Course Items
- Title: Inter, 15px, 600 weight
- Credits: Inter, 13px, 700 weight
- Type: Inter, 10px, 700 weight, UPPERCASE, 0.6em letter-spacing

---

## Responsive Typography

### Desktop (1024px+)
- Hero name: 80px
- Section titles: 42px
- Card headings: 22px
- Body text: 16px
- Metadata: 13px

### Tablet (768px - 1023px)
- Hero name: 64px (reduced from 80px)
- Section titles: 36px
- Card headings: 20px
- Body text: 15px
- Metadata: 12px

### Mobile (< 768px)
- Hero name: 48px
- Section titles: 30px
- Card headings: 18px
- Body text: 14px
- Metadata: 12px

---

## Premium Touches

1. **Serif Display**: Playfair Display creates immediate premium perception
2. **Negative Letter-spacing**: Tight headings feel sophisticated
3. **Consistent Font Weights**: No random variations in weight
4. **Generous Line-height**: Premium brands use more space between lines
5. **Careful Size Jumps**: Measured progression between hierarchy levels
6. **Teal Accents**: Strategic use maintains premium neon aesthetic
7. **Text Shadows**: Subtle glows enhance premium digital aesthetic
8. **Uppercase Metadata**: Technical information uses uppercase for clarity

---

## Implementation

All typography is defined in [style.css](style.css):
- CSS variables not used for fonts (direct font-family declarations for specificity)
- Fallback font stacks for every element
- Responsive font sizes via media queries
- Optimized text rendering via font-feature-settings

---

## Design Philosophy

This system reflects **premium academic/editorial principles**:
- **Academic**: Serif display creates scholarly credibility
- **Editorial**: Professional hierarchy mirrors publication design
- **Modern**: Inter sans-serif keeps everything contemporary
- **Engineering**: Precision in letter-spacing and proportions
- **Aerospace**: Clean, minimal approach aligned with aerospace aesthetics
- **Premium**: Generous spacing and elegant serif conveys quality
- **Controlled Neon**: Typography pairs with sophisticated electric teal palette

---

Last Updated: 2026-08-12
