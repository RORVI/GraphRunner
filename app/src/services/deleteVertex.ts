import gremlinClient from '../db/gremlinCLient';
import { logger } from '../logger/logs';

export const execute = async (id: string) => {
  try {
    const query = `g.V('${id}').drop()`;
    logger.info(`Deleting vertex ${id} with query: ${query}`);
    
    await gremlinClient.submit(query);
    return { success: true };
  } catch (error) {
    logger.error(`❌ Failed to delete vertex ${id}`, error);
    throw error;
  }
};
