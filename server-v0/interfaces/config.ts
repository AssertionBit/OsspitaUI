/** Web configuration. If not provided, wll use default one
 * 
 * @since 1.0.0
 */
export interface IWebConfig {
    "port": Number;
    "host-name": String;
}


/** General root config element
  * 
  * @since 1.0.0
  */
export interface IConfig {
    "home-path": String;
    "logging-path": String;
    "runtime-path": String;
    "web": IWebConfig | null;
}
