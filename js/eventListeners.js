// ============================
// EVENT LISTENERS
// ============================

import { getCurrentDay, saveToStorage } from './utils.js';
import { toggleDayState, updateDayCell } from './dayManager.js';
import { showDeleteConfirmModal } from './modalManager.js';
import { updateHabitTotal } from './renderer.js';

export function addHabitClickListeners(habits, onHabitsChanged) {
  const habitTexts = document.querySelectorAll('.js-habits-text');
  
  habitTexts.forEach((habitText) => {
    // Add visual indicator that it's clickable
    habitText.style.cursor = 'pointer';
    habitText.style.transition = 'background-color 0.2s ease';
    
    habitText.addEventListener('click', (e) => {
      const habitIndex = parseInt(e.target.getAttribute('data-habit-index'));
      const habitName = habits[habitIndex].name;
      
      showDeleteConfirmModal(habits, habitName, habitIndex, onHabitsChanged);
    });
    
    // Add hover effect
    habitText.addEventListener('mouseenter', () => {
      habitText.style.backgroundColor = '#ffebee';
    });
    
    habitText.addEventListener('mouseleave', () => {
      habitText.style.backgroundColor = '';
    });
  });
}

export function addDayClickListeners(habits, onDayChanged) {
  const currentDay = getCurrentDay();
  
  document.querySelectorAll('.day').forEach((dayCell) => {
    // Skip disabled cells (days beyond current month)
    if (dayCell.classList.contains('disabled')) {
      return;
    }
    
    const dayNumber = parseInt(dayCell.dataset.day);
    const habitIndex = parseInt(dayCell.dataset.habitIndex);
    
    // If this is a past day, make it non-clickable and add past-day class
    if (dayNumber < currentDay) {
      dayCell.classList.add('past-day');
      return; // Don't add click listener for past days
    }
    
    dayCell.addEventListener('click', () => {
      const newState = toggleDayState(habits, habitIndex, dayNumber);
      updateDayCell(dayCell, newState);
      
      // Save to localStorage
      saveToStorage(habits);
      
      // Update the total count for this habit
      updateHabitTotal(habits, habitIndex);
      
      // Notify parent if needed
      if (onDayChanged) {
        onDayChanged(habitIndex, dayNumber, newState);
      }
    });
  });
}
