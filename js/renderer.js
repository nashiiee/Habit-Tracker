// ============================
// RENDERING FUNCTIONS
// ============================

import { getCurrentMonth, getDaysInMonth, getCurrentDay } from './utils.js';
import { calculateCompletedTotal } from './habitManager.js';

export function updateMonthHeader() {
  const currentMonth = getCurrentMonth();
  
  // Update the month text to show current month and year
  const monthTextElement = document.querySelector('.month-text');
  if (monthTextElement) {
    monthTextElement.textContent = `${currentMonth.monthName} ${currentMonth.year}`;
  }
  
  // Keep the original month names (Jan, Feb, Mar, etc.) in the header
  // No need to change the months-container content
}

export function renderHabits(habits) {
  const currentMonth = getCurrentMonth();
  const daysInMonth = getDaysInMonth(currentMonth.month, currentMonth.year);
  
  let habitsHTML = "";

  habits.forEach((habit, habitIndex) => {
    // Generate day cells based on actual days in current month
    let dayCells = "";
    for (let day = 1; day <= daysInMonth; day++) {
      dayCells += `<div data-day="${day}" data-habit-index="${habitIndex}" class="day"></div>`;
    }
    
    // Add disabled cells for remaining days to maintain layout (if needed)
    for (let day = daysInMonth + 1; day <= 31; day++) {
      dayCells += `<div data-day="${day}" data-habit-index="${habitIndex}" class="day disabled"></div>`;
    }
    
    // Calculate completed total for this habit
    const completedTotal = calculateCompletedTotal(habit, daysInMonth);
    const totalText = `${completedTotal}/${daysInMonth}`;
    
    habitsHTML += `
      <tr class="habits js-habit-row">
      <td class="habits-text js-habits-text" data-habit-index="${habitIndex}">${habit.name}</td>
      <td class="habits-container">
        <div class="days-container">
          ${dayCells}
        </div>
      </td>
      <td class="total">${totalText}</td>
      </tr>
    `;
  });

  document.querySelector(".js-habits-list").innerHTML = habitsHTML;
}

export function updateHabitTotal(habits, habitIndex) {
  const currentMonth = getCurrentMonth();
  const daysInMonth = getDaysInMonth(currentMonth.month, currentMonth.year);
  const habit = habits[habitIndex];
  
  const completedTotal = calculateCompletedTotal(habit, daysInMonth);
  const totalText = `${completedTotal}/${daysInMonth}`;
  
  // Find the total cell for this habit and update it
  const habitRow = document.querySelector(`[data-habit-index="${habitIndex}"]`).closest('tr');
  const totalCell = habitRow.querySelector('.total');
  if (totalCell) {
    totalCell.textContent = totalText;
  }
}
