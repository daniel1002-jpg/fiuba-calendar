import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

export default function EventCard({ event }) {
  // Función que formatea el rango de fechas
  const formatDateRange = (startStr, endStr) => {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    
    // Si es el mismo día, mostrar solo una fecha
    if (isSameDay(startDate, endDate)) {
      return format(startDate, "EEE dd MMM", { locale: es });
    }
    
    // Si son diferentes, mostrar rango
    const formattedStart = format(startDate, "EEE dd MMM", { locale: es });
    const formattedEnd = format(endDate, "EEE dd MMM", { locale: es });
    return `${formattedStart} - ${formattedEnd}`;
  };

  // Función que devuelve clases Tailwind según la categoría
  const getCategoryStyles = (category) => {
    const styles = {
      EXAMEN: 'border-l-4 border-red-500 bg-red-50',
      ACADEMICO: 'border-l-4 border-blue-500 bg-blue-50',
      ADMINISTRATIVO: 'border-l-4 border-yellow-500 bg-yellow-50',
    };
    return styles[category] || 'border-l-4 border-gray-400 bg-gray-50';
  };

  return (
    <li 
      className={`p-4 rounded-lg shadow-md ${getCategoryStyles(event.category)}`}
    >
      <p className="font-bold text-lg text-gray-900">{event.title}</p>
      <p className="text-sm text-gray-700 mt-1">
        {formatDateRange(event.start_date, event.end_date)}
      </p>
    </li>
  );
}
