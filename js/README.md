# JavaScript Modules Structure

This project uses a modular JavaScript architecture for better organization and maintainability.

## 📁 Module Structure

### `app.js` - Main Application Controller
- **Purpose**: Entry point and main application orchestration
- **Key Features**:
  - Initializes the habit tracker
  - Coordinates all modules
  - Handles app-wide state management
  - Sets up main event listeners

### `utils.js` - Utility Functions
- **Purpose**: Common utility functions used across modules
- **Key Features**:
  - Date handling (`getCurrentMonth`, `getCurrentDay`, `getDaysInMonth`)
  - LocalStorage operations (`saveToStorage`, `loadFromStorage`)
  - Pure functions with no side effects

### `habitManager.js` - Habit CRUD Operations
- **Purpose**: Manages habit creation, deletion, and calculations
- **Key Features**:
  - `addHabit()` - Creates new habits
  - `deleteHabit()` - Removes habits
  - `calculateCompletedTotal()` - Calculates completion statistics

### `dayManager.js` - Day State Management
- **Purpose**: Handles day-by-day tracking and state changes
- **Key Features**:
  - `markPastDaysAsMissed()` - Auto-marks past days as missed
  - `toggleDayState()` - Cycles through empty → completed → missed
  - `updateDayCell()` - Updates UI for day cells
  - `restoreDayStates()` - Restores states from localStorage

### `modalManager.js` - Modal Functionality
- **Purpose**: Handles all modal interactions
- **Key Features**:
  - `showAddHabitModal()` - Add habit modal
  - `showDeleteConfirmModal()` - Delete confirmation modal
  - Modal event handling and cleanup

### `renderer.js` - Rendering Functions
- **Purpose**: Handles UI rendering and updates
- **Key Features**:
  - `renderHabits()` - Renders the habit table
  - `updateMonthHeader()` - Updates month/year display
  - `updateHabitTotal()` - Updates completion totals

### `eventListeners.js` - Event Management
- **Purpose**: Manages DOM event listeners
- **Key Features**:
  - `addHabitClickListeners()` - Habit deletion clicks
  - `addDayClickListeners()` - Day cell interactions
  - Past day handling and restrictions

### `index.js` - Module Exports
- **Purpose**: Central export file for easy importing
- **Key Features**:
  - Re-exports all module functions
  - Provides clean import interface

## 🔄 Data Flow

```
app.js (Main Controller)
  ↓
├── utils.js (Data & Utilities)
├── habitManager.js (Habit Operations)
├── dayManager.js (Day State Logic)
├── modalManager.js (UI Modals)
├── renderer.js (UI Rendering)
└── eventListeners.js (User Interactions)
```

## 🚀 Benefits

- **Separation of Concerns**: Each module has a specific responsibility
- **Maintainability**: Easy to find and modify specific functionality
- **Reusability**: Functions can be imported where needed
- **Testing**: Individual modules can be tested in isolation
- **Scalability**: Easy to add new features without affecting existing code

## 📝 Usage

The modules use ES6 imports/exports. Make sure to serve the files from a web server (not file://) for modules to work properly.
