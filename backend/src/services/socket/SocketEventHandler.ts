import { ILogger } from '../../interfaces/logger/ILogger';
import { ISocketService } from '../../interfaces/socket/ISocketService';
import { ISocketEventHandler } from '../../interfaces/socket/ISocketEventHandler';

export class SocketEventHandler implements ISocketEventHandler {
  constructor(
    private socketService: ISocketService,
    private logger: ILogger
  ) {}

  emitUserBlocked(userId: string): void {
    this.logger.info(`Emitting userBlocked event for user ${userId}`);
    this.socketService.emitUserBlocked(userId);
  }

  emitToRoom(room: string, event: string, data: any): void {
    this.logger.info(`Emitting ${event} to room ${room}`);
    this.socketService.to(room).emit(event, data);
  }

  emitEmployerVerified(userId: string): void {
    this.logger.info(`Emitting employerVerified event for user ${userId}`);
    this.socketService.to(userId).emit('employerVerified', { message: 'Your employer account has been verified.' });
  }

  emitEmployerRejected(userId: string, rejectionReason: string): void {
    this.logger.info(`Emitting employerRejected event for user ${userId} with reason: ${rejectionReason}`);
    this.socketService.to(userId).emit('employerRejected', { message: 'Your employer account verification was rejected.', rejectionReason });
  }
}