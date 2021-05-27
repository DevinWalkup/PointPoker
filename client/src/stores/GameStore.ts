import {reactive} from 'vue'
import points from "./PointStore"

class GameStore{
    public state;

    constructor() {

        this.state = reactive({
            game: null,
            gameUrl: '',
            currentStory: null,
            showVotes: false,
            loading: true,
            CurrentPointType: null,
        })
    }

    public setGame(game) {
        this.state.loading = true;
        this.state.game = game;

        //@ts-ignore
        this.state.gameUrl = `${import.meta.env.VITE_APP_URL}/game/${game.gameId}/join`;

        this.setCurrentStory();
        this.setPointType();

        this.state.loading = false;
    }

    public isLoading() {
        return this.state.loading || this.game === null;
    }

    get game() {
        return this.state.game;
    }

    get gameUrl() {
        return this.state.gameUrl;
    }

    get currentStory() {
        return this.state.currentStory;
    }

    private setCurrentStory() {
        this.state.currentStory = this.state.game.stories.filter(story => story.storyId === this.state.game.currentStoryId)[0] ?? null;
    }

    get currentStoryId(){
        return this.state.game.currentStoryId;
    }

    get currentPoints() {
        return this.state.CurrentPointType ? this.state.CurrentPointType.values : null;
    }

    public reset() {
        this.state ={
            game: null,
            gameUrl: '',
            currentStory: null,
            showVotes: false,
            loading: false,
            CurrentPointType: null,
        }
    }

    public setPointType() {
        this.state.CurrentPointType = points.Points.filter(p => p.pointTypeId === this.state.game.pointType)[0];
    }
}

export {GameStore}
export default new GameStore();

