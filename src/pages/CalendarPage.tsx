import React, { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';

import { useTaskContext } from '../context/TaskContext';
import NavBar from '../components/NavBar';
import styles from '../styles/CalendarPage.module.css';
import TaskModal from '../components/TaskModal';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const DragAndDropCalendar = withDragAndDrop(Calendar);

const CalendarPage: React.FC = () => {
  const { tasks, updateTask } = useTaskContext();
  const navigate = useNavigate();

  const [view, setView] = useState<View>('month');
  const [viewDate, setViewDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState<string | undefined>();

  const events = useMemo(
    () =>
      tasks.map((task) => ({
        id: task.id,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        allDay: true,
        priority: task.priority,
        resource: task,
      })),
    [tasks]
  );

  const handleSelectEvent = (event: any) => {
    navigate(`/task/${event.id}`);
  };

  const handleSelectSlot = (slotInfo: any) => {
    const date = slotInfo.start.toISOString().split('T')[0];
    setModalDate(date);
    setShowModal(true);
  };

  const handleEventDrop = ({ event, start }: any) => {
    const updated = { ...event.resource, dueDate: start.toISOString() };
    updateTask(updated);
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#888';
    if (event.priority === 'high') backgroundColor = '#c62828';
    else if (event.priority === 'medium') backgroundColor = '#f9a825';
    else if (event.priority === 'low') backgroundColor = '#2e7d32';

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '4px',
        padding: '2px 6px',
        fontSize: '0.9rem',
        border: 'none',
      },
    };
  };

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h1>📅 Calendar</h1>

        <DndProvider backend={HTML5Backend}>
          <DragAndDropCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            view={view}
            onView={setView}
            date={viewDate}
            onNavigate={setViewDate}
            views={['month', 'week', 'day']}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onEventDrop={handleEventDrop}
            eventPropGetter={eventStyleGetter}
            style={{
              height: '80vh',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text)',
            }}
            className={styles.calendar}
          />
        </DndProvider>

        {showModal && (
          <TaskModal
            onClose={() => {
              setShowModal(false);
              setModalDate(undefined);
            }}
            defaultDate={modalDate}
          />
        )}

        <button
          className={styles.floatingButton}
          onClick={() => {
            setModalDate(undefined);
            setShowModal(true);
          }}
          title="Add New Task"
        >
          ＋
        </button>
      </div>
    </>
  );
};

export default CalendarPage;
