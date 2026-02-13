import { useState, useEffect } from "react";
import EventCard from "./components/EventCard";
import FilterButtons from "./components/FilterButtons";
import CalendarView from "./components/CalendarView";
import { groupEventsByMonth } from "./utils";

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('TODOS');
  const [viewMode, setViewMode] = useState('list');

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
      
      <FilterButtons 
        categories={categories} 
        filter={filter} 
        setFilter={setFilter} 
      />

      {/* Botones de vista (Lista / Calendario) */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded font-semibold transition ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          📋 Lista
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded font-semibold transition ${
            viewMode === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          📅 Calendario
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : viewMode === 'list' ? (
        <div>
          {Object.entries(groupEventsByMonth(filteredEvents)).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="mb-6">
              <h2 className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-3 shadow-sm text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-300">{monthYear}</h2>
              <ul className="space-y-3">
                {monthEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <CalendarView events={filteredEvents} />
      )}
    </div>
  );
}