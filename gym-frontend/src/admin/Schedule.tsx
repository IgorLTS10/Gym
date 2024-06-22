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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
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
    if (selectedCourse) {
      setSelectedCourse({ ...selectedCourse, [name]: value } as Course);
    } else {
      setNewCourse((prevCourse) => ({ ...prevCourse, [name]: value }));
    }
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

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    try {
      const response = await axios.put(`http://localhost:5000/api/cours/${selectedCourse._id}`, selectedCourse);
      console.log('Updated course:', response.data);
      setCourses((prevCourses) => prevCourses.map(course => course._id === selectedCourse._id ? response.data : course));
      setShowModal(false);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      await axios.delete(`http://localhost:5000/api/cours/${selectedCourse._id}`);
      setCourses((prevCourses) => prevCourses.filter(course => course._id !== selectedCourse._id));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleSelectEvent = (event: Event) => {
    const course = event.resource as Course;
    setSelectedCourse(course);
    setShowModal(true);
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
        onSelectEvent={handleSelectEvent}
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
      <button className="add-course-button" onClick={() => {
        setSelectedCourse(null);
        setShowModal(true);
      }}>
        <FontAwesomeIcon icon={faPlus} /> Add Course
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedCourse ? 'Edit Course' : 'Add New Course'}</h3>
            <input
              type="date"
              name="date"
              value={selectedCourse ? moment(selectedCourse.date).format('YYYY-MM-DD') : newCourse.date}
              onChange={handleInputChange}
            />
            <input
              type="time"
              name="time"
              value={selectedCourse ? selectedCourse.time : newCourse.time}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={selectedCourse ? selectedCourse.title : newCourse.title}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              value={selectedCourse ? selectedCourse.duration : newCourse.duration}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="coach"
              placeholder="Coach"
              value={selectedCourse ? selectedCourse.coach : newCourse.coach}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={selectedCourse ? selectedCourse.description : newCourse.description}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={selectedCourse ? selectedCourse.capacity : newCourse.capacity}
              onChange={handleInputChange}
            />
            {selectedCourse ? (
              <>
                <button onClick={handleUpdateCourse}>Update Course</button>
                <button onClick={handleDeleteCourse} style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete Course</button>
              </>
            ) : (
              <button onClick={handleAddCourse}>Add Course</button>
            )}
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
