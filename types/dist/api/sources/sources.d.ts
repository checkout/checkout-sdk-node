import { config } from "../../Checkout";

export default class Sources {
  constructor(config: config);

  add: (body: Object) => Promise<Object>;
}
