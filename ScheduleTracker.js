import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useApp } from '../../contexts/AppContext';
import { defaultSchedules, locations, pincodes, generateScheduleDates } from '../../data/scheduleData';
import { FaMapMarkerAlt, FaClock, FaTruck, FaCalendarAlt } from 'react-icons/fa';
import { format, isSameDay, isToday, isFuture } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import './ScheduleTracker.css';

const ScheduleTracker = () => {
  const { state } = useApp();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPincode, setSelectedPincode] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [collectionDates, setCollectionDates] = useState([]);

  // Load schedules from localStorage or use defaults
  useEffect(() => {
    const savedSchedules = JSON.parse(localStorage.getItem('schedules')) || [];
    const allSchedules = [...defaultSchedules, ...savedSchedules];
    setSchedules(allSchedules);
  }, [state.schedules]);

  // Filter schedules based on location or pincode
  const filteredSchedules = schedules.filter(schedule => {
    if (selectedLocation && selectedPincode) {
      return schedule.location === selectedLocation && schedule.pincode === selectedPincode;
    }
    if (selectedLocation) {
      return schedule.location === selectedLocation;
    }
    if (selectedPincode) {
      return schedule.pincode === selectedPincode;
    }
    return true;
  });

  // Generate collection dates for calendar
  useEffect(() => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2);

    const allDates = [];
    filteredSchedules.forEach(schedule => {
      const dates = generateScheduleDates(schedule, startDate, endDate);
      dates.forEach(date => {
        allDates.push({
          date,
          schedule,
          isToday: isToday(date),
          isFuture: isFuture(date)
        });
      });
    });

    setCollectionDates(allDates);
  }, [filteredSchedules]);

  // Get schedules for a specific date
  const getSchedulesForDate = (date) => {
    return collectionDates.filter(item => isSameDay(item.date, date));
  };

  // Get next upcoming collection
  const getNextCollection = () => {
    const upcoming = collectionDates
      .filter(item => isFuture(item.date))
      .sort((a, b) => a.date - b.date);
    return upcoming[0] || null;
  };

  // Calendar tile content
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const daySchedules = getSchedulesForDate(date);
      if (daySchedules.length > 0) {
        return (
          <div className="calendar-indicators">
            {daySchedules.map((item, index) => (
              <div 
                key={index}
                className={`indicator ${item.schedule.wasteType.toLowerCase().replace(' ', '-')}`}
                title={`${item.schedule.wasteType} - ${item.schedule.collectionTime}`}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // Calendar tile class name
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const daySchedules = getSchedulesForDate(date);
      if (daySchedules.length > 0) {
        const classes = ['has-collection'];
        if (isToday(date)) classes.push('today-collection');
        return classes.join(' ');
      }
    }
    return null;
  };

  const nextCollection = getNextCollection();

  return (
    <div className="schedule-tracker">
      <div className="tracker-header">
        <h2>Collection Schedule</h2>
        <p>Track garbage collection schedules for your area</p>
      </div>

      <div className="filter-controls">
        <div className="control-group">
          <label>Select Location</label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="control-select"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Or Enter Pincode</label>
          <select 
            value={selectedPincode} 
            onChange={(e) => setSelectedPincode(e.target.value)}
            className="control-select"
          >
            <option value="">All Pincodes</option>
            {pincodes.map(pincode => (
              <option key={pincode} value={pincode}>{pincode}</option>
            ))}
          </select>
        </div>
      </div>

      {nextCollection && (
        <div className="next-collection">
          <div className="next-collection-header">
            <FaTruck className="truck-icon" />
            <h3>Next Collection</h3>
          </div>
          <div className="next-collection-info">
            <div className="collection-date">
              <FaCalendarAlt className="date-icon" />
              <span>{format(nextCollection.date, 'EEEE, MMMM dd, yyyy')}</span>
            </div>
            <div className="collection-details">
              <div className="detail">
                <FaClock className="detail-icon" />
                <span>{nextCollection.schedule.collectionTime}</span>
              </div>
              <div className="detail">
                <FaMapMarkerAlt className="detail-icon" />
                <span>{nextCollection.schedule.location}</span>
              </div>
              <div className="waste-type">
                {nextCollection.schedule.wasteType}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="calendar-section">
        <div className="calendar-container">
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            showNeighboringMonth={false}
            prev2Label={null}
            next2Label={null}
          />
        </div>

        <div className="calendar-legend">
          <h4>Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="indicator general-waste" />
              <span>General Waste</span>
            </div>
            <div className="legend-item">
              <div className="indicator recyclables" />
              <span>Recyclables</span>
            </div>
            <div className="legend-item">
              <div className="indicator organic-waste" />
              <span>Organic Waste</span>
            </div>
            <div className="legend-item">
              <div className="indicator mixed-recyclables" />
              <span>Mixed Recyclables</span>
            </div>
          </div>
        </div>
      </div>

      <div className="schedules-list">
        <h3>
          {selectedLocation || selectedPincode 
            ? `Schedules for ${selectedLocation || selectedPincode}` 
            : 'All Schedules'
          }
        </h3>
        <div className="schedules-grid">
          {filteredSchedules.map(schedule => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ScheduleCard = ({ schedule }) => {
  const nextCollectionDate = generateScheduleDates(
    schedule, 
    new Date(), 
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Next 2 weeks
  )[0];

  return (
    <div className="schedule-card">
      <div className="schedule-header">
        <div className="waste-type-badge">
          {schedule.wasteType}
        </div>
        <div className="frequency">
          {schedule.frequency}
        </div>
      </div>

      <div className="schedule-content">
        <div className="location-info">
          <FaMapMarkerAlt className="icon" />
          <div>
            <div className="location-name">{schedule.location}</div>
            <div className="pincode">PIN: {schedule.pincode}</div>
          </div>
        </div>

        <div className="collection-info">
          <div className="collection-days">
            <strong>Days:</strong> {schedule.collectionDays.join(', ')}
          </div>
          <div className="collection-time">
            <FaClock className="icon" />
            <span>{schedule.collectionTime}</span>
          </div>
        </div>

        {nextCollectionDate && (
          <div className="next-date">
            <strong>Next Collection:</strong>
            <span className="date">
              {format(nextCollectionDate, 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        <div className="contractor">
          <FaTruck className="icon" />
          <span>{schedule.contractor}</span>
        </div>

        {schedule.notes && (
          <div className="notes">
            <strong>Notes:</strong> {schedule.notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTracker; 