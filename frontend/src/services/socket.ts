import { io, Socket } from 'socket.io-client';

interface ISocketService {
  connect(userId: string, token: string): void;
  onUserBlocked(callback: (data: { message: string }) => void): void;
  onEmployerVerified(callback: () => void): void; 
  onEmployerRejected(callback: (data: { rejectionReason?: string }) => void): void; 
  offUserBlocked(): void; 
  offEmployerVerified(): void; 
  offEmployerRejected(): void; 
  onConnectError(callback: (error: Error) => void): void;
  disconnect(): void;
}

class SocketService implements ISocketService {
  private socket: Socket | null = null;

  connect(userId: string, token: string) {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error('VITE_API_URL is not defined');
      throw new Error('WebSocket connection failed: API base URL not configured');
    }
    this.socket = io(apiUrl, {
      auth: { token },
      query: { userId },
      reconnection: true,
    });
  }

  onUserBlocked(callback: (data: { message: string }) => void) {
    this.socket?.on('userBlocked', (data) => {
      callback(data);
    });
  }

  onEmployerVerified(callback: () => void) {
    this.socket?.on('employerVerified', callback);
  }


  onEmployerRejected(callback: (data: { rejectionReason?: string }) => void) {
    this.socket?.on('employerRejected', (data) => {
      console.log('Received employerRejected event:', data);
      callback(data);
    });
  }

  offUserBlocked() {
    this.socket?.off('userBlocked');
  }

  offEmployerVerified() {
    this.socket?.off('employerVerified');
  }

  offEmployerRejected() {
    this.socket?.off('employerRejected');
  }

  onConnectError(callback: (error: Error) => void) {
    this.socket?.on('connect_error', callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    console.log('WebSocket disconnected');
  }
}

export const socketService = new SocketService();