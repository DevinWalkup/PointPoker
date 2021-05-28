export class Logger {

    constructor() {}

    public info(logText: string): void {
        console.log(new Date() + "info:::::" + logText);
    }

    public debug(logText: string): void {
        console.log(new Date() + "debug:::::" + logText);
    }

    public error(logText: string): void {
        console.log(new Date() + "error:::::" + logText);
    }

    public endpoint(endpoint: string): void{
        console.log(new Date() + "url:::::::" + endpoint);
    }

    public socket(event: string): void {
        console.log(new Date() + "socket:::::::" + event);
    }
}