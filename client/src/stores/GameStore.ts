import {reactive} from 'vue'
import points from "./PointStore"
import {RoleType} from '../constants/contants';

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
            currentVote: null,
            reloadPage: false,
            onlineUsers: [],
            tempOnlineUsers: [],
            resetOnlineUsersDebounce: null,
            votingUsers: [],
        })
    }

    public setGame(game) {
        this.state.loading = true;
        this.state.game = game;

        //@ts-ignore
        this.state.gameUrl = `${import.meta.env.VITE_APP_URL}/game/${game.gameId}/join`;

        this.setCurrentStory();
        this.setPointType();

        this.state.onlineUsers = game.onlineUsers;

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

    get votingUsers() {
        return this.state.game.users.filter((user) => {
            if (user.roleType !== RoleType.VIEWER) {
                return true;
            }

            return false;
        })
    }

    public setCurrentStory() {
        if (!this.game) {
            return;
        }

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

    public setOnlineUsers(onlineUsers) {
        if (!this.game) {
            return;
        }

        return this.state.onlineUsers = onlineUsers;
    }

    public reset() {
        this.state ={
            game: null,
            gameUrl: '',
            currentStory: null,
            showVotes: false,
            loading: false,
            CurrentPointType: null,
            onlineUsers: [],
            tempOnlineUsers: [],
            resetOnlineUsersDebounce: null
        }
    }

    public setPointType() {
        if (!this.game) {
            return;
        }

        this.state.CurrentPointType = points.Points.filter(p => p.pointTypeId === this.state.game.pointType)[0];
    }

    get hasUsers() {
        return this.state.game.users ? this.state.game.users.length > 0 : false;
    }

    public users(){
        if (!this.game) {
            return;
        }

        return this.state.game.users;
    }

    public getUserById(userId) {
        if (!this.hasUsers) {
            return null;
        }

        return this.state.game.users.find((user) => user.userId === userId);
    }

    get autoShowVotes() {
        return this.state.game.autoShowVotes;
    }

    public userDisconnectSetOnlineUser(userId) {
        if (!this.game) {
            return;
        }

        if (this.state.tempOnlineUsers.includes(userId)) {
            return;
        }

        this.state.tempOnlineUsers.push(userId);
        this.debounce(this.setOnlineToTemp, 5000);
    }

    public addOnlineUser(userId) {
        if (!this.game) {
            return;
        }

        if (!this.state.tempOnlineUsers.includes(userId)) {
            this.state.tempOnlineUsers.push(userId);
        }

        if (this.state.onlineUsers.includes(userId)) {
            return;
        }

        this.state.onlineUsers.push(userId);
    }

    private setOnlineToTemp() {
        if (!this.game) {
            return;
        }

        this.state.onlineUsers = this.state.tempOnlineUsers;

        this.state.tempOnlineUsers = [];
    }

    get nextStory() {
        let currentStoryIndex = this.state.game.stories
            .indexOf(this.state.currentStory) + 1;

        let setStory = currentStoryIndex === this.state.game.stories.length;

        if (!setStory) {
            if (this.state.game.stories[currentStoryIndex].storyPoint !== undefined) {
                setStory = true;
            }
        }

        let nextStory = null;

        this.state.game.stories.forEach((story) => {
            if (nextStory) {
                return;
            }

            if (setStory && story.storyPoint === undefined) {
                console.log("next story", story);
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

    get hasVotes(){
        if (!this.state.currentStory) {
            return false;
        }

        return !this.state.currentStory.votes ? false : this.state.currentStory.votes.length > 0;
    }

    public setReloadPage() {
        if (!this.game) {
            return;
        }

        this.state.reloadPage = true;
    }

    get reloadPage() {
        return this.state.reloadPage;
    }

    private debounce(func, wait, immediate?) {
        if (!this.game) {
            return;
        }

        let context = this, args = arguments;
        const later = function() {
            context.state.resetOnlineUsersDebounce = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !this.state.resetOnlineUsersDebounce;
        clearTimeout(this.state.resetOnlineUsersDebounce);
        this.state.resetOnlineUsersDebounce = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    }
}

export {GameStore}
export default new GameStore();

