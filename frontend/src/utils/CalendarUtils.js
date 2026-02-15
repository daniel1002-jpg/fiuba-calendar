import { format, addDays, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function groupEventsByMonth(events) {
  const grouped = {};
  events.forEach((event) => {
    const date = new Date(event.start_date);
    const monthYear = format(date, "MMMM yyyy", { locale: es });
    const key = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(event);
  });
  return grouped;
}

export function generateGoogleCalendarLink(event) {
  if (!event || !event.start_date || !event.end_date) return "https://calendar.google.com/calendar/r";

  const cleanStart = event.start_date.substring(0, 10);
  const cleanEnd = event.end_date.substring(0, 10);

  const startDateStr = cleanStart.replace(/-/g, "");
  
  const endDateObj = parseISO(cleanEnd);
  const nextDayObj = addDays(endDateObj, 1);
  const endDateStr = format(nextDayObj, "yyyyMMdd");

  const title = encodeURIComponent(event.title || "Evento FIUBA");
  const details = encodeURIComponent(
    `Categoría: ${event.category || 'General'}\n\nAgregado desde FIUBA Calendar`
  );
  const location = encodeURIComponent("FIUBA, Av. Paseo Colón 850, CABA");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}&location=${location}`;
}