import { App } from './app';
import {User} from "./Types/UserTypes";

declare module 'express-session' {
    export interface SessionData {
        user: User;
    }
}

let app = new App().app;

export { app };