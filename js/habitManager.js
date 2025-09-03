// ============================
// HABIT MANAGEMENT
// ============================

import { saveToStorage } from './utils.js';

export function addHabit(habits, habitName) {
  if (habitName.trim() === "") {
    return false;
  }

  const newHabit = {
    name: habitName.trim(),
    days: {} // Initialize empty days object for tracking day states
  };

  habits.push(newHabit);
  saveToStorage(habits);
  return true;
}

export function deleteHabit(habits, habitIndex) {
  if (habitIndex >= 0 && habitIndex < habits.length) {
    habits.splice(habitIndex, 1);
    saveToStorage(habits);
    return true;
  }
  return false;
}

export function calculateCompletedTotal(habit, daysInMonth) {
  if (!habit.days) return 0;
  
  let completedCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    if (habit.days[day.toString()] === 'completed') {
      completedCount++;
    }
  }
  return completedCount;
}
