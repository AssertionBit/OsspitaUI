import { readFileSync } from "fs";
import { parse } from "toml";

import { IConfig } from "@interfaces/config";


/** Load configuration file from env or default path
  *
  * @returns Configuration file which will work as IConfig
  * @since 1.0.0
  */
export function load_config(): IConfig {
    const file_path = Bun.env.OSSPITA_HOME_PATH ? Bun.env.OSSPITA_HOME_PATH : "/etc/osspita/config.toml";

    console.debug(`Selected file path: ${file_path}`);

    const conf_result = readFileSync(file_path, 'utf-8');
    const config: IConfig = parse(conf_result);

    // When developing it is cool to see what is loaded
    console.debug("Loaded configuration\n", config);

    return config;
}
