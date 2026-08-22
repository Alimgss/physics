const exercises = [
  { id: 1, title: 'اسکوات با وزن بدن', muscle: 'پا و باسن', level: 'مبتدی', gif: 'https://media.giphy.com/media/3o6ZtpWvwnhf34Oj0A/giphy.gif', sets: '۳ × ۱۲' },
  { id: 2, title: 'شنا سوئدی', muscle: 'سینه و پشت بازو', level: 'متوسط', gif: 'https://media.giphy.com/media/l0MYwONBGDS7aPGOk/giphy.gif', sets: '۳ × ۱۰' },
  { id: 3, title: 'لانج تناوبی', muscle: 'پا', level: 'مبتدی', gif: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif', sets: '۳ × ۱۰ هر پا' },
  { id: 4, title: 'پلانک', muscle: 'مرکز بدن', level: 'مبتدی', gif: 'https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif', sets: '۳ × ۳۰ ثانیه' },
  { id: 5, title: 'ددلیفت دمبل', muscle: 'پشت پا و کمر', level: 'پیشرفته', gif: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif', sets: '۴ × ۸' },
  { id: 6, title: 'پرس سرشانه', muscle: 'سرشانه', level: 'متوسط', gif: 'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif', sets: '۳ × ۱۰' },
];

const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const state = { weeks: 4, selectedWeek: 1, selectedDay: 1, query: '', plan: {} };
const $ = (id) => document.getElementById(id);
const getDayItems = (week = state.selectedWeek, day = state.selectedDay) => state.plan[week]?.[day] ?? [];

function setDay(week, day) { state.selectedWeek = week; state.selectedDay = day; render(); }
function addExercise(id) {
  const exercise = exercises.find((item) => item.id === id);
  if (!exercise) return;
  state.plan[state.selectedWeek] ??= {};
  state.plan[state.selectedWeek][state.selectedDay] ??= [];
  state.plan[state.selectedWeek][state.selectedDay].push({ ...exercise, note: exercise.sets });
  render();
}
function removeExercise(index) { state.plan[state.selectedWeek][state.selectedDay].splice(index, 1); render(); }
function activeSessions() { return Object.values(state.plan).reduce((sum, week) => sum + Object.values(week).filter((items) => items.length).length, 0); }

function renderCalendar() {
  $('week-label').textContent = `${state.weeks} هفته`;
  $('session-count').textContent = `${activeSessions()} جلسه فعال`;
  $('weeks-list').innerHTML = Array.from({ length: state.weeks }, (_, weekIndex) => {
    const week = weekIndex + 1;
    const buttons = dayNames.map((label, dayIndex) => {
      const day = dayIndex + 1;
      const count = getDayItems(week, day).length;
      const active = week === state.selectedWeek && day === state.selectedDay ? ' active' : '';
      return `<button class="day-button${active}" data-week="${week}" data-day="${day}">${label}<small>${count ? `${count} حرکت` : 'استراحت'}</small></button>`;
    }).join('');
    return `<div class="week-card"><strong>هفته ${week}</strong><div class="days-grid">${buttons}</div></div>`;
  }).join('');
  document.querySelectorAll('.day-button').forEach((button) => button.addEventListener('click', () => setDay(Number(button.dataset.week), Number(button.dataset.day))));
}

function renderLibrary() {
  const filtered = exercises.filter((item) => `${item.title} ${item.muscle} ${item.level}`.includes(state.query));
  $('exercise-list').innerHTML = filtered.map((exercise) => `<article class="exercise-card"><img src="${exercise.gif}" alt="${exercise.title}" /><div><h3>${exercise.title}</h3><p>${exercise.muscle} • ${exercise.level}</p><span>${exercise.sets}</span></div><button data-add="${exercise.id}">افزودن</button></article>`).join('');
  document.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addExercise(Number(button.dataset.add))));
}

function renderSelectedDay() {
  const items = getDayItems();
  $('selected-title').textContent = `هفته ${state.selectedWeek}، ${dayNames[state.selectedDay - 1]}`;
  $('selected-count').textContent = `${items.length} حرکت`;
  $('selected-exercises').innerHTML = items.length ? items.map((exercise, index) => `<article class="planned-card"><img src="${exercise.gif}" alt="${exercise.title}" /><div><h3>${exercise.title}</h3><p>${exercise.note}</p></div><button data-remove="${index}">حذف</button></article>`).join('') : '<div class="empty-state">برای این روز هنوز حرکتی انتخاب نشده است.</div>';
  document.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => removeExercise(Number(button.dataset.remove))));
}

function render() { renderCalendar(); renderLibrary(); renderSelectedDay(); }
$('weeks').addEventListener('input', (event) => { state.weeks = Math.max(1, Math.min(16, Number(event.target.value) || 1)); if (state.selectedWeek > state.weeks) state.selectedWeek = state.weeks; render(); });
$('search').addEventListener('input', (event) => { state.query = event.target.value.trim(); renderLibrary(); });
render();
