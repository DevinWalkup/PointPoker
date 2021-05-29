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
            currentVote: null
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

    public setCurrentStory() {
        if (!this.state.game.stories) {
            return null;
        }

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

    get hasUsers() {
        return this.state.game.users ? this.state.game.users.length > 0 : false;
    }

    public users(){
        return this.state.game.users;
    }

    get autoShowVotes() {
        return this.state.game.autoShowVotes;
    }

    get nextStory() {
        let setStory = false;

        let nextStory = null;

        this.state.game.stories.forEach((story) => {
            if (nextStory) {
                return;
            }

            if (setStory) {
                nextStory = story;
                return;
            }

            if (story.storyId === this.state.currentStory.storyId){
                setStory = true;
            }
        })

        return nextStory;
    }

    get autoSwitchStory() {
        return this.state.game.autoSwitchStory;
    }

    get hasStories() {
        return this.state.game.stories ? this.state.game.stories.length > 0 : false;
    }
}

export {GameStore}
export default new GameStore();

