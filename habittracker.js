const habits = JSON.parse(localStorage.getItem('habits')) || [
  {
    name: "Wake up Early (6am)",
    days: {} // Track day states: { "1": "completed", "2": "missed", etc. }
  },
];

function renderHabits() {
  let habitsHTML = "";

  habits.forEach((habit, habitIndex) => {
    habitsHTML += `
      <tr class="habits js-habit-row">
      <td class="habits-text js-habits-text" data-habit-index="${habitIndex}">${habit.name}</td>
      <td class="habits-container">
        <div class="days-container">
          <div data-day="1" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="2" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="3" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="4" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="5" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="6" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="7" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="8" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="9" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="10" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="11" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="12" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="13" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="14" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="15" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="16" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="17" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="18" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="19" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="20" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="21" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="22" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="23" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="24" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="25" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="26" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="27" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="28" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="29" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="30" data-habit-index="${habitIndex}" class="day"></div>
          <div data-day="31" data-habit-index="${habitIndex}" class="day"></div>
        </div>
      </td>
      <td class="total"></td>
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
});