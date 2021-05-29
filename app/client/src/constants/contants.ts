export enum GameEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    GAME_UPDATE = 'game_update',
    GAME_DELETE = 'game_delete',
    LEAVE_GAME = 'leave_game'
}

export enum UserEvents {
    ROLE_CHANGE = "role_change"
}

export enum RoleType {
    ADMIN,
    EDITOR,
    USER
}