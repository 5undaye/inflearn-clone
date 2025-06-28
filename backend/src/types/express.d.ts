declare global {
  namespace Express {
    interface User {
      sub: string;
      email?: string;
      name?: string;
      picture?: null;
      iat?: number;
    }
  }
}

export {};
