export async function onRequest(context) {
  const apiUrl = context.env.API_URL;
  return new Response(`window.POSTER_API_URL = "${apiUrl}";`, {
    headers: {
      'Content-Type': 'application/javascript'
    }
  });
}