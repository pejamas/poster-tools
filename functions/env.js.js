export const onRequestGet = () => {
  return new Response(
    `window.POSTER_API_URL = "${POSTER_API_URL}";`,
    {
      headers: {
        "Content-Type": "application/javascript"
      }
    }
  );
};