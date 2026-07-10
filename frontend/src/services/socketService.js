// Simulated Socket connection wrapper for multi-user collaboration indicators

export const socketService = {
  // Simulates connecting to socket room
  joinRoom: (docId, userName) => {
    return {
      room: `doc-room-${docId}`,
      activeUsers: 3
    };
  },

  // Mock list of active cursors in editor
  getLiveCursors: () => {
    return [
      { name: 'Sarah Connor', color: 'purple', text: 'Sarah' },
      { name: 'Dave Grohl', color: 'green', text: 'Dave' },
      { name: 'Julian Casablancas', color: 'amber', text: 'Julian' }
    ];
  },

  // Mock listening for content changes
  onContentChange: (callback) => {
    // Simulate periodic edits by other users
    const interval = setInterval(() => {
      callback({
        user: 'Sarah Connor',
        timestamp: new Date().toLocaleTimeString()
      });
    }, 15000); // Trigger every 15 seconds

    return () => clearInterval(interval);
  }
};
