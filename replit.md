# IBM Immobilière - Real Estate Platform

## Overview

IBM Immobilière is a modern real estate platform for showcasing residential and commercial properties in Tunisia. The application provides property listings, project portfolios, blog content, and partner integrations for a luxury real estate company. Built with Next.js 15 and MongoDB, it supports French language content and dynamic property search capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Project Status

### Phase 1: Architecture & Foundation ✅ COMPLETED (October 3, 2025)

**Completed Tasks:**
- ✅ Migrated from Pages Router to App Router (Next.js 15)
- ✅ Set up MongoDB with Mongoose ODM
- ✅ Installed all required dependencies (Framer Motion, Zustand, React Hook Form, Zod, next-intl, Sharp)
- ✅ Created database schemas for Properties, Projects, Blog Posts, Partners, and Testimonials
- ✅ Configured TypeScript with path aliases
- ✅ Set up development workflow on port 5000
- ✅ Configured Next.js for image optimization and server actions

**Tech Stack:**
- Next.js 15.2.3 with App Router
- React 19.0.0
- TypeScript 5.8.2
- MongoDB with Mongoose
- Tailwind CSS 4.0.15
- Framer Motion 12.23.22
- Zustand 5.0.8
- React Hook Form + Zod
- next-intl 4.3.9
- Sharp 0.34.4

### Phase 2: Core Components Development ✅ COMPLETED (October 3, 2025)

**Completed Tasks:**
- ✅ Created Header component with sticky navigation, mobile menu, and smooth animations
- ✅ Created Footer component with links, company info, and responsive design
- ✅ Created PropertyCard component with hover effects and property details
- ✅ Created ProjectCard component with image overlays and status badges
- ✅ Created BlogCard component with featured images and category tags
- ✅ Created SearchBar component with filters for type, location, and rooms
- ✅ Created StatsCounter component with scroll-triggered number animations
- ✅ Created TestimonialCarousel component with auto-play and navigation
- ✅ Updated homepage to showcase all components with sample data

**Components Created:**
- `components/Header.tsx` - Navigation with mobile menu and sticky behavior
- `components/Footer.tsx` - Site footer with links and contact info
- `components/PropertyCard.tsx` - Property listing card with details
- `components/ProjectCard.tsx` - Project showcase card
- `components/BlogCard.tsx` - Blog article preview card
- `components/SearchBar.tsx` - Advanced property search form
- `components/StatsCounter.tsx` - Animated statistics display
- `components/TestimonialCarousel.tsx` - Client testimonial slider

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 with App Router
- Uses App Router architecture (`app/layout.tsx`, `app/page.tsx`)
- TypeScript for type safety across all components
- Tailwind CSS v4 for styling with custom configuration

**State Management**: Zustand
- Lightweight, React-hooks-based state management
- Suitable for client-side state without Redux complexity

**Forms & Validation**: React Hook Form + Zod
- React Hook Form provides performant form handling with minimal re-renders
- Zod schemas ensure runtime type validation and form data validation
- Integration via `@hookform/resolvers` for seamless validation

**Animations**: Framer Motion
- Smooth, production-ready animations for UI interactions
- Enhances user experience for property browsing and transitions

**Internationalization**: next-intl
- Supports French language (primary) with potential for multi-language expansion
- Server-side and client-side translation capabilities

### Backend Architecture

**Runtime**: Next.js Server Components and API Routes
- Server Components for data fetching and rendering
- API Routes for backend endpoints (to be created in future phases)
- Server Actions enabled with 10MB body size limit for file uploads

**Database**: MongoDB with Mongoose ODM
- MongoDB provides flexible schema for diverse property types and content
- Mongoose ODM offers schema validation, type casting, and relationship management
- Connection pooling implemented via singleton pattern in `lib/db/mongodb.ts` to prevent connection exhaustion

**Data Models** (Created in Phase 1):
1. **Property** (`lib/models/Property.ts`): Core model for residential/commercial listings
   - Fields: title, description, price, location, type, rooms, bathrooms, area, images, status, featured
   - Indexes: `{type: 1, status: 1}`, `{featured: 1}`

2. **Project** (`lib/models/Project.ts`): Portfolio projects (ongoing/completed)
   - Fields: name, slug, description, location, yearCompleted, status, images, propertiesCount, type, featured
   - Indexes: `{slug: 1}`, `{status: 1, featured: 1}`

3. **BlogPost** (`lib/models/BlogPost.ts`): Content management for articles
   - Fields: title, slug, content, excerpt, author, featuredImage, category, published
   - Indexes: `{slug: 1}`, `{published: 1, createdAt: -1}`

4. **Partner** (`lib/models/Partner.ts`): Business partner information
   - Fields: name, logo, website, order
   - Index: `{order: 1}`

5. **Testimonial** (`lib/models/Testimonial.ts`): Client reviews
   - Fields: clientName, content, rating, projectReference, featured
   - Index: `{featured: 1, createdAt: -1}`

### Image Handling

**Sharp**: Server-side image optimization
- Automatic format conversion and resizing
- Reduces bandwidth and improves performance

**Next.js Image Configuration**:
- Remote patterns allow images from any HTTPS source
- Localhost domain for development
- Optimized delivery with Next.js Image component

### Development Considerations

**Port Configuration**: Application runs on port 5000 (customized from default 3000)
- Configured for both dev and production modes
- Bound to 0.0.0.0 for container/Replit compatibility

**Path Aliases**: TypeScript path mapping for clean imports
- `@/*` - Root level imports
- `@/components/*` - Component imports
- `@/lib/*` - Utility and library imports  
- `@/app/*` - App router specific imports

## Directory Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Homepage
├── lib/                   # Utilities and database
│   ├── db/
│   │   └── mongodb.ts     # MongoDB connection singleton
│   └── models/            # Mongoose schemas
│       ├── Property.ts
│       ├── Project.ts
│       ├── BlogPost.ts
│       ├── Partner.ts
│       └── Testimonial.ts
├── components/            # React components (to be created)
├── public/               # Static assets
└── styles/               # Global styles
```

## External Dependencies

### Database
- **MongoDB**: NoSQL database for storing properties, projects, blog posts, partners, and testimonials
- Connection string expected via `MONGODB_URI` environment variable (defaults to `mongodb://localhost:27017/ibm-immobiliere`)

### NPM Packages
- **Core Framework**: next@15.2.3, react@19.0.0, react-dom@19.0.0
- **Database**: mongodb@6.20.0, mongoose@8.19.0  
- **Forms**: react-hook-form@7.63.0, zod@4.1.11, @hookform/resolvers@5.2.2
- **UI/UX**: framer-motion@12.23.22, tailwindcss@4.0.15
- **State**: zustand@5.0.8
- **i18n**: next-intl@4.3.9
- **Images**: sharp@0.34.4

### Development Tools
- **TypeScript**: v5.8.2 for static typing
- **ESLint**: Next.js-configured linting rules
- **Next.js DevTools**: Built-in development experience

## Environment Variables

The following environment variables are required:

- `MONGODB_URI`: MongoDB connection string (default: `mongodb://localhost:27017/ibm-immobiliere`)
- `NEXT_PUBLIC_APP_URL`: Public URL of the application

## Next Steps

### Phase 2: Core Components Development
- Create layout components (Header/Navigation, Footer)
- Build reusable UI components (PropertyCard, ProjectCard, BlogCard, SearchBar, etc.)
- Implement animations with Framer Motion

### Phase 3: Page Development
- Homepage with hero, featured properties, projects, testimonials
- Properties listing and detail pages
- Projects listing and detail pages
- Blog listing and post pages
- About and Contact pages

### Phase 4: Advanced Features
- Search & filtering system
- Performance optimizations
- SEO & meta tags
- Animations & interactions

### Phase 5: Quality Assurance
- Responsiveness testing
- Accessibility compliance
- Cross-browser testing
- Performance metrics

### Phase 6: Deployment
- Deploy on Replit with custom domain
- Configure caching and monitoring
