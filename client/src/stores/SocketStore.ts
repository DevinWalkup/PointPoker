import {reactive} from 'vue'
import {io, Socket} from "socket.io-client";
import {RouteParamValue} from "vue-router";

class SocketStore {
    private state;

    constructor() {
        this.state = reactive({
            socket: null
        })
    }

    async createSocket(userId: String, gameId: string | RouteParamValue[]) {
        // @ts-ignore
        this.state.socket = io(`${import.meta.env.VITE_API_URL}`, {query: `userid=${userId}&gameid=${gameId}`})

        this.state.socket.on('connect', function () {
            return new Promise<boolean>((resolve, reject) => {
                resolve(true);
            })
        })
    }

    emitEvent(eventName: String, args : any){
        this.state.socket.emit(eventName, {...args});
    }

    get socket() : Socket {
        return this.state.socket;
    }

    get socketSet() {
        return this.state.socket !== null;
    }

    delete() {
        this.state.socket.disconnect();

        this.state.socket = null;
    }
}

export {SocketStore}
export default new SocketStore();