import images from "~/static/images.json";

export default defineEventHandler(async (event) => {
  return images[Math.floor(Math.random() * images.length)];
});
