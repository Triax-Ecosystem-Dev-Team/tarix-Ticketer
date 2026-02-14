# Tarix Bus Ticketing System - Complete Application

A modern, full-featured bus ticketing application built with React, TypeScript, and Tailwind CSS. This is a pixel-perfect recreation of the Tarix ticketing interface with advanced features including real-time bus tracking, interactive booking flows, and comprehensive fleet management.

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

### ✅ Complete Implementation

#### Dashboard & Trip Booking
- **Header Component** - Sticky navigation with user profile banner
- **Search Filters Sidebar** - Desktop sidebar with all filter options
- **Trip Cards** - Detailed trip information with pricing and hover effects
- **Pagination** - Navigate through multiple pages of trips
- **Mobile Responsive** - Fully responsive with mobile filter modal

#### 🚌 Bus Status & Management (NEW)
- **Real-time Fleet Tracking** - Monitor all active buses with status indicators (Active, In Transit, Completed, Delayed, Cancelled)
- **Visual Occupancy Indicators** - Linear gradient progress bars (`#22C55E` → `#F59E0B`) showing seat capacity in real-time
- **Live Updates Widget** - Sticky floating notification card providing real-time trip updates
- **Advanced Filtering** - Filter by status, search by bus number/route/driver
- **Export Functionality** - Export bus data for reporting
- **Custom Blue Header** - Dedicated header for Bus Status page with white logo variant

#### 🎫 Complete Booking Flow (NEW)
1. **User Identification** - Secure passenger verification step with form validation
2. **Passenger Details** - Collect passenger information with React Hook Form
3. **Interactive Seat Selection** - Grid-based seat map with:
   - Driver position indicator
   - Booked/Available/Selected states
   - Visual feedback for seat interactions
   - Amenity selection (AC, Toilet, Charging Port)
4. **Extra Baggage** - Optional baggage addition with pricing
5. **Payment Method** - Multiple payment options (Wallet, Card, Transfer)
6. **Booking Confirmation** - Review all details before final confirmation
7. **Success Page** - Booking confirmation with:
   - Ticket reference copying
   - Print ticket functionality
   - Download ticket as text file
   - Trip summary and next steps

#### 📊 Analytics & Overview (NEW)
- **Sales Overview Modal** - Quick snapshot of:
  - Total tickets sold
  - Payment method breakdown (Cash, Transfer, Card) with specific colors
  - Total revenue calculation
- **Cashback Promotion** - Interactive modal for cashback information

### ✅ Design Features
- Pixel-perfect recreation of the original design
- Smooth animations and transitions
- Hover states and micro-interactions
- Responsive breakpoints (mobile, tablet, desktop)
- Accessible form inputs
- Professional color palette with custom gradients
- Print-optimized layouts for ticket printing

## 📁 Project Structure

> **Note:** The project has been restructured to use a module-based architecture for better scalability and maintainability.

```
tarix-ticketer/
├── src/
│   ├── modules/
│   │   └── ticketer/              # Ticketer feature module
│   │       ├── components/
│   │       │   ├── cards/
│   │       │   │   ├── TripCard.tsx          # Trip display cards
│   │       │   │   └── BusStatusCard.tsx     # Bus status cards (NEW)
│   │       │   ├── seat-map/
│   │       │   │   └── SeatMap.tsx           # Interactive seat selector (NEW)
│   │       │   ├── forms/
│   │       │   │   ├── SearchForm.tsx        # Search filter form
│   │       │   │   └── MobileSearchButton.tsx # Mobile filter modal
│   │       │   ├── modals/
│   │       │   │   ├── CashbackModal.tsx     # Cashback promotion (NEW)
│   │       │   │   └── TicketModal.tsx       # Ticket display/print (NEW)
│   │       │   ├── SalesOverviewModal.tsx    # Sales stats (NEW)
│   │       │   └── LiveUpdates.tsx           # Real-time updates (NEW)
│   │       ├── store/
│   │       │   └── useBookingStore.ts        # Zustand state management
│   │       ├── views/
│   │       │   ├── TicketerDashboard.tsx     # Main dashboard
│   │       │   ├── BusStatusPage.tsx         # Bus management (NEW)
│   │       │   ├── UserIdentification.tsx    # Booking flow (NEW)
│   │       │   ├── PassengerDetails.tsx      # Booking flow (NEW)
│   │       │   ├── SeatSelection.tsx         # Booking flow (NEW)
│   │       │   ├── ExtraBaggage.tsx          # Booking flow (NEW)
│   │       │   ├── PaymentMethod.tsx         # Booking flow (NEW)
│   │       │   ├── BookingConfirmation.tsx   # Booking flow (NEW)
│   │       │   └── BookingSuccess.tsx        # Booking flow (NEW)
│   │       ├── data/
│   │       │   └── busStatusData.ts          # Mock bus data (NEW)
│   │       ├── types/
│   │       │   └── index.ts                  # Module-specific types
│   │       ├── hooks/                        # Feature hooks
│   │       └── TicketerModule.tsx            # Module exports
│   ├── shared/                    # Shared across all modules
│   │   ├── components/
│   │   │   ├── Header.tsx         # App header (Dashboard only)
│   │   │   └── Pagination.tsx     # Pagination controls
│   │   ├── types/
│   │   │   └── index.ts           # Shared types (User, etc.)
│   │   └── utils/
│   │       └── useDateFormat.ts   # Date formatting utilities
│   ├── assets/
│   │   └── images/
│   │       ├── logo.webp          # Main logo
│   │       └── logo-white.webp    # White logo variant (NEW)
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
- Cashback promotion button with modal
- Wallet balance display
- Sales Overview button (links to modal)
- User profile banner with gradient
- Sticky positioning
- Fully responsive
- **Note:** Now only renders on Dashboard page

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
- Select button (navigates to booking flow)
- Responsive grid layout
- Hover effects with border color transition

### BusStatusCard Component (NEW)
- Bus reference ID with status badge
- Route visualization with arrow
- Departure/Arrival times in separate cards
- Bus Type and Driver information
- **Gradient Occupancy Bar** - Visual indicator using `linear-gradient(90deg, #22C55E 0%, #F59E0B 100%)`
- Passenger count with "View List" action
- "View Details" and "Manage" buttons
- Hover effects (blue border + enhanced shadow)

### SeatMap Component (NEW)
- Grid-based layout representing bus interior
- Driver position indicator (top-left)
- Seat states: Available, Booked, Selected
- Click to select/deselect seats
- Visual feedback for interactions
- Prevents selection of booked seats
- Displays selected seat count

### LiveUpdates Component (NEW)
- Fixed positioning (bottom-right of viewport)
- Scrolls with page
- Real-time update notifications for buses
- Pulsing green indicator dot
- Recent activity feed

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

// Booking flow state
const booking = useBookingStore((state) => state.booking);
const setSelectedSeats = useBookingStore((state) => state.setSelectedSeats);
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

### 5. Print Functionality (NEW)
```typescript
const handlePrint = () => {
  window.print(); // Triggers browser print dialog
};

// Print-specific styles using Tailwind
<div className="print:hidden">Won't appear in print</div>
<div className="print:block hidden">Only appears in print</div>
```

## 🎨 Design System

### Colors
```javascript
'primary-blue': '#0095FF',      // Primary actions, links
'cashback-green': '#00D665',    // Promotions, success states
'gradient-blue-light': '#40A8FF', // Gradient start
'gradient-blue-dark': '#1E7BCC',  // Gradient end
'text-dark': '#212121',         // Primary text
'text-gray': '#757575',         // Secondary text
'border-gray': '#E5E5E5',       // Borders

// NEW: Bus Status Colors
'status-green': '#22C55E',      // Active buses, gradient start
'status-amber': '#F59E0B',      // Gradient end (capacity)
```

### Typography
- **Headings**: Manrope (600, 700, 800)
- **Body**: DM Sans (400, 500, 700)
- **Sizes**: 11px (labels) → 32px (large headings)

### Spacing
- Form fields: 20px vertical gap
- Cards: 16px gap
- Sections: 24px padding
- Bus Status Grid: 24px gap

### Custom Gradients
```css
/* Occupancy Bar */
background: linear-gradient(90deg, #22C55E 0%, #F59E0B 100%);

/* User Profile Banner */
background: linear-gradient(to right, #1E7BCC, #40A8FF);
```

## 📱 Responsive Breakpoints

```css
sm: 640px   // Small devices
md: 768px   // Medium devices  
lg: 1024px  // Large devices (sidebar appears)
xl: 1280px  // Extra large devices
```

## 🚀 Routing Structure

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <TicketerDashboard /> },
      
      // Booking Flow
      { path: 'booking/identify', element: <UserIdentification /> },
      { path: 'booking/passenger-details', element: <PassengerDetails /> },
      { path: 'booking/select-seat', element: <SeatSelection /> },
      { path: 'booking/baggage', element: <ExtraBaggage /> },
      { path: 'booking/payment', element: <PaymentMethod /> },
      { path: 'booking/confirmation', element: <BookingConfirmation /> },
      { path: 'booking/success', element: <BookingSuccess /> },
      
      // Management
      { path: 'bus-status', element: <BusStatusPage /> },
    ],
  },
]);
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
- ✅ Multi-step form flows
- ✅ Print-friendly layouts
- ✅ Real-time data visualization
- ✅ Complex state management across routes

