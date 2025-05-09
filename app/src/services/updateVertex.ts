import gremlinClient from '../db/gremlinCLient';
import { logger } from '../logger/logs';

type UpdatePayload = {
  [key: string]: any;
};

export const execute = async (id: string, updates: UpdatePayload) => {
  try {
    const props = Object.entries(updates)
      .filter(([_, value]) => typeof value === 'string' && value.trim() !== '')
      .map(([key, value]) => {
        const safeVal = String(value).replace(/"/g, '\\"');
        return `.property('${key}', "${safeVal}")`;
      })
      .join('');

    const query = `g.V('${id}')${props}`;
    logger.info(`Updating vertex ${id} with query: ${query}`);

    const result = await gremlinClient.submit(query);
    return result;
  } catch (error) {
    logger.error('❌ Vertex update failed', error);
    throw error;
  }
};
