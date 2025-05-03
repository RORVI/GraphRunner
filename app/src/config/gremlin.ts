import gremlin from 'gremlin';
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;


export const connection = new DriverRemoteConnection('ws://localhost:8182/gremlin');