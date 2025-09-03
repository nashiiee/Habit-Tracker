// ============================
// MAIN APPLICATION
// ============================

import { loadFromStorage } from './utils.js';
import { markPastDaysAsMissed, restoreDayStates } from './dayManager.js';
import { renderHabits, updateMonthHeader } from './renderer.js';
import { addHabitClickListeners, addDayClickListeners } from './eventListeners.js';
import { showAddHabitModal } from './modalManager.js';

class HabitTracker {
  constructor() {
    this.habits = loadFromStorage();
    this.initialize();
  }

  initialize() {
    // Update month header with current month info
    updateMonthHeader();
    
    // Render initial state
    this.renderApp();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  renderApp() {
    // Mark past days as missed before rendering
    markPastDaysAsMissed(this.habits);
    
    // Render the habits table
    renderHabits(this.habits);
    
    // Add click listeners to habit names
    addHabitClickListeners(this.habits, () => this.onHabitsChanged());
    
    // Add click listeners to day cells and restore their states
    addDayClickListeners(this.habits, (habitIndex, dayNumber, newState) => {
      this.onDayChanged(habitIndex, dayNumber, newState);
    });
    
    // Restore day states from localStorage
    restoreDayStates(this.habits);
  }

  setupEventListeners() {
    const addButton = document.querySelector('.js-add-button');
    
    if (addButton) {
      addButton.addEventListener('click', () => {
        showAddHabitModal(this.habits, () => this.onHabitsChanged());
      });
    } else {
      console.error('Add button not found!');
    }
  }

  onHabitsChanged() {
    // Re-render everything when habits are added/deleted
    this.renderApp();
  }

  onDayChanged(habitIndex, dayNumber, newState) {
    // Handle day state changes if needed
    console.log(`Habit ${habitIndex}, Day ${dayNumber} changed to: ${newState}`);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new HabitTracker();
});
