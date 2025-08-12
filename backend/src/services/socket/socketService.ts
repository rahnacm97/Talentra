import { Socket, Server } from 'socket.io';
import { ISocketService } from '../../interfaces/socket/ISocketService';
import { JwtService } from '../../utils/jwtUtils';

export class SocketService implements ISocketService {
  private io: Server;
  private connectedUsers: Map<string, Socket>;
  private jwtService: JwtService;

  constructor(io: Server, jwtService: JwtService) {
    this.io = io;
    this.connectedUsers = new Map<string, Socket>();
    this.jwtService = jwtService;
    this.setupConnectionHandler();
  }

  private setupConnectionHandler(): void {
    this.io.on('connection', async (socket: Socket) => {
      const token = socket.handshake.auth.token;
      const userId = socket.handshake.query.userId as string;

      if (!userId) {
        console.error('Missing userId in handshake');
        socket.emit('error', { message: 'Missing userId in handshake' });
        socket.disconnect();
        return;
      }

      try {
        if (!token) {
          throw new Error('No token provided');
        }
        const decoded = await this.jwtService.verifyToken(token);
        if (decoded.userId !== userId) {
          throw new Error('UserId mismatch between token and query');
        }

        this.connectedUsers.set(userId, socket);
        socket.join(userId);

        socket.on('disconnect', (reason) => {
          this.connectedUsers.delete(userId);
        });
      } catch (error: any) {
        console.error(`WebSocket authentication failed for user ${userId}: ${error.message}`);
        socket.emit('error', { message: `Authentication failed: ${error.message}` });
        socket.disconnect();
      }
    });
  }

  emitUserBlocked(userId: string): void {
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      console.log(`Emitting userBlocked to user ${userId} on socket ${socket.id}`);
      socket.emit('userBlocked', { message: 'Your account has been blocked by the admin.' });
    } else {
      console.error(`No socket found for user ${userId}`);
    }
  }

  to(room: string): { emit(event: string, data: any): void } {
    return {
      emit: (event: string, data: any) => {
        console.log(`Emitting ${event} to room ${room}`);
        this.io.to(room).emit(event, data);
      },
    };
  }

  getIO(): Server {
    return this.io;
  }
}

export default SocketService;
