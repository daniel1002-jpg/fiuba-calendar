import { useState } from 'react';
import EventModal from './EventModal';
import { generateGoogleCalendarLink } from '../utils/CalendarUtils';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/dist/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

export default function CalendarView({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  const calendarEvents = events.map((event) => {
    const fechaLimpiaStart = event.start_date.substring(0, 10);
    const fechaLimpiaEnd = event.end_date.substring(0, 10);

    return {
      ...event,
      start: new Date(`${fechaLimpiaStart}T00:00:00`),
      
      end: new Date(`${fechaLimpiaEnd}T23:59:59`),
      
      googleLink: generateGoogleCalendarLink(event),
    };
  });

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#3b82f6';
    let borderColor = '#1d4ed8';

    if (event.category === 'EXAMEN') {
      backgroundColor = '#ef4444';
      borderColor = '#b91c1c';
    } else if (event.category === 'ACADEMICO') {
      backgroundColor = '#3b82f6';
      borderColor = '#1d4ed8';
    } else if (event.category === 'ADMINISTRATIVO') {
      backgroundColor = '#f59e0b';
      borderColor = '#b45309';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
      },
    };
  };

  const mensajesEspanol = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: total => `+ Ver más (${total})` 
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        eventPropGetter={eventStyleGetter}
        style={{ height: '100%' }}
        messages={mensajesEspanol}
        popup={true}
        culture='es'
        onSelectEvent={(event) => setSelectedEvent(event)}
      />
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
