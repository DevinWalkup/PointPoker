export enum RoleType {
    ADMIN,
    EDITOR,
    USER
}

export interface CreateUserProps {
    name: String,
    roleType: RoleType
}

export interface User {
    userId: String,
    name: String,
    roleType: number,
    createdDate: Date
}

export interface JoinGameUserProps {
    name: String,
    gameId: String
}

export interface ChangeUserRoleProps {
    userId: String,
    roleType: RoleType
}