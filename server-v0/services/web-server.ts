import { Database } from "bun:sqlite"
import { ILogObj, Logger } from "tslog";

export default class Server {
    private _logger: Logger<ILogObj>;
    private _db_con: Database;

    constructor(logger: Logger<ILogObj>, db: Database) {
        this._logger = logger;
        this._db_con = db;
    }

    private _loadRouting() {
        this._logger.info("Loading routes for each element");
    }
}
