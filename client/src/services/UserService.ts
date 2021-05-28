import {HttpClient} from "./HttpClient";
import UserStore from "../stores/UserStore";
import {ChangeUserRoleProps, JoinGameUserProps} from "../../../backend/Types/UserTypes";
import {AxiosResponse} from "axios";
import GameStore from "../stores/GameStore";

class UserService {
    public async GetCurrentUser() {
        await HttpClient.get('/api/users').then((res) => {
            if (res.data.user){
                UserStore.setUser(res.data.user);
            }
        })
    }

    public async JoinGame(data : JoinGameUserProps) {
        let response : AxiosResponse = await HttpClient.post('/api/users/joinGame', data);

        if (response.data) {
            UserStore.setUser(response.data.user);
            UserStore.setJoiningUser(true);

            GameStore.setGame(response.data.game);

            return true;
        }

        return false;
    }

    public async GetUser(userId: String) {
        let response : AxiosResponse = await HttpClient.get('/api/users/getUser', {userId: userId});

        if (response.data) {
            return response.data.user;
        }

        return null;
    }

    public async UpdateUserRole(data: ChangeUserRoleProps){
        let response : AxiosResponse = await HttpClient.patch('/api/users/updateUserRole', data);

        if (response.data) {
            return response.data.user;
        }

        return null;
    }
}

export { UserService };
export default new UserService();
