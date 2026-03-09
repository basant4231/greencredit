import type { Mongoose } from "mongoose";
import type { DefaultSession } from "next-auth";

declare global {
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export {};
