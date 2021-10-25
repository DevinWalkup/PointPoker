export interface SocketSessionProps {
    userId: String,
    gameId: String
}

export interface UserSocketProps {
    userId: String
}

export interface Sockets {
    userId: String,
    gameId: String,
    createdDate: Date
}