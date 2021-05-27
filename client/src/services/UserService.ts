import {HttpClient} from "./HttpClient";
import UserStore from "../stores/UserStore";
import {JoinGameUserProps} from "../../../backend/Types/UserTypes";
import {AxiosResponse} from "axios";
import GameStore from "../stores/GameStore";

class UserService {
    public async isLoggedIn() {
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

            GameStore.setGame(response.data.game);

            return true;
        }

        return false;
    }
}

export { UserService };
export default new UserService();
