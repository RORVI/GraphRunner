import {getGremlinClient} from '../db/gremlinClient';
import { logger } from '../logger/logs';

export const execute = async (id: string) => {
  try {
    const query = `g.V('${id}').elementMap()`;
    logger.info(`Retrieving vertex ${id} with query: ${query}`);

    const result = await getGremlinClient().submit(query);
    const value = result._items?.[0]; // Gremlin responses are usually arrays
    return value || null;
  } catch (error) {
    logger.error(`❌ Failed to retrieve vertex ${id}`, error);
    throw error;
  }
};
