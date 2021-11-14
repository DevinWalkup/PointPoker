import {reactive} from 'vue'

enum RoleType {
    ADMIN,
    EDITOR,
    USER,
    VIEWER
}

class UserStore {
    private state;

    constructor() {
        this.state = reactive({
            user: null,
            userRole: null,
            joiningUser: false
        })
    }

    get user() {
        return this.state.user;
    }

    public isEditor() : boolean {
        return this.state.userRole === RoleType[RoleType.EDITOR] || this.state.userRole === RoleType[RoleType.ADMIN];
    }

    public isAdmin() : boolean {
        return this.state.userRole === RoleType[RoleType.ADMIN];
    }

    public isViewer() : boolean {
        return this.state.userRole === RoleType[RoleType.VIEWER]
    }

    public setUser(user) {
        this.state.userRole = RoleType[user.roleType];

        this.state.user = user;
    }

    public setJoiningUser(value) {
        this.state.joiningUser = value;
    }

    get joinedUser() {
        return this.state.joiningUser;
    }

}

export {UserStore}
export default new UserStore();