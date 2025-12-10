# Debtbox Admin Dashboard - Setup Guide

## Project Overview

This is a static template for the Debtbox Admin Dashboard. It's designed for business users to manage customers and merchants. The project uses the same tech stack and configuration as the main Debtbox application.

## Quick Start

1. **Install Dependencies**
   ```bash
   cd debtbox-admin
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Build for Production**
   ```bash
   pnpm build
   ```

## Project Structure

```
debtbox-admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # MainLayout, Navbar, Sidebar
│   │   ├── shared/         # Shared components (LanguageDropdown, etc.)
│   │   └── icons/          # Icon components
│   ├── features/           # Feature modules
│   │   ├── dashboard/     # Dashboard page
│   │   ├── customers/     # Customer management
│   │   ├── merchants/     # Merchant management
│   │   └── settings/      # Settings page
│   ├── routes/            # Route definitions
│   ├── stores/            # Zustand state management
│   ├── lib/               # Library configs (axios, react-query)
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── public/
│   └── locales/          # i18n translation files (en.json, ar.json)
└── Configuration files    # package.json, tsconfig, vite.config, etc.
```

## Features

### ✅ Implemented (Static Template)

- **Dashboard**: Overview page with statistics cards and quick actions
- **Customers**: Customer management page with search and table layout
- **Merchants**: Merchant management page with search and table layout
- **Settings**: Settings page with configuration sections
- **Layout**: Responsive sidebar and navbar with RTL support
- **Internationalization**: English and Arabic support
- **Routing**: Protected routes structure ready for authentication

### 🔄 To Be Integrated (Backend)

- Authentication and authorization
- API integration for data fetching
- Real-time data updates
- Form submissions and validations
- File uploads
- Advanced filtering and pagination

## Configuration

### Environment Variables

Create a `.env` file for API configuration:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### API Integration

The project is set up with:
- Axios configured in `src/lib/axios.ts`
- React Query configured in `src/lib/queryClient.ts`
- Type definitions ready in `src/types/`

To integrate with your backend:

1. Update `API_BASE_URL` in `src/utils/const.ts` or use environment variables
2. Create API hooks in feature folders using React Query
3. Replace static data with API calls

## Docker

### Development
```bash
docker-compose up app
```

### Production
```bash
docker-compose up production
```

Or build manually:
```bash
docker build --target production -t debtbox-admin .
docker run -p 80:80 debtbox-admin
```

## Deployment

The project includes:
- GitHub Actions workflow for automatic deployment to GitHub Pages
- Docker configuration for containerized deployment
- Nginx configuration for production serving

## Next Steps

1. **Initialize Git Repository**
   ```bash
   cd debtbox-admin
   git init
   git add .
   git commit -m "Initial commit: Admin dashboard template"
   ```

2. **Connect to Remote Repository**
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Backend Integration**
   - Update API endpoints in `src/utils/const.ts`
   - Create API hooks in feature folders
   - Implement authentication flow
   - Add form validations and submissions

4. **Customization**
   - Update branding and logos
   - Customize colors in `src/tailwind.css`
   - Add more features as needed

## Notes

- The project currently shows protected routes by default (static template)
- Authentication check is commented to allow viewing the template
- All data is currently static/mock data
- Ready for backend integration when available
