import {reactive} from 'vue'

enum RoleType {
    ADMIN,
    EDITOR,
    USER
}


class UserStore {
    private state;

    constructor() {
        this.state = reactive({
            user: null,
            userRole: RoleType.USER,
            joiningUser: false
        })
    }

    get user() {
        return this.state.user;
    }

    public isEditor() : boolean {
        return this.state.userRole !== RoleType[RoleType.USER];
    }

    public isAdmin() : boolean {
        return this.state.userRole === RoleType[RoleType.ADMIN];
    }

    public setUser(user) {
        this.state.user = user;

        this.state.userRole = RoleType[user.roleType];
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