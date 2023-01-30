/// <reference types="node" />
/**
 * run all _*.standalone.js inside src-posts (_config_yml.post_dir)
 * @returns
 */
declare function standaloneRunner(): NodeJS.ReadWriteStream;
export default standaloneRunner;
