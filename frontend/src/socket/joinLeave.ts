import { type Socket } from 'socket.io-client';

// Generic helpers: we do not assume backend internals.

export function joinDocument(socket: Socket, docId: string) {
  socket.emit('joinDocument', { docId });
}

export function leaveDocument(socket: Socket, docId: string) {
  socket.emit('leaveDocument', { docId });
}

