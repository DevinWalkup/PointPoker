import io, {Socket} from 'socket.io-client';

class SocketService {
    private socket: Socket

    constructor() {
        this.socket = io('localhost:3080');
    }

    public async
}