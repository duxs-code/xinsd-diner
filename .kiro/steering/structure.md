# Project Structure

## Directory Organization

```
xinsd-diner/
├── app/                       # Next.js App Router
│   ├── api/v1/               # API routes (RESTful structure)
│   │   ├── categories/       # Category management endpoints
│   │   ├── menu/             # Menu item management endpoints
│   │   ├── recipes/          # Recipe generation endpoints
│   │   ├── ai/               # AI image generation endpoints
│   │   ├── images/           # Image management endpoints
│   │   ├── upload/           # File upload endpoints
│   │   └── admin/            # Admin utilities (cleanup, etc.)
│   ├── checkout/             # Recipe generation page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout component
│   ├── loading.tsx           # Global loading component
│   └── page.tsx              # Main page (ingredient browsing)
├── components/               # React components
│   ├── ui/                   # Base UI components (shadcn/ui)
│   ├── *-dialog.tsx          # Modal dialogs for CRUD operations
│   ├── menu-item-card.tsx    # Ingredient card component
│   ├── floating-cart.tsx     # Shopping cart floating button
│   └── image-cropper.tsx     # Image cropping utility
├── contexts/                 # React Context providers
│   ├── cart-context.tsx      # Shopping cart state management
│   └── menu-context.tsx      # Menu/ingredient state management
├── lib/                      # Utility libraries and configurations
│   ├── database-sqlite.ts    # SQLite database operations
│   ├── api-utils-sqlite.ts   # Database API utilities
│   ├── api-types.ts          # API response type definitions
│   ├── image-manager.ts      # Image lifecycle management
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # General utility functions
├── hooks/                    # Custom React hooks
├── data/                     # Database files
│   └── fresh_market.db       # SQLite database
├── public/uploads/           # Image storage
│   ├── temp/                 # Temporary AI-generated images
│   ├── recipes/              # Recipe images (moved from temp)
│   ├── items/                # Ingredient images
│   └── categories/           # Category images
└── scripts/                  # Utility scripts
    ├── init-database.js      # Database initialization
    ├── cleanup-images.js     # Image cleanup utility
    └── test-*.js             # Various test scripts
```

## Architectural Patterns

### API Structure
- **RESTful Design**: `/api/v1/{resource}/{action?}`
- **Consistent Response Format**: All APIs return standardized JSON responses
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Database Abstraction**: Database operations isolated in `lib/database-sqlite.ts`

### Component Architecture
- **Atomic Design**: Base UI components in `components/ui/`
- **Business Components**: Feature-specific components in `components/`
- **Context Providers**: Global state management via React Context
- **Custom Hooks**: Reusable logic in `hooks/`

### File Naming Conventions
- **Components**: kebab-case with `.tsx` extension (`menu-item-card.tsx`)
- **API Routes**: RESTful structure with `route.ts` files
- **Utilities**: kebab-case with descriptive names (`api-utils-sqlite.ts`)
- **Types**: Centralized in `lib/types.ts` and `lib/api-types.ts`

### Database Design
- **SQLite**: Single file database (`data/fresh_market.db`)
- **Normalized Schema**: Proper foreign key relationships
- **Indexed Queries**: Performance-optimized with strategic indexes
- **Transaction Safety**: Critical operations wrapped in transactions

### Image Management
- **Lifecycle Management**: Temp → Permanent → Cleanup workflow
- **Directory Structure**: Organized by type (recipes, items, categories, temp)
- **Database Tracking**: All images tracked in `images` table
- **Automatic Cleanup**: Scheduled cleanup of unused temporary images

## Code Organization Rules

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Internal utilities (`@/lib/*`)
4. Components (`@/components/*`)
5. Types (`@/lib/types`)

### Component Structure
```typescript
// 1. Imports
// 2. Type definitions
// 3. Component props interface
// 4. Component implementation
// 5. Default export
```

### API Route Structure
```typescript
// 1. Imports
// 2. Handler function with proper HTTP method
// 3. Database operations via queries object
// 4. Standardized response format
```

### Database Operations
- **Centralized Queries**: All database operations in `queries` object
- **Type Safety**: Proper TypeScript interfaces for all data
- **Error Handling**: Consistent error messages and types
- **Performance**: Prepared statements and proper indexing