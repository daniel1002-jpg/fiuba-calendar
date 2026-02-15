import { format, parse, isSameDay, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { generateGoogleCalendarLink } from "../utils/CalendarUtils";

export default function EventCard({ event }) {
  const googleLink = generateGoogleCalendarLink(event);

  const formatDateRange = (startStr, endStr) => {
    if (!startStr || !endStr) return "Fecha no válida";

    const sDateIso = startStr.substring(0, 10);
    const eDateIso = endStr.substring(0, 10);

    const startDate = parseISO(sDateIso);
    const endDate = parseISO(eDateIso);

    if (isSameDay(startDate, endDate)) {
      return format(startDate, "EEE dd MMM", { locale: es });
    }
    
    const formattedStart = format(startDate, "EEE dd MMM", { locale: es });
    const formattedEnd = format(endDate, "EEE dd MMM", { locale: es });
    return `${formattedStart} - ${formattedEnd}`;
  };

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
      <div className="mt-4 flex justify-end">
        <a 
          href={googleLink}
          target="_blank" 
          rel="noopener noreferrer"
          title="Agregar este evento a tu Google Calendar"
          className="group inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
        >
          {/* Icono tipo Block de Notas / Agenda */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors"
          >
            <path d="M16 2v4M8 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <line x1="12" y1="14" x2="12" y2="18"></line>
            <line x1="10" y1="16" x2="14" y2="16"></line>
          </svg>
          Agendar
        </a>
      </div>
    </li>
  );
}
