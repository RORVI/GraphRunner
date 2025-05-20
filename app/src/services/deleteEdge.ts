import {getGremlinClient} from '../db/gremlinClient';
import { logger } from '../logger/logs';

export const execute = async (edgeId: string) => {
  try {
    const query = `g.E('${edgeId}').drop()`;
    logger.info(`Deleting edge ${edgeId} with query: ${query}`);

    await getGremlinClient().submit(query);
    return { success: true };
  } catch (error) {
    logger.error(`❌ Failed to delete edge ${edgeId}`, error);
    throw error;
  }
};
