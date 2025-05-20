import { getGremlinClient } from '../db/gremlinClient';
import { logger } from '../logger/logs';

type EdgeInput = {
  label: string;
  fromKey: string;
  fromVal: string;
  toKey: string;
  toVal: string;
  props?: { [key: string]: any };
};

export const execute = async (edge: EdgeInput) => {
  try {
    const props = Object.entries(edge.props || {})
      .filter(([_, value]) => typeof value === 'string' && value.trim() !== '')
      .map(([key, value]) => {
        const safeVal = String(value).replace(/"/g, '\\"');
        return `.property('${key}', "${safeVal}")`;
      })
      .join('');

    const fromKey = edge.fromKey || 'name';
    const toKey = edge.toKey || 'name';

    const query = `g.V().has('${fromKey}', '${edge.fromVal}').addE('${edge.label}').to(__.V().has('${toKey}', '${edge.toVal}'))${props}`;
    
    logger.info(`Creating edge with query: ${query}`);
    const result = await getGremlinClient().submit(query);
    return result;
  } catch (error) {
    logger.error('❌ Edge creation failed', error);
    throw error;
  }
};
