import { config } from "../../Checkout";

export default class Tokens {
  constructor(config: config);

  request: (body: Object) => Promise<Object>;
  getTokenMetadata: (tokenId: string) => Promise<Object>;
}
