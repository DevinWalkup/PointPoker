import {reactive} from 'vue';

class AppStore {
    private state;

    constructor() {
        this.state = reactive({
            // @ts-ignore
            appName: import.meta.env.VITE_APPLICATION_NAME
        })
    }

    get AppName() : string {
        return this.state.appName;
    }
}

export { AppStore };
export default new AppStore();