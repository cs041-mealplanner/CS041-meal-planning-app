// custom hook for Meal Planner

import { useMemo, useRef, useState } from "react";
import { loadMealPlanEntries, saveMealPlanEntries } from "./mealPlannerRepo";

const SLOTS = ["breakfast", "lunch", "dinner"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toYmd(dateObj) {
  const y = dateObj.getFullYear();
  const m = pad2(dateObj.getMonth() + 1);
  const d = pad2(dateObj.getDate());
  return `${y}-${m}-${d}`;
}

// Monday as start of week (common for planners)
function startOfWeekMonday(dateObj) {
  const d = new Date(dateObj);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(dateObj, days) {
  const d = new Date(dateObj);
  d.setDate(d.getDate() + days);
  return d;
}

function makeKey(dateYmd, slot) {
  return `${dateYmd}|${slot}`;
}

function indexByKey(entries) {
  const map = new Map();
  for (const e of entries) {
    map.set(makeKey(e.date, e.slot), e);
  }
  return map;
}

function arraysEqualJson(a, b) {
  // stable compare by sorting on (date, slot)
  const normalize = (arr) =>
    [...arr].sort((x, y) => {
      if (x.date !== y.date) return x.date.localeCompare(y.date);
      return x.slot.localeCompare(y.slot);
    });
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

export function useMealPlanner() {
  // load once
  const initialEntries = useMemo(() => loadMealPlanEntries(), []);
  const savedSnapshotRef = useRef([...initialEntries]);

  const [entries, setEntries] = useState(initialEntries);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const selectedYmd = useMemo(() => toYmd(selectedDate), [selectedDate]);

  const weekStart = useMemo(() => startOfWeekMonday(selectedDate), [selectedDate]);
  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const dt = addDays(weekStart, i);
        return {
          dateObj: dt,
          ymd: toYmd(dt),
          dayNumber: dt.getDate(),
          label: dt.toLocaleDateString(undefined, { weekday: "short" }),
        };
      }),
    [weekStart]
  );

  const entriesMap = useMemo(() => indexByKey(entries), [entries]);

  const isDirty = useMemo(
    () => !arraysEqualJson(entries, savedSnapshotRef.current),
    [entries]
  );

  function getEntry(dateYmd, slot) {
    return entriesMap.get(makeKey(dateYmd, slot)) || null;
  }

  function setMeal(dateYmd, slot, dishId) {
    if (!SLOTS.includes(slot)) return;

    setEntries((prev) => {
      const next = prev.filter((e) => !(e.date === dateYmd && e.slot === slot));
      next.push({ date: dateYmd, slot, dishId });
      return next;
    });
  }

  function removeMeal(dateYmd, slot) {
    if (!SLOTS.includes(slot)) return;

    setEntries((prev) => prev.filter((e) => !(e.date === dateYmd && e.slot === slot)));
  }

  function save() {
    saveMealPlanEntries(entries);
    savedSnapshotRef.current = [...entries];
  
    // force a re-render so isDirty recomputes
    setEntries((prev) => [...prev]);
  }

  function goPrevWeek() {
    setSelectedDate((d) => addDays(d, -7));
  }

  function goNextWeek() {
    setSelectedDate((d) => addDays(d, 7));
  }

  return {
    // UIState
    entries,
    selectedDate,
    selectedYmd,
    weekDays,
    isDirty,

    // Actions (ViewModel)
    setSelectedDate,
    setMeal,
    removeMeal,
    save,
    goPrevWeek,
    goNextWeek,
    getEntry,
  };
}