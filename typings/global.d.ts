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

      SWAGGER_USER: string;
      SWAGGER_PASSWORD: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      JWT_SECRET: string;
    }
  }

  namespace Express {
    interface Request {
      // customProps of pino-http
      customProps: object;
    }

    interface User extends Payload {
      roles: Array<string>;
      userId: string;
    }
  }
}
