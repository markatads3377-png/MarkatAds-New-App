import serverHandler from "./server";
import { getRouter } from "./router";

export interface CreateServerOptions {
  router?: ReturnType<typeof getRouter>;
}

export function createServer(options?: CreateServerOptions) {
  return serverHandler;
}

export { serverHandler };
export default serverHandler;
