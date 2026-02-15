import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    return format(dateObj, "EEEE d 'de' MMMM", { locale: es });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className={`h-3 w-full ${
            event.category === 'EXAMEN' ? 'bg-red-500' :
            event.category === 'ACADEMICO' ? 'bg-blue-500' : 'bg-yellow-500'
        }`} />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1 text-gray-900 leading-tight pr-6">{event.title}</h2>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-4 inline-block ${
             event.category === 'EXAMEN' ? 'bg-red-100 text-red-700' :
             event.category === 'ACADEMICO' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {event.category}
          </span>
          
          <div className="space-y-3 mb-6 mt-2">
            <div className="flex items-start gap-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Inicio</p>
                <p className="text-gray-900 font-medium capitalize">
                  {formatDate(event.start)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">🏁</span>
              <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Fin</p>
                <p className="text-gray-900 font-medium capitalize">
                  {formatDate(event.end)}
                </p>
              </div>
            </div>
          </div>

          <a
            href={event.googleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M16 2v4M8 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <line x1="12" y1="14" x2="12" y2="18"></line>
              <line x1="10" y1="16" x2="14" y2="16"></line>
            </svg>
            Agendar en Google Calendar
          </a>
        </div>
      </div>
    </div>
  );
}