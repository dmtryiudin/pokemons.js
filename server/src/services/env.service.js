export class EnvService {
  static getValues() {
    return {
      VALUE_TO_SIGN_KEY: process.env.VALUE_TO_SIGN_KEY,
      DB_CONNECTION_URL: process.env.DB_CONNECTION_URL,
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
      POKEMONS_API: process.env.POKEMONS_API,
      ETHEREUM_RPC: process.env.ETHEREUM_RPC,
      EFFECTIVE_POKEMONS: process.env.EFFECTIVE_POKEMONS,
      PORT: process.env.PORT,
    };
  }

  static checkValues() {
    const envs = this.getValues();

    for (const key in envs) {
      if (!envs[key]) {
        throw new Error(`${key} env was not found`);
      }
    }
  }
}
