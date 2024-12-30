import LocalDB from "@services/local-db";
import { load_config } from "@utils/config";
import { ILogObj, Logger } from "tslog";

const BACKEND_VERSION = "0.1.0";

// Just for keeping all clear and readable.
function main() {
    console.log(`Starting OSspita@${BACKEND_VERSION}`);

    let config = load_config();

    const logger: Logger<ILogObj> = new Logger();
    
    const db_service = new LocalDB("sqlite::memory:", logger.getSubLogger({ name: "database" }));
}

// Small call trick
(()=>main())();
