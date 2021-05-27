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
            userRole: RoleType.USER
        })
    }

    get user() {
        return this.state.user;
    }

    public isEditor() : boolean {
        return this.state.userRole !== RoleType[RoleType.USER];
    }

    public setUser(user) {
        this.state.user = user;

        this.state.userRole = RoleType[user.roleType];
    }

}

export {UserStore}
export default new UserStore();