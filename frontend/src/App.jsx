import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('TODOS');

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");
        if (!response.ok) throw new Error('Error al obtener eventos');
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if(loading) return <p>Cargando eventos...</p>;
  if(error) return <p className="text-red-500">Error: {error}</p>;
  
  // Filtrar eventos según el estado filter
  const filteredEvents = filter === 'TODOS' 
    ? events 
    : events.filter(event => event.category === filter);

  const categories = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Académico', value: 'ACADEMICO' },
    { label: 'Exámenes', value: 'EXAMEN' },
    { label: 'Admin', value: 'ADMINISTRATIVO' },
  ];
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Eventos</h1>
      
      {/* Botones de filtro */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded font-semibold transition ${
              filter === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        <ul className="space-y-3">
          {filteredEvents.map((event) => (
            <li 
              key={event.id} 
              className={`p-4 rounded-lg shadow-md ${getCategoryStyles(event.category)}`}
            >
              <p className="font-bold text-lg">{event.title}</p>
              <p className="text-sm text-gray-600 mt-1">{formatDateRange(event.start_date, event.end_date)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}