import {HttpClient} from "./HttpClient";

class UserService {
    public async getAllUsers() {
        let users = await HttpClient.get('/api/users');

        return users.data;
    }
}

export { UserService };
export default new UserService();
