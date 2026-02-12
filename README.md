# Tarix Bus Ticketing System - Complete Application

A modern, full-featured bus ticketing application built with React, TypeScript, and Tailwind CSS. This is a pixel-perfect recreation of the Tarix ticketing interface.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Zustand** - State management
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form validation and management
- **date-fns** - Date manipulation and formatting

## 🎨 Features

### ✅ Complete Page Implementation
- **Header Component** - Sticky navigation with user profile banner
- **Search Filters Sidebar** - Desktop sidebar with all filter options
- **Trip Cards** - Detailed trip information with pricing
- **Pagination** - Navigate through multiple pages of trips
- **Mobile Responsive** - Fully responsive with mobile filter modal
- **State Management** - Zustand for global state
- **Form Validation** - React Hook Form with error handling
- **Type Safety** - Full TypeScript coverage

### ✅ Design Features
- Pixel-perfect recreation of the original design
- Smooth animations and transitions
- Hover states and micro-interactions
- Responsive breakpoints (mobile, tablet, desktop)
- Accessible form inputs
- Professional color palette

## 📁 Project Structure

> **Note:** The project has been restructured to use a module-based architecture for better scalability and maintainability.

```
Tarix-header/
├── src/
│   ├── modules/
│   │   └── ticketer/              # Ticketer feature module
│   │       ├── components/
│   │       │   ├── cards/
│   │       │   │   └── TripCard.tsx       # Trip display cards
│   │       │   └── forms/
│   │       │       ├── SearchForm.tsx     # Search filter form
│   │       │       └── MobileSearchButton.tsx  # Mobile filter modal
│   │       ├── store/
│   │       │   └── useBookingStore.ts     # Zustand state management
│   │       ├── views/
│   │       │   └── TicketerDashboard.tsx  # Main ticketer view
│   │       ├── types/
│   │       │   └── index.ts               # Module-specific types
│   │       ├── hooks/                     # Feature hooks (future)
│   │       └── TicketerModule.tsx         # Module exports
│   ├── shared/                    # Shared across all modules
│   │   ├── components/
│   │   │   ├── Header.tsx         # App header
│   │   │   └── Pagination.tsx     # Pagination controls
│   │   ├── types/
│   │   │   └── index.ts           # Shared types (User, etc.)
│   │   └── utils/
│   │       └── useDateFormat.ts   # Date formatting utilities
│   ├── routes/
│   │   └── index.tsx              # React Router config
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── DEPENDENCY_GUIDE.md            # Detailed usage guide
└── README.md                      # This file
```

## 🎯 Components Overview

### Header Component
- Logo and navigation links
- Cashback promotion button
- Wallet balance display
- User profile banner with gradient
- Sticky positioning
- Fully responsive

### SearchForm Component
- From/To location inputs
- Departure date picker
- Passenger count selector
- Bus type dropdown
- Form validation with error messages
- Integrates with Zustand store

### TripCard Component
- Departure date and time
- Route information (origin → destination)
- Available seats indicator
- Pricing display
- Select button
- Responsive grid layout

### Pagination Component
- Current page indicator
- Previous/Next navigation
- Disabled states
- Page count display

### MobileSearchButton Component
- Floating action button on mobile
- Full-screen modal on mobile/tablet
- Hidden on desktop (≥1024px)

## 🔧 Key Features Explained

### 1. Responsive Layout
- **Desktop (≥1024px)**: Sidebar + main content
- **Tablet (768px-1023px)**: Full-width with floating filter button
- **Mobile (<768px)**: Stacked layout with modal filters

### 2. State Management (Zustand)
```typescript
// Access user data
const user = useBookingStore((state) => state.user);

// Update search filters
const setSearchFilters = useBookingStore((state) => state.setSearchFilters);
setSearchFilters({ from: 'Lagos', to: 'Abuja' });
```

> **Note:** The store has been renamed from `useAppStore` to `useBookingStore` for better clarity.

### 3. Form Validation (React Hook Form)
```typescript
const { register, handleSubmit, formState: { errors } } = useForm();

<input
  {...register('from', { required: 'Origin is required' })}
/>
{errors.from && <span>{errors.from.message}</span>}
```

### 4. Date Formatting (date-fns)
```typescript
const { formatDate, formatTime } = useDateFormat();
formatDate(trip.departureDate); // "Tue, 11th Nov 2025"
formatTime(trip.departureTime); // "7:30 AM"
```

## 🎨 Design System

### Colors
```javascript
'primary-blue': '#0095FF',      // Primary actions
'cashback-green': '#00D665',    // Promotions
'gradient-blue-light': '#40A8FF', // Gradient start
'gradient-blue-dark': '#1E7BCC',  // Gradient end
'text-dark': '#212121',         // Primary text
'text-gray': '#757575',         // Secondary text
'border-gray': '#E5E5E5',       // Borders
```

### Typography
- **Headings**: Manrope (600, 700, 800)
- **Body**: DM Sans (400, 500, 700)
- **Sizes**: 11px (labels) → 32px (large headings)

### Spacing
- Form fields: 20px vertical gap
- Cards: 16px gap
- Sections: 24px padding

## 📱 Responsive Breakpoints

```css
sm: 640px   // Small devices
md: 768px   // Medium devices  
lg: 1024px  // Large devices (sidebar appears)
xl: 1280px  // Extra large devices
```

## 🚀 Next Steps

### Potential Enhancements
1. **Backend Integration**
   - Connect to real API for trips
   - Implement authentication
   - Add booking functionality

2. **Additional Pages**
   - Trip details page
   - Booking confirmation
   - User profile
   - Payment integration

3. **Features**
   - Real-time seat availability
   - Price filtering
   - Sort options
   - Trip comparison
   - Favorites/saved trips

### Example: Adding Backend Integration

```typescript
// In HomePage.tsx
import { useEffect } from 'react';

const HomePage = () => {
  const setAvailableTrips = useAppStore((state) => state.setAvailableTrips);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/trips');
        const data = await response.json();
        setAvailableTrips(data);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // ... rest of component
};
```

## 🧪 Testing

```bash
# Run tests (when configured)
npm run test

# Type checking
npm run type-check
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist/` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Configure in repository settings
- **Your own server**: Upload `dist/` contents

## 📚 Documentation

- [Complete Dependency Guide](./DEPENDENCY_GUIDE.md) - Detailed usage for all libraries
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)

## 🎯 Key Learnings

This project demonstrates:
- ✅ Building pixel-perfect UI from designs
- ✅ Modern React patterns with hooks
- ✅ TypeScript for type safety
- ✅ State management with Zustand
- ✅ Form handling with validation
- ✅ Responsive design principles
- ✅ Component composition
- ✅ Clean code architecture

## 📄 License

MIT
