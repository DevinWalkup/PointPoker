import {HttpClient} from "./HttpClient";
import UserStore from "../stores/UserStore";
import {AxiosResponse} from "axios";
import GameStore from "../stores/GameStore";
import {ChangeUserRoleProps, JoinGameUserProps} from "../constants/contants";

class UserService {
    public async GetCurrentUser() {
        let response : AxiosResponse = await HttpClient.get('/api/users');

        if (response.data.user){
            UserStore.setUser(response.data.user);

            return true;
        }

        return false;
    }

    public async JoinGame(data : JoinGameUserProps) {
        let response : AxiosResponse = await HttpClient.post('/api/users/joinGame', data);

        if (!response) {
            return false;
        }

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
