import { Server } from 'socket.io';

export interface ISocketService{
    to(room: string): {
        emit(event: string, data: any): void
    };
    emitUserBlocked(userId: string): void;
    getIO(): Server;
}