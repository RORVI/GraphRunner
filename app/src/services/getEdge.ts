import {getGremlinClient} from '../db/gremlinClient';
import { logger } from '../logger/logs';

export const execute = async (edgeId: string) => {
  try {
    const query = `g.E('${edgeId}').elementMap()`;
    logger.info(`Retrieving edge ${edgeId} with query: ${query}`);

    const result = await getGremlinClient().submit(query);
    const value = result._items?.[0];
    return value || null;
  } catch (error) {
    logger.error(`❌ Failed to retrieve edge ${edgeId}`, error);
    throw error;
  }
};
