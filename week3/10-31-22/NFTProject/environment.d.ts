declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENCODE_PRIVATE_KEY: string;
      ETHERSCAN_API_KEY: string;
    }
  }
}

export {};
