import data from "./user-agent.json";
import "../../../hexo-seo/packages/js-prototypes/src/Array";
/**
 * All User-Agents
 */
export default data as string[];
/**
 * Random User-Agent
 * @returns
 */
export const random = (): string => {
  return (<string[]>data).shuffle().random();
};
