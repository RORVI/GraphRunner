import gremlinClient from '../db/gremlinCLient';
import { logger } from '../logger';

type VertexInput = {
  label: string;
  [key: string]: any;
};

export const execute = async (data: VertexInput) => {
  try {
    const props = Object.entries(data)
      .filter(([key, value]) => key !== 'label' && typeof value === 'string' && value.trim() !== '')
      .map(([key, value]) => {
        const safeVal = String(value).replace(/"/g, '\\"');
        return `.property('${key}', "${safeVal}")`;
      })
      .join('');

    const label = data.label || 'default';
    const query = `g.addV('${label}')${props}`;

    logger.info(`Executing query: ${query}`);
    const result = await gremlinClient.submit(query);
    return result;
  } catch (error) {
    logger.error('❌ Vertex creation failed', error);
    throw error;
  }
};
