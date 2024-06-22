import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import './Schedule.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

moment.locale('fr');
const localizer = momentLocalizer(moment);

interface Course {
  _id: string;
  date: string;
  time: string;
  title: string;
  duration: number;
  coach: string;
  description?: string;
  capacity?: number;
}

const Schedule: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState<Omit<Course, '_id'>>({
    date: '',
    time: '',
    title: '',
    duration: 60,
    coach: '',
    description: '',
    capacity: 20,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cours');
        console.log('Fetched courses:', response.data);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
  };

  const handleAddCourse = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/cours', newCourse);
      console.log('Added course:', response.data);
      setCourses((prevCourses) => [...prevCourses, response.data]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const events: Event[] = courses.map(course => {
    const startDateTime = moment(course.date).set({
      hour: moment(course.time, 'HH:mm').hours(),
      minute: moment(course.time, 'HH:mm').minutes()
    }).toDate();
    
    const endDateTime = moment(startDateTime).add(course.duration, 'minutes').toDate();
    
    return {
      id: course._id,
      title: course.title,
      start: startDateTime,
      end: endDateTime,
      resource: course,
    };
  });

  console.log('Events:', events);

  return (
    <div className="schedule-container">
      <h2>Schedule</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh', width: '100%' }}
        defaultView={Views.WEEK}
        views={['week']}
        step={60}
        timeslots={1}
        min={new Date(1970, 1, 1, 9, 0, 0)}
        max={new Date(1970, 1, 1, 22, 0, 0)}
        eventPropGetter={() => ({
          style: {
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '0px',
            border: 'none',
            display: 'block'
          }
        })}
        messages={{
          week: 'Semaine',
          day: 'Jour',
          month: 'Mois',
          previous: 'Précédent',
          next: 'Suivant',
          today: "Aujourd'hui",
          agenda: 'Agenda',
          date: 'Date',
          time: 'Heure',
          event: 'Événement',
        }}
        formats={{
          timeGutterFormat: (date, culture, local) => local ? local.format(date, 'HH:mm', culture) : '',
          eventTimeRangeFormat: ({ start, end }, culture, local) => local ? `${local.format(start, 'HH:mm', culture)} - ${local.format(end, 'HH:mm', culture)}` : '',
          agendaTimeRangeFormat: ({ start, end }, culture, local) => local ? `${local.format(start, 'HH:mm', culture)} - ${local.format(end, 'HH:mm', culture)}` : '',
          dayRangeHeaderFormat: ({ start, end }, culture, local) => local ? `${local.format(start, 'DD MMM', culture)} - ${local.format(end, 'DD MMM', culture)}` : '',
        }}
      />
      <button className="add-course-button" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faPlus} /> Add Course
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Course</h3>
            <input
              type="date"
              name="date"
              value={newCourse.date}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="time"
              value={newCourse.time}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              value={newCourse.duration}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="coach"
              placeholder="Coach"
              value={newCourse.coach}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newCourse.description}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={newCourse.capacity}
              onChange={handleInputChange}
            />
            <button onClick={handleAddCourse}>Add Course</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
