import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Agrupa eventos por mes y año
 * @param {Array} events - Array de eventos con start_date
 * @returns {Object} Objeto donde las claves son "Mes Año" y valores son arrays de eventos
 */
export function groupEventsByMonth(events) {
  const grouped = {};

  events.forEach((event) => {
    const date = new Date(event.start_date);
    // Formato: "Marzo 2026"
    const monthYear = format(date, "MMMM yyyy", { locale: es });
    
    // Capitalizar primera letra del mes
    const key = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(event);
  });

  return grouped;
}
