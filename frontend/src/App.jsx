import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import EventCard from "./components/EventCard";
import FilterButtons from "./components/FilterButtons";
import CalendarView from "./components/CalendarView";
import { groupEventsByMonth } from "./utils/CalendarUtils";

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
        // Detectar entorno y usar la URL correcta
        const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const apiUrl = isProd
          ? 'https://fiuba-calendar.onrender.com/api/events'
          : '/api/events';
        const response = await fetch(apiUrl);
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

  useEffect(() => {
    if (viewMode === 'list' && !loading && events.length > 0) {
      const now = new Date();
      const monthName = now.toLocaleString('es-ES', { month: 'long' });
      const currentId = `${monthName.toLowerCase()}-${now.getFullYear()}`;
      const element = document.getElementById(currentId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [viewMode, loading, events]);

  if(loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if(error) return <p className="text-red-500">Error: {error}</p>;
  
  const filteredEvents = filter === 'TODOS' 
    ? events 
    : events.filter(event => event.category === filter);

  const now = new Date();
  const upcomingEvents = filteredEvents.filter(event => new Date(event.end_date) >= now);

  const categories = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Académico', value: 'ACADEMICO' },
    { label: 'Exámenes', value: 'EXAMEN' },
    { label: 'Admin', value: 'ADMINISTRATIVO' },
  ];
  
  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Eventos</h1>
        <div className="flex gap-3 items-center">
          <a 
            href="https://tally.so/r/BzXR2e" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors flex items-center gap-1 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-md"
          >
            🐞 Sugerencias
          </a>
          <a 
            href="https://cafecito.app/daniel-mamani" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors shadow-sm"
          >
            ☕ Invitar un Cafecito
          </a>
        </div>
      </div>
      
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
          {Object.entries(groupEventsByMonth(upcomingEvents)).map(([monthYear, monthEvents]) => (
              <div key={monthYear} className="mb-6">
                <h2
                  id={monthYear.toLowerCase().replace(' ', '-')}
                  className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-3 shadow-sm text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-300"
                >
                  {monthYear}
                </h2>
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
      <Footer />
    </div>
  );
}