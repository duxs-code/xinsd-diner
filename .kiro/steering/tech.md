# Technology Stack

## Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context (CartContext, MenuContext)
- **Icons**: Lucide React
- **Markdown**: ReactMarkdown for recipe rendering
- **Image Handling**: Next.js Image component with unoptimized images

## Backend
- **API**: Next.js API Routes (`/api/v1/*`)
- **Database**: SQLite with better-sqlite3
- **File Storage**: Local filesystem (`public/uploads/`)
- **AI Services**: 
  - Alibaba Cloud Qwen AI (image generation)
  - Google Gemini (recipe generation)

## Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + TypeScript
- **Build**: Next.js build system
- **Environment**: Node.js 18+

## Common Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Database
npm run init:db                # Initialize database structure and data
npm run test:db                # Test database connection

# Testing
npm run test:api               # Test API functionality
npm run test:gemini            # Test Google Gemini API
npm run test:qwen              # Test Qwen AI image generation
npm run test:integration       # Run integration tests
npm run test:all               # Run all tests

# Maintenance
npm run cleanup:images         # Clean up unused images
npm run validate:config        # Validate environment configuration

# Deployment
npm run deploy                 # Deploy using deploy script
```

## Configuration

### Environment Variables
```env
# AI Services (Required for AI features)
QWEN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Image Storage (Optional - has defaults)
UPLOAD_BASE_PATH=uploads
TEMP_IMAGES_PATH=temp
RECIPE_IMAGES_PATH=recipes
ITEM_IMAGES_PATH=items
CATEGORY_IMAGES_PATH=categories

# Application
NODE_ENV=development|production
```

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to project root
- ES6 target with ESNext modules
- JSX preserve for Next.js processing

### Next.js Configuration
- ESLint and TypeScript errors ignored during builds (for development speed)
- Images unoptimized (for local file serving)
- App Router architecture