import { Payload } from '../src/auth';

export declare global {
  type AnyObject = Record<string, unknown>;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;

      DATABASE_HOST: string;

      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }

  namespace Express {
    interface Request {
      // customProps of pino-http
      customProps: object;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends Payload {
      roles: Array<string>;
      userId: string;
    }
  }
}
