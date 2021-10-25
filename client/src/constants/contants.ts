import {RouteParamValue} from "vue-router";

export enum GameEvents {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    GAME_UPDATE = 'game_update',
    GAME_DELETE = 'game_delete',
    LEAVE_GAME = 'leave_game',
    CREATE_STORY = 'create_story',
    USER_JOINED = 'user_joined',
    USER_STATUS_UPDATE = 'user_status_update'
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
    gameId: String | RouteParamValue[]
}

export interface ChangeUserRoleProps {
    currentUserId: String,
    userId: String,
    roleType: RoleType
}
