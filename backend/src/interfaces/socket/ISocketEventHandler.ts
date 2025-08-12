export interface ISocketEventHandler {
  emitUserBlocked(userId: string): void;
  emitToRoom(room: string, event: string, data: any): void;
  emitEmployerVerified(userId: string): void;
  emitEmployerRejected(userId: string, rejectionReason: string): void;
}