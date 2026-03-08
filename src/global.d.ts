import { Connection } from 'mongoose';

declare global {
  // This allows us to use global.mongoose without TypeScript errors
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};