/**
 * Strips html tags and line breaks from a html string
 * @param string
 * @returns string without html
 */
export const stripHtml = (value: string) => {
  return value.replace(/<[^>]+>/g, "");
};
