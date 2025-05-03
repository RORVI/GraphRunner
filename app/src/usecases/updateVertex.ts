import { connection } from '../config/gremlin';
import gremlin from 'gremlin';
const g = gremlin.process.AnonymousTraversalSource.traversal().withRemote(connection);
export const execute = async (id: string, updates: any) => {
  let traversal = g.V(id);
  Object.keys(updates).forEach(key => {
    traversal = traversal.property(key, updates[key]);
  });
  const result = await traversal.next();
  return result.value;
};