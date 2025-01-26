/**
 * Converts the provided arguments into a single flat array of strings.
 * Accepts multiple arguments, each of which can be a string or an array of strings.
 * If an argument is a string, it is wrapped in an array. If it is an array, it is flattened.
 *
 * @param {...(string | string[])[]} input - One or more strings or arrays of strings.
 * @returns {string[]} A flat array of strings.
 */
export function toStringArray(...input: (string | string[])[]): string[] {
  return input.flatMap((item) => (Array.isArray(item) ? item : [item]));
}
