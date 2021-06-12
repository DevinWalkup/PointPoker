import {CronJob} from 'cron'
import {GameService} from "../../services/GameService";
import {Game} from "../../Types/GameTypes";
import {SocketService} from "../../services/SocketService";
import {Sockets} from "../../Types/SocketTypes";
import {JobStatus, Logger} from "../../logger/logger";

class CleanDatabase {
    jobName: string = "CleanDatabase"
    cronJob: CronJob;
    gameService: GameService
    socketService: SocketService
    currentDate: Date
    logger : Logger

    constructor(logger : Logger) {
        this.logger = logger;
        this.gameService = new GameService();
        this.socketService = new SocketService();
        this.currentDate = new Date();

        this.cronJob = new CronJob('0 0 0 * * *', async() => {
            try {
                await this.main();
            }
            catch (e) {
                this.logger.error(e.toString());
            }
        });
    }

    async startJob(): Promise<void> {
        if (!this.cronJob.running) {
            this.cronJob.start();
        }
    }

    async main(): Promise<void> {
        this.logger.job(this.jobName, JobStatus.START)
        await this.cleanGames();
        await this.cleanSockets();
        this.logger.job(this.jobName, JobStatus.START)
    }

    async cleanGames(): Promise<void> {
        this.logger.info("Loading all games");
        let games = await this.gameService.GetAll();


        if (games.length <= 0) {
            this.logger.info(`There are no games to delete`)
            return;
        }

        this.logger.info(`There are ${games.length} games`)
        let gamesDeleted : number = 0;

        games.forEach((game : Game) => {
            console.log(this.daysBetween(game.createdDate))
            if (this.daysBetween(game.createdDate) >= 2){
                this.gameService.DeleteGame(game.gameId);
                gamesDeleted += 1;
            }
        })

        this.logger.info(`Finished deleting games. ${gamesDeleted} deleted`);
    }

    async cleanSockets(): Promise<void> {
        this.logger.info("Loading all sockets");
        let sockets = await this.socketService.GetAll();

        if (sockets.length <= 0) {
            this.logger.info("There are no sockets to delete");
            return;
        }

        this.logger.info(`There are ${sockets.length} sockets`)
        let socketsDeleted : number = 0;

        sockets.forEach((socket: Sockets) => {
            if (this.daysBetween(socket.createdDate) >= 2){
                this.socketService.DeleteSocketSession({gameId: socket.gameId, userId: socket.userId});
                socketsDeleted += 1;
            }
        })

        this.logger.info(`Finished deleting sockets. ${socketsDeleted} deleted`);
    }

    daysBetween(createdDate : Date) : number {
        return (this.currentDate.getDate() - createdDate.getDate());
    }
}

export {CleanDatabase}