// ============================
// MODAL MANAGEMENT
// ============================

import { addHabit, deleteHabit } from './habitManager.js';

export function showAddHabitModal(habits, onHabitAdded) {
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
  const input = modal.querySelector('.js-add-habit-input');

  const closeModal = () => {
    document.body.removeChild(modal);
  };

  const saveHabit = () => {
    const habitName = input.value.trim();
    if (addHabit(habits, habitName)) {
      closeModal();
      onHabitAdded();
    }
  };

  closeButton.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  saveButton.addEventListener('click', saveHabit);
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveHabit();
    }
  });

  input.focus();
}

export function showDeleteConfirmModal(habits, habitName, habitIndex, onHabitDeleted) {
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
  
  const closeModal = () => {
    document.body.removeChild(confirmModal);
  };
  
  closeButton.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  cancelButton.addEventListener('click', closeModal);
  
  deleteButton.addEventListener('click', () => {
    if (deleteHabit(habits, habitIndex)) {
      closeModal();
      onHabitDeleted();
    }
  });
  
  cancelButton.focus();
}
