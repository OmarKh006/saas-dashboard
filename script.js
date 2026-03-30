/*FROM Claude, i was trying something :)*/

/* eslint-disable */

const pickers = {
  startPicker: { date: new Date(2021, 9, 6), labelId: "startLabel" },
  endPicker: { date: new Date(2021, 9, 10), labelId: "endLabel" },
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function fmt(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = d.getFullYear();
  return `${mm}-${dd}-${yy}`;
}

function renderCalendar(pickerId) {
  const { date } = pickers[pickerId];
  const popup = document.getElementById(pickerId.replace("Picker", "Popup"));
  const year = date.getFullYear(),
    month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  let html = `
      <div class="cal-header">
        <button class="cal-nav" onclick="shiftMonth('${pickerId}',-1)">&#8249;</button>
        <span class="cal-header__title">${MONTHS[month]} ${year}</span>
        <button class="cal-nav" onclick="shiftMonth('${pickerId}',1)">&#8250;</button>
      </div>
      <div class="cal-grid">
        ${DAYS.map((d) => `<div class="cal-dow">${d}</div>`).join("")}
    `;

  for (let i = 0; i < firstDay; i++)
    html += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = d === date.getDate();
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    html += `<div class="cal-day${isSelected ? " selected" : ""}${isToday ? " today" : ""}"
                    onclick="selectDay('${pickerId}',${d})">${d}</div>`;
  }

  html += `</div>
      <button class="cal-confirm" onclick="closePicker('${pickerId}')">Confirm</button>`;

  popup.innerHTML = html;
}

function shiftMonth(pickerId, delta) {
  const p = pickers[pickerId];
  p.date = new Date(p.date.getFullYear(), p.date.getMonth() + delta, 1);
  renderCalendar(pickerId);
}

function selectDay(pickerId, day) {
  const p = pickers[pickerId];
  p.date = new Date(p.date.getFullYear(), p.date.getMonth(), day);
  document.getElementById(p.labelId).textContent = fmt(p.date);
  renderCalendar(pickerId);
}

function togglePicker(pickerId) {
  const el = document.getElementById(pickerId);
  const isOpen = el.classList.contains("open");
  // close all
  document
    .querySelectorAll(".date-dropdown")
    .forEach((d) => d.classList.remove("open"));
  if (!isOpen) {
    el.classList.add("open");
    renderCalendar(pickerId);
  }
}

function closePicker(pickerId) {
  document.getElementById(pickerId).classList.remove("open");
}

// Close on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".date-dropdown"))
    document
      .querySelectorAll(".date-dropdown")
      .forEach((d) => d.classList.remove("open"));
});
