import {getGremlinClient} from '../db/gremlinClient';
import { logger } from '../logger/logs';

type EdgeUpdatePayload = {
  [key: string]: any;
};

export const execute = async (edgeId: string, updates: EdgeUpdatePayload) => {
  try {
    const props = Object.entries(updates)
      .filter(([_, value]) => typeof value === 'string' && value.trim() !== '')
      .map(([key, value]) => {
        const safeVal = String(value).replace(/"/g, '\\"');
        return `.property('${key}', "${safeVal}")`;
      })
      .join('');

    const query = `g.E('${edgeId}')${props}`;
    logger.info(`Updating edge ${edgeId} with query: ${query}`);

    const result = await getGremlinClient().submit(query);
    return result;
  } catch (error) {
    logger.error(`❌ Failed to update edge ${edgeId}`, error);
    throw error;
  }
};
