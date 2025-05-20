import { getGremlinClient } from '../db/gremlinClient';
import { logger } from '../logger/logs';

function sanitize(value: string): string {
  return value
    .replace(/\\/g, '')
    .replace(/"/g, '\"')
    .replace(/[\r\n]+/g, ' ');
}

export async function handleIngestion(vertices: any[], edges: any[]) {
  for (const vertex of vertices) {
    const props = Object.entries(vertex.props || {})
      .filter(([key, value]) => key !== 'id' && typeof value === 'string' && !value.includes('{{') && value.trim() !== '')
      .map(([key, value]) => `.property('${key}', "${sanitize(String(value))}")`)
      .join('');

    const query = `g.addV('${vertex.label}')${props}`;
    logger.info(`Sending Gremlin query: ${query}`);
    await getGremlinClient().submit(query);
  }

  for (const edge of edges) {
    const props = Object.entries(edge.props || {})
      .filter(([_, value]) => typeof value === 'string' && !value.includes('{{') && value.trim() !== '')
      .map(([key, value]) => `.property('${key}', "${sanitize(String(value))}")`)
      .join('');

    const fromKey = sanitize(String(edge.fromKey || 'name'));
    const toKey = sanitize(String(edge.toKey || 'name'));
    const fromVal = sanitize(String(edge.fromVal));
    const toVal = sanitize(String(edge.toVal));

    const query = `g.V().has('${fromKey}', '${fromVal}').addE('${edge.label}').to(__.V().has('${toKey}', '${toVal}'))${props}`;
    logger.info(`Sending Gremlin edge query: ${query}`);
    await getGremlinClient().submit(query);
  }
}
