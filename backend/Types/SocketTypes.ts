export interface SocketSessionProps {
    userId: String,
    gameId: String
}

export interface UserSocketRoleChangeProps {
    userId: String
}

export interface Sockets {
    userId: String,
    gameId: String,
    createdDate: Date
}