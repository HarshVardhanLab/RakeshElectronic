# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Development Workflow
- The development server runs on port 8080 (configured in vite.config.ts)
- Hot module replacement is enabled for fast development
- ESLint is configured for code quality

## Project Architecture

### Tech Stack
- **React 18** with TypeScript for the frontend
- **Vite** as the build tool with SWC for fast compilation
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens
- **React Router DOM** for client-side routing
- **React Query (TanStack Query)** for server state management
- **React Hook Form + Zod** for form handling and validation
- **i18next** for internationalization (English/Hindi support)
- **next-themes** for dark/light theme switching

### Directory Structure
```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components (accordion, button, etc.)
│   ├── Navigation.tsx   # Main navigation with responsive design
│   ├── HeroSection.tsx  # Landing page hero
│   ├── ServicesSection.tsx
│   ├── ProductsSection.tsx
│   ├── ContactSection.tsx
│   ├── ThemeProvider.tsx
│   └── LanguageSwitcher.tsx
├── pages/              # Route components
│   ├── App.tsx         # Root app component with providers
│   ├── Index.tsx       # Main landing page
│   ├── BookRepair.tsx  # Repair booking page
│   └── NotFound.tsx    # 404 page
├── locales/            # i18n translation files
│   ├── en/translation.json
│   └── hi/translation.json
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── i18n.ts            # i18n configuration
└── main.tsx           # Application entry point
```

### Key Architectural Patterns

#### Component Structure
- All UI components use shadcn/ui as the foundation
- Custom components follow the shadcn pattern with forwardRef and cn utility
- Responsive design implemented with Tailwind's breakpoint system
- Components are fully accessible using Radix UI primitives

#### Theme System
- Custom color palette defined in tailwind.config.ts using CSS variables
- Support for light/dark/system themes via next-themes
- Professional color scheme optimized for electronics business branding
- Custom fonts: Poppins (headings) and Roboto (body text)

#### State Management
- React Query handles server state and caching
- Local state managed with React hooks (useState, useEffect)
- Theme state managed globally via next-themes context
- Form state handled by React Hook Form with Zod validation

#### Internationalization
- i18next with browser language detection
- Fallback to English if detected language unavailable  
- Translation files in JSON format under src/locales/
- LanguageSwitcher component for manual language selection

#### Routing Setup
- BrowserRouter with Routes/Route from React Router DOM
- Main routes: / (Index), /book-repair (BookRepair), /* (NotFound)
- Navigation component handles smooth scrolling to page sections

### Development Notes

#### Adding New Components
- Use `npx shadcn@latest add [component-name]` to add new shadcn/ui components
- Place custom components in src/components/ following existing patterns
- Import and configure in the appropriate page component

#### Styling Guidelines
- Use Tailwind utility classes following the existing patterns
- Leverage custom CSS variables defined in the theme configuration
- Follow responsive-first approach (mobile → desktop)
- Use semantic color tokens (primary, secondary, accent, etc.)

#### Internationalization Workflow
- Add new translation keys to both en/translation.json and hi/translation.json
- Use the `useTranslation` hook: `const { t } = useTranslation()`
- Reference keys with `t('section.key')` pattern
- Update translations when adding new user-facing text

#### Form Handling
- Use React Hook Form with Zod schema validation
- Implement toast notifications with Sonner for user feedback
- Follow the pattern established in BookRepairDialog component

### Build Configuration

#### Vite Configuration
- React plugin with SWC for fast transpilation
- Path alias `@` points to `./src` directory
- Development server configured for IPv6 (::) on port 8080
- Lovable tagger plugin enabled in development mode

#### Tailwind Configuration
- Custom design system with CSS variables
- Extended color palette for business branding
- Custom font families (Poppins, Roboto)
- shadcn/ui integration with proper theming support
- Animation utilities for interactive elements

### Business Context
This is a website for Rakesh Electronics, an electronics repair and sales business. The site features:
- Service booking functionality for repairs
- Product showcase sections
- Professional business branding
- Multilingual support for local market (English/Hindi)
- Mobile-first responsive design for customer accessibility
