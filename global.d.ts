declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN_ID: string;
      BOT_TOKEN_SECRET: string;
    }
  }
}

export { }