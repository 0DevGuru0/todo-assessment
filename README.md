# Todo Master - Advanced React Todo Application

A modern, feature-rich Todo application built with React, Redux Toolkit, React Query, TypeScript, and Tailwind CSS. This application demonstrates advanced state management, optimistic updates, drag-and-drop functionality, and modern UX patterns.

## 🚀 Features

### Core Functionality

- ✅ **View Todos**: Display todos fetched from DummyJSON API
- ✅ **Add Todos**: Create new todos with form validation using Zod
- ✅ **Delete Todos**: Remove todos with confirmation modal
- ✅ **Toggle Status**: Mark todos as completed/incomplete
- ✅ **Drag & Drop**: Reorder todos with smooth animations

### Advanced Features

- 🔍 **Search**: Real-time search through todo titles
- 🏷️ **Filtering**: Filter by All, Active, or Completed todos
- 📊 **Progress Tracking**: Visual progress indicator with motivational messages
- ⌨️ **Keyboard Shortcuts**: Efficient navigation and actions
- 🎨 **Animations**: Smooth transitions and micro-interactions
- 🔄 **Optimistic Updates**: Instant UI feedback with React Query
- 📱 **Responsive Design**: Works seamlessly on all device sizes

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Redux Toolkit** - Efficient state management with minimal boilerplate
- **React Query** - Server state management with caching and optimistic updates
- **Zod** - Runtime type validation and form schema validation
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **@dnd-kit** - Modern drag and drop library for React
- **React Hook Form** - Performant forms with easy validation
- **Heroicons** - Beautiful SVG icons
- **React Hot Toast** - Elegant toast notifications

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd todo-master
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Basic Operations

- **Add Todo**: Type in the input field and press Enter or click the + button
- **Toggle Completion**: Click on the checkbox or todo title
- **Delete Todo**: Click the trash icon and confirm deletion
- **Reorder**: Drag todos by the grip handle to reorder them

### Advanced Features

- **Search**: Use the search bar to filter todos by title
- **Filter**: Click filter buttons to show All, Active, or Completed todos
- **Keyboard Shortcuts**: Press `?` to see available shortcuts:
  - `a` - Show all todos
  - `c` - Show completed todos
  - `i` - Show incomplete todos
  - `/` - Focus search input
  - `Escape` - Clear search
  - `?` - Toggle help modal

### Progress Tracking

- View completion percentage and motivational messages
- Visual progress bar with animated effects
- Celebration when all todos are completed

## 🏗️ Architecture

### State Management

- **Redux Toolkit**: Global state for todos, filters, and search
- **React Query**: Server state management with automatic caching
- **Local Component State**: UI-specific state (modals, forms)

### Data Flow

1. **Fetch**: React Query fetches todos from API
2. **Cache**: Data is cached and synchronized with Redux
3. **Optimistic Updates**: UI updates immediately, then syncs with server
4. **Error Handling**: Graceful error handling with toast notifications

### Component Structure

```
src/
├── components/
│   ├── AddTodo.tsx          # Todo creation form
│   ├── TodoItem.tsx         # Individual todo item
│   ├── TodoList.tsx         # List with drag & drop
│   ├── TodoFilters.tsx      # Search and filter controls
│   ├── ProgressIndicator.tsx # Progress tracking
│   └── KeyboardShortcuts.tsx # Help and shortcuts
├── hooks/
│   ├── redux.ts             # Typed Redux hooks
│   └── useTodos.ts          # React Query hooks
├── store/
│   ├── index.ts             # Redux store configuration
│   └── todoSlice.ts         # Todo slice with actions
├── services/
│   └── todoApi.ts           # API service layer
├── types/
│   └── todo.ts              # TypeScript types and Zod schemas
└── lib/
    └── queryClient.ts       # React Query configuration
```

## 🧪 API Integration

The application integrates with the DummyJSON API:

- **GET** `/todos` - Fetch all todos
- **POST** `/todos/add` - Create new todo
- **PUT** `/todos/{id}` - Update todo
- **DELETE** `/todos/{id}` - Delete todo

All API calls include error handling and optimistic updates for the best user experience.

## 🎨 Design System

### Colors

- **Primary**: Blue (600, 700) for actions and focus states
- **Success**: Green (500, 600) for completed states
- **Error**: Red (500, 600) for errors and destructive actions
- **Neutral**: Gray scale for text and backgrounds

### Animations

- **Fade In**: Smooth content loading
- **Slide Up**: Element entrance animations
- **Bounce In**: Modal and notification animations
- **Drag Effects**: Visual feedback during drag operations

### Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured experience with keyboard shortcuts

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading for optimal bundle size
- **Memoization**: React.memo and useMemo for expensive calculations
- **Optimistic Updates**: Instant UI feedback without waiting for server
- **Efficient Re-renders**: Selective state updates and component optimization
- **Image Optimization**: Optimized assets and lazy loading

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (if configured)

## 📝 Assessment Criteria Fulfilled

✅ **Viewing Todos**: Complete with loading states and error handling  
✅ **Adding Todos**: Form validation with Zod, optimistic updates  
✅ **Deleting Todos**: Confirmation modal prevents accidental deletion  
✅ **Toggling Status**: Visual feedback with strikethrough and colors  
✅ **Drag & Drop**: Smooth reordering with visual feedback  
✅ **State Management**: Redux Toolkit with proper actions and reducers  
✅ **Data Fetching**: React Query with caching and error handling  
✅ **Styling**: Tailwind CSS with responsive design  
✅ **TypeScript**: Complete type safety throughout the application

### Bonus Features Implemented

🎉 **Filtering**: Filter todos by completion status  
🎉 **Search**: Real-time search functionality  
🎉 **Animations**: Smooth drag-and-drop and UI animations  
🎉 **Optimistic Updates**: Instant UI feedback with React Query  
🎉 **Progress Tracking**: Visual progress indicator  
🎉 **Keyboard Shortcuts**: Power user features  
🎉 **Toast Notifications**: User feedback for all actions  
🎉 **Responsive Design**: Works on all device sizes

## 🤝 Contributing

This is an assessment project, but contributions and suggestions are welcome!

## 📄 License

This project is created for assessment purposes.
