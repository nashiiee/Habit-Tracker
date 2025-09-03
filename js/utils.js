// ============================
// UTILITY FUNCTIONS
// ============================

export function getDaysInMonth(month, year) {
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

export function getCurrentMonth() {
  const now = new Date();
  return {
    month: now.getMonth(), // 0-indexed
    year: now.getFullYear(),
    monthName: now.toLocaleString('default', { month: 'long' })
  };
}

export function getCurrentDay() {
  const now = new Date();
  return now.getDate();
}

export function saveToStorage(habits) {
  localStorage.setItem('habits', JSON.stringify(habits));
}

export function loadFromStorage() {
  return JSON.parse(localStorage.getItem('habits')) || [
    {
      name: "Wake up Early (6am)",
      days: {} // Track day states: { "1": "completed", "2": "missed", etc. }
    },
  ];
}
