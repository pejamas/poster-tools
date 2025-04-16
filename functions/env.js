export async function onRequest(context) {
  return new Response(`window.POSTER_API_URL = "${context.env.API_URL}";`, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
}