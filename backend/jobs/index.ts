import {CleanDatabase} from './classes/CleanDatabase'
import {Logger} from "../logger/logger";

class Jobs {
    logger : Logger

    constructor() {
        this.logger = new Logger();
    }

    async startJobs() {
        this.logger.info("Staring jobs!")
        new CleanDatabase(this.logger).startJob();
        this.logger.info("All jobs started!");
    }
}

export default new Jobs();