const habits = JSON.parse(localStorage.getItem('habits')) || [
  {
    name: "Wake up Early (6am)",
    days: {} // Track day states: { "1": "completed", "2": "missed", etc. }
  },
];

function renderHabits() {
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
  
  // Add click listeners to habit names after rendering
  addHabitClickListeners();
  
  // Add click listeners to day cells and restore their states
  addDayClickListeners();
  restoreDayStates();
}

function showModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <h2>Add New Habit</h2>
      <input type="text" class="js-add-habit-input" placeholder="Enter habit name" />
      <button class="js-save-button">Save</button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector('.close-button');
  const saveButton = modal.querySelector('.js-save-button');
  const backdrop = modal.querySelector('.modal-backdrop');

  closeButton.addEventListener('click', () => {
    closeModal(modal);
  });

  backdrop.addEventListener('click', () => {
    closeModal(modal);
  });

  saveButton.addEventListener('click', () => {
    addHabits(modal);
  });

  const input = modal.querySelector('.js-add-habit-input');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addHabits(modal);
    }
  });

  input.focus();
}

function closeModal(modal) {
  document.body.removeChild(modal);
}

function saveToStorage() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function addHabits(modal) {
  const addHabitInputElement = modal.querySelector(".js-add-habit-input");
  const newHabitName = addHabitInputElement.value.trim();

  if (newHabitName === "") {
    return;
  }

  const newHabit = {
    name: newHabitName,
    days: {} // Initialize empty days object for tracking day states
  };

  habits.push(newHabit);
  saveToStorage();
  closeModal(modal);
  renderHabits();
}

function addHabitClickListeners() {
  const habitTexts = document.querySelectorAll('.js-habits-text');
  
  habitTexts.forEach((habitText) => {
    // Add visual indicator that it's clickable
    habitText.style.cursor = 'pointer';
    habitText.style.transition = 'background-color 0.2s ease';
    
    habitText.addEventListener('click', (e) => {
      const habitIndex = parseInt(e.target.getAttribute('data-habit-index'));
      const habitName = habits[habitIndex].name;
      
      showDeleteConfirmModal(habitName, habitIndex);
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

function showDeleteConfirmModal(habitName, habitIndex) {
  const confirmModal = document.createElement('div');
  confirmModal.classList.add('confirm-modal');
  confirmModal.innerHTML = `
    <div class="confirm-modal-backdrop"></div>
    <div class="confirm-modal-content">
      <span class="confirm-close-button">&times;</span>
      <h2>Delete Habit?</h2>
      <p>Are you sure you want to delete <strong>"${habitName}"</strong>?</p>
      <p class="warning-text">This action cannot be undone.</p>
      <div class="confirm-buttons">
        <button class="cancel-button">Cancel</button>
        <button class="delete-button">Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmModal);

  const closeButton = confirmModal.querySelector('.confirm-close-button');
  const backdrop = confirmModal.querySelector('.confirm-modal-backdrop');
  const cancelButton = confirmModal.querySelector('.cancel-button');
  const deleteButton = confirmModal.querySelector('.delete-button');
  
  // Close modal functions
  const closeModal = () => {
    document.body.removeChild(confirmModal);
  };
  
  closeButton.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);
  
  // Delete habit
  deleteButton.addEventListener('click', () => {
    habits.splice(habitIndex, 1);
    saveToStorage();
    closeModal();
    renderHabits();
  });
  
  // Focus the cancel button by default (safer option)
  cancelButton.focus();
}

function addDayClickListeners() {
  document.querySelectorAll('.day').forEach((dayCell) => {
    // Skip disabled cells (days beyond current month)
    if (dayCell.classList.contains('disabled')) {
      return;
    }
    
    const dayNumber = dayCell.dataset.day;
    const habitIndex = parseInt(dayCell.dataset.habitIndex);
    
    dayCell.addEventListener('click', () => {
      const habit = habits[habitIndex];
      if (!habit.days) {
        habit.days = {};
      }
      
      const currentState = habit.days[dayNumber];
      
      // Cycle through states: empty -> completed -> missed -> empty
      if (currentState === 'completed') {
        // Currently completed, change to missed
        habit.days[dayNumber] = 'missed';
        updateDayCell(dayCell, 'missed');
        console.log(`Day ${dayNumber} marked as missed`);
      } else if (currentState === 'missed') {
        // Currently missed, change to empty
        delete habit.days[dayNumber];
        updateDayCell(dayCell, 'empty');
        console.log(`Day ${dayNumber} cleared`);
      } else {
        // Currently empty, change to completed
        habit.days[dayNumber] = 'completed';
        updateDayCell(dayCell, 'completed');
        console.log(`Day ${dayNumber} marked as completed`);
      }
      
      // Save to localStorage
      saveToStorage();
      
      // Update the total count for this habit
      updateHabitTotal(habitIndex);
    });
  });
}

function updateDayCell(dayCell, state) {
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

function restoreDayStates() {
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

function getDaysInMonth(month, year) {
  // month is 0-indexed (0 = January, 11 = December)
  if (month === 1) { // February
    // Check for leap year
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
      return 29; // Leap year
    } else {
      return 28; // Regular year
    }
  } else if ([3, 5, 8, 10].includes(month)) { // April, June, September, November
    return 30;
  } else { // January, March, May, July, August, October, December
    return 31;
  }
}

function getCurrentMonth() {
  const now = new Date();
  return {
    month: now.getMonth(), // 0-indexed
    year: now.getFullYear(),
    monthName: now.toLocaleString('default', { month: 'long' })
  };
}

function calculateCompletedTotal(habit, daysInMonth) {
  if (!habit.days) return 0;
  
  let completedCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    if (habit.days[day.toString()] === 'completed') {
      completedCount++;
    }
  }
  return completedCount;
}

function updateHabitTotal(habitIndex) {
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

function updateMonthHeader() {
  const currentMonth = getCurrentMonth();
  
  // Update the month text to show current month and year
  const monthTextElement = document.querySelector('.month-text');
  if (monthTextElement) {
    monthTextElement.textContent = `${currentMonth.monthName} ${currentMonth.year}`;
  }
  
  // Keep the original month names (Jan, Feb, Mar, etc.) in the header
  // No need to change the months-container content
}



document.addEventListener('DOMContentLoaded', function() {
  const addButton = document.querySelector('.js-add-button');
  
  if (addButton) {
    addButton.addEventListener('click', () => {
      showModal();
    });
  } else {
    console.error('Add button not found!');
  }

  // Render habits and add click listeners
  renderHabits();
  updateMonthHeader();
});