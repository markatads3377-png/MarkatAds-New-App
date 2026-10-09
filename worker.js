export default {
  async fetch(request, env) {
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) {
        const url = new URL(request.url);
        return env.ASSETS.fetch(new Request(new URL('/', url), request));
      }
      return response;
    } catch {
      return env.ASSETS.fetch(request);
    }
  },
};
