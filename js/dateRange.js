// js/dateRange.js
// NASA's APOD API only has images from June 16, 1995 onwards
const earliestDate = '1995-06-16';
const today = new Date().toISOString().split('T')[0];

function setupDateInputs(startInput, endInput) {
  startInput.min = earliestDate;
  startInput.max = today;
  endInput.min = earliestDate;
  endInput.max = today;

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 8);
  startInput.value = lastWeek.toISOString().split('T')[0];
  endInput.value = today;

  startInput.addEventListener('change', () => {
    const sd = new Date(startInput.value);
    const ed = new Date(sd);
    ed.setDate(sd.getDate() + 8);
    endInput.value = ed > new Date(today)
      ? today
      : ed.toISOString().split('T')[0];
  });
}
