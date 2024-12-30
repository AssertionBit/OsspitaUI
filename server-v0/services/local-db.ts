import { ILogObj, Logger } from "tslog";
import { Database } from 'bun:sqlite';


/** Interface to local database element
  * 
  * @version 1.0.0
  * @since 1.0.0
  */
export default class LocalDB {
    private _connection: Database;
    private _logger: Logger<ILogObj>;

    public get location() : string {
        return this._connection.filename;
    }

    /**
      * @param fdqn String, containing connection instructions to database
      * @param logger Logger, instance for this database 
      */
    constructor(fdqn: string, logger: Logger<ILogObj>) {
        this._logger = logger;
        this._connection = this._parseFDQN(fdqn);

        this._logger.info("Initiated instance of database");
        this._logger.debug(`Database instance location location=${this._connection.filename}`);
    }

    private _parseFDQN(params: string): Database {
        if(params.startsWith("sqlite:")) {
            return this._loadSQLite(params.split("sqlite:")[1]);
        }

        throw new Error("connection is not understandable");
    }

    private _loadSQLite(location: string): Database {
        return new Database(location);
    }
}
