import gremlinClient from '../db/gremlinCLient';
import { logger } from '../logger';

export const execute = async (id: string) => {
  try {
    const query = `g.V('${id}').elementMap()`;
    logger.info(`Retrieving vertex ${id} with query: ${query}`);

    const result = await gremlinClient.submit(query);
    const value = result._items?.[0]; // Gremlin responses are usually arrays
    return value || null;
  } catch (error) {
    logger.error(`❌ Failed to retrieve vertex ${id}`, error);
    throw error;
  }
};
