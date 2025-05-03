import { connection } from '../config/gremlin';
import gremlin from 'gremlin';
const g = gremlin.process.AnonymousTraversalSource.traversal().withRemote(connection);
export const execute = async (id: string) => {
  await g.V(id).drop().iterate();
  return { success: true };
};