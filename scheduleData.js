// Static schedule data for different locations
export const defaultSchedules = [
  {
    id: 'schedule-1',
    location: 'Downtown Area',
    pincode: '12345',
    wasteType: 'General Waste',
    collectionDays: ['Monday', 'Thursday'],
    collectionTime: '08:00 AM',
    nextCollection: new Date(2024, 0, 15), // January 15, 2024
    frequency: 'Twice a week',
    contractor: 'City Waste Management',
    notes: 'Please place bins on the curb by 7:00 AM'
  },
  {
    id: 'schedule-2',
    location: 'Downtown Area',
    pincode: '12345',
    wasteType: 'Recyclables',
    collectionDays: ['Wednesday'],
    collectionTime: '10:00 AM',
    nextCollection: new Date(2024, 0, 17), // January 17, 2024
    frequency: 'Weekly',
    contractor: 'Green Recycling Co.',
    notes: 'Sort materials before placing'
  },
  {
    id: 'schedule-3',
    location: 'Suburban District',
    pincode: '67890',
    wasteType: 'General Waste',
    collectionDays: ['Tuesday', 'Friday'],
    collectionTime: '09:00 AM',
    nextCollection: new Date(2024, 0, 16), // January 16, 2024
    frequency: 'Twice a week',
    contractor: 'Suburban Waste Services',
    notes: 'Maximum weight limit: 50lbs per bin'
  },
  {
    id: 'schedule-4',
    location: 'Suburban District',
    pincode: '67890',
    wasteType: 'Organic Waste',
    collectionDays: ['Saturday'],
    collectionTime: '07:00 AM',
    nextCollection: new Date(2024, 0, 20), // January 20, 2024
    frequency: 'Weekly',
    contractor: 'Eco Composting Ltd.',
    notes: 'Use biodegradable bags only'
  },
  {
    id: 'schedule-5',
    location: 'Industrial Zone',
    pincode: '11111',
    wasteType: 'General Waste',
    collectionDays: ['Monday', 'Wednesday', 'Friday'],
    collectionTime: '06:00 AM',
    nextCollection: new Date(2024, 0, 15), // January 15, 2024
    frequency: 'Three times a week',
    contractor: 'Industrial Waste Corp.',
    notes: 'Large container service available'
  },
  {
    id: 'schedule-6',
    location: 'Residential Complex A',
    pincode: '22222',
    wasteType: 'General Waste',
    collectionDays: ['Tuesday', 'Saturday'],
    collectionTime: '08:30 AM',
    nextCollection: new Date(2024, 0, 16), // January 16, 2024
    frequency: 'Twice a week',
    contractor: 'Residential Services Inc.',
    notes: 'Collection point: Main gate'
  },
  {
    id: 'schedule-7',
    location: 'University Campus',
    pincode: '33333',
    wasteType: 'Mixed Recyclables',
    collectionDays: ['Monday', 'Friday'],
    collectionTime: '11:00 AM',
    nextCollection: new Date(2024, 0, 15), // January 15, 2024
    frequency: 'Twice a week',
    contractor: 'Campus Green Initiative',
    notes: 'Student volunteers assist collection'
  }
];

export const locations = [
  'Downtown Area',
  'Suburban District', 
  'Industrial Zone',
  'Residential Complex A',
  'University Campus'
];

export const pincodes = [
  '12345',
  '67890',
  '11111',
  '22222',
  '33333'
];

export const wasteTypes = [
  'General Waste',
  'Recyclables',
  'Organic Waste',
  'Mixed Recyclables',
  'Hazardous Waste'
];

// Generate recurring dates for schedules
export const generateScheduleDates = (schedule, startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const collectionDayNumbers = schedule.collectionDays.map(day => dayNames.indexOf(day));
  
  while (current <= end) {
    if (collectionDayNumbers.includes(current.getDay())) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}; 