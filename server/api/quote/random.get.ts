import quotes from "~/static/quotes.json";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  let availableQuotes: any[] = [];

  if (query.mood) {
    availableQuotes = quotes.filter(
      (quote: any) => quote["mood"] == (query.mood as string).toUpperCase()
    );
    if (!availableQuotes.length) {
      throw createError({
        statusCode: 404,
        message: "No quotes found for the specified mood",
      });
    }
  } else {
    availableQuotes = [...quotes];
  }

  return availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
});
