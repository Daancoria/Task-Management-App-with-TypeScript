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

// Localization setup for the calendar using date-fns
const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Enable drag-and-drop functionality for the calendar
const DragAndDropCalendar = withDragAndDrop(Calendar);

const CalendarPage: React.FC = () => {
  const { tasks, updateTask } = useTaskContext(); // Access tasks and updateTask function from context
  const navigate = useNavigate(); // React Router hook for navigation

  // State variables for managing calendar view, selected date, modal visibility, and floating menu
  const [view, setView] = useState<View>('month');
  const [viewDate, setViewDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState<string | undefined>();
  const [showMenu, setShowMenu] = useState(false);

  // Map tasks to calendar events
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

  // Handle event selection (navigate to task details)
  const handleSelectEvent = (event: any) => {
    navigate(`/task/${event.id}`);
  };

  // Handle slot selection (open modal for creating a task)
  const handleSelectSlot = (slotInfo: any) => {
    const date = slotInfo.start.toISOString().split('T')[0];
    setModalDate(date);
    setShowModal(true);
    setShowMenu(false);
  };

  // Handle event drag-and-drop (update task due date)
  const handleEventDrop = ({ event, start }: any) => {
    const updated = { ...event.resource, dueDate: start.toISOString() };
    updateTask(updated);
  };

  // Customize event styles based on priority
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
      {/* Navigation bar */}
      <NavBar />
      <div className={styles.container}>
        <h1>📅 Calendar</h1>

        {/* Drag-and-drop calendar */}
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

        {/* Task creation modal */}
        {showModal && (
          <TaskModal
            onClose={() => {
              setShowModal(false);
              setModalDate(undefined);
            }}
            defaultDate={modalDate}
          />
        )}

        {/* Floating action menu */}
        <div className={styles.floatingMenu}>
          {showMenu && (
            <>
              <button
                className={styles.fabOption}
                onClick={() => {
                  setModalDate(undefined);
                  setShowModal(true);
                  setShowMenu(false);
                }}
              >
                ➕ Add Task
              </button>
            </>
          )}

          <button
            className={styles.fabMain}
            onClick={() => setShowMenu((prev) => !prev)}
            title="Menu"
          >
            ＋
          </button>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
