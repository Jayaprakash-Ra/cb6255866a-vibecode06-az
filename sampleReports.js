// Sample report data for testing admin functionality
export const sampleReports = [
  {
    id: 'RPT-2024-001',
    type: 'full',
    description: 'Garbage bin is overflowing near Main Street Market. Waste is spilling onto the sidewalk.',
    location: '123 Main Street, Downtown',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    status: 'Reported',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    photo: null,
    priority: 'high',
    reportedBy: 'user-001',
    category: 'bin_full'
  },
  {
    id: 'RPT-2024-002',
    type: 'damaged',
    description: 'Bin lid is broken and trash is scattered by wind. Needs immediate repair.',
    location: '456 Oak Avenue, Residential Area',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    status: 'Escalated',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    photo: null,
    priority: 'urgent',
    reportedBy: 'user-002',
    category: 'bin_damaged'
  },
  {
    id: 'RPT-2024-003',
    type: 'full',
    description: 'Multiple bins in the park area are full. Weekend crowds caused overflow.',
    location: 'Central Park, Recreation Area',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    status: 'Reported',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    photo: null,
    priority: 'medium',
    reportedBy: 'user-003',
    category: 'bin_full'
  },
  {
    id: 'RPT-2024-004',
    type: 'full',
    description: 'Commercial area bins need urgent attention. Business district overflow.',
    location: '789 Business Boulevard, Commercial District',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    status: 'Reported',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    photo: null,
    priority: 'high',
    reportedBy: 'user-004',
    category: 'bin_full'
  },
  {
    id: 'RPT-2024-005',
    type: 'damaged',
    description: 'Bin has been vandalized and is unusable. Graffiti and structural damage.',
    location: '321 Elm Street, Residential Area',
    coordinates: { lat: 40.7282, lng: -73.9942 },
    status: 'Escalated',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    photo: null,
    priority: 'urgent',
    reportedBy: 'user-005',
    category: 'bin_damaged'
  }
];

// Function to add sample reports to the app context
export const addSampleReports = (dispatch, actionTypes) => {
  sampleReports.forEach(report => {
    dispatch({
      type: actionTypes.ADD_REPORT,
      payload: report
    });
  });
}; 