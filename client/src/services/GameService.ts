import {HttpClient} from "./HttpClient";
import GameStore from "../stores/GameStore";
import AlertStore from "../stores/AlertStore";
import {AxiosResponse} from "axios";
import {CastVoteProps} from "../../../backend/Types/VoteTypes";
import {io, Socket} from "socket.io-client";

class GameService {
    public socket : Socket;

    public async createGame(items) {
        return await HttpClient.post('/api/games/create', items)
    }

    public async loadGame(gameId : String) {
        let params = {gameId: gameId};
        let response = await HttpClient.get('/api/games/getGame', params)

        if (response?.data) {
            GameStore.setGame(response.data.game);
        }
    }

    public async deleteGame() {
        let params = {gameId: GameStore.game.gameId}

        let response : AxiosResponse = await HttpClient.delete('/api/games', params);

        if (response.data.deleted) {
            GameStore.reset();
            AlertStore.success({"message": "Game was deleted!"});
            return true;
        }

        return false;
    }

    public async addStory(data) {
        let response : AxiosResponse = await HttpClient.post('/api/games/addStory', data);


        if (response?.data) {
            GameStore.setGame(response.data.game);
            return true;
        }

        return false;
    }

    public async setCurrentStory(data) {
        let response : AxiosResponse = await HttpClient.patch('/api/games/setCurrentStory', data);

        if (response?.data) {
            GameStore.setGame(response.data.game);
        }
    }

    public async castVote(voteData : CastVoteProps) {
        let response : AxiosResponse = await HttpClient.patch('/api/games/story/vote', voteData);

        if (response.data) {
            GameStore.setGame(response.data.game);
        }

        return true;
    }

    public async submitStoryPoint(data) {
        let response : AxiosResponse = await HttpClient.patch('/api/games/story/setStoryPoint', data);

        if(response.data){
            GameStore.setGame(response.data.game);
        }
    }

    public async toggleStoryVotesVisible(data) {
        let response : AxiosResponse = await HttpClient.patch('/api/games/story/toggleVotesVisible', data);

        if (response.data) {
            GameStore.setGame(response.data.game);
        }
    }

    public async UpdateStory(data) {
        let response : AxiosResponse = await HttpClient.patch('/api/games/story', data);

        if (response.data) {
            GameStore.setGame(response.data.game);
        }
        return true;
    }

    public async DeleteStory(data) {
        let response : AxiosResponse = await HttpClient.delete('/api/games/story', data);

        if (response.data) {
            GameStore.setGame(response.data.game);
        }

        return true;
    }
}

export { GameService };
export default new GameService();
