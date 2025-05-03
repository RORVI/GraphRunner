import { connection } from '../config/gremlin';
import gremlin from 'gremlin';

const g = gremlin.process.AnonymousTraversalSource.traversal().withRemote(connection);

export const execute = async (data: any) => {
  const result = await g.addV(data.label || 'default').property('name', data.name).next();
  return result;
};