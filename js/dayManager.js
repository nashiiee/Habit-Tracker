// ============================
// DAY STATE MANAGEMENT
// ============================

import { getCurrentDay, saveToStorage } from './utils.js';

export function markPastDaysAsMissed(habits) {
  const currentDay = getCurrentDay();
  
  habits.forEach((habit, habitIndex) => {
    if (!habit.days) {
      habit.days = {};
    }
    
    // Check all days from 1 to current day - 1 (yesterday and before)
    for (let day = 1; day < currentDay; day++) {
      const dayKey = day.toString();
      
      // If the day has no state (undefined), mark it as missed
      if (!habit.days[dayKey]) {
        habit.days[dayKey] = 'missed';
        console.log(`Day ${day} automatically marked as missed for habit: ${habit.name}`);
      }
    }
  });
  
  // Save the updated data
  saveToStorage(habits);
}

export function updateDayCell(dayCell, state) {
  // Clear all states first
  dayCell.classList.remove('completed', 'missed');
  dayCell.innerText = '';
  
  if (state === 'completed') {
    dayCell.classList.add('completed');
    // Don't set innerText - let CSS ::after handle the display
  } else if (state === 'missed') {
    dayCell.classList.add('missed');
    // Don't set innerText - let CSS ::after handle the display
  }
  // For 'empty' state, just leave it cleared
}

export function toggleDayState(habits, habitIndex, dayNumber) {
  const habit = habits[habitIndex];
  if (!habit.days) {
    habit.days = {};
  }
  
  const currentState = habit.days[dayNumber.toString()];
  
  // Cycle through states: empty -> completed -> missed -> empty
  if (currentState === 'completed') {
    // Currently completed, change to missed
    habit.days[dayNumber.toString()] = 'missed';
    console.log(`Day ${dayNumber} marked as missed`);
    return 'missed';
  } else if (currentState === 'missed') {
    // Currently missed, change to empty
    delete habit.days[dayNumber.toString()];
    console.log(`Day ${dayNumber} cleared`);
    return 'empty';
  } else {
    // Currently empty, change to completed
    habit.days[dayNumber.toString()] = 'completed';
    console.log(`Day ${dayNumber} marked as completed`);
    return 'completed';
  }
}

export function restoreDayStates(habits) {
  habits.forEach((habit, habitIndex) => {
    if (!habit.days) return;
    
    Object.entries(habit.days).forEach(([dayNumber, state]) => {
      const dayCell = document.querySelector(`[data-day="${dayNumber}"][data-habit-index="${habitIndex}"]`);
      if (dayCell) {
        updateDayCell(dayCell, state);
      }
    });
  });
}
