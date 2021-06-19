export enum GameEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    GAME_UPDATE = 'game_update',
    GAME_DELETE = 'game_delete',
    LEAVE_GAME = 'leave_game',
    CREATE_STORY = 'create_story',
    USER_JOINED = 'user_joined'
}

export enum UserEvents {
    ROLE_CHANGE = "role_change"
}

export enum RoleType {
    ADMIN,
    EDITOR,
    USER
}
export interface JoinGameUserProps {
    name: String,
    gameId: String
}

export interface ChangeUserRoleProps {
    currentUserId: String,
    userId: String,
    roleType: RoleType
}
