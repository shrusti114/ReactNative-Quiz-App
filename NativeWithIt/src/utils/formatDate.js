// src/utils/formatDate.js
export function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}
