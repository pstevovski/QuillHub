/**
 *
 * Use the search parameters received when rendering the page server-side
 * and construct a single string consisting of all the parameters that the
 * user visited the page with.
 *
 */
export default function constructSearchParams(params: unknown): string {
  // If there are no search parameters to go trough, dont do anything
  if (!params || !Object.entries(params).length) return "";

  // Loop trough each entry of the params object
  // and append it to a single string containing each individual parameter
  let searchParams: string = "";

  Object.entries(params).forEach((param) => {
    const [key, value] = param;

    // If the string does not start with a "?" that means this is the first parameter to be appended
    // If the string does start with a "?" then any subsequent parameter will be appended
    if (!searchParams.startsWith("?")) {
      searchParams += `?${key}=${value}`;
    } else {
      searchParams += `&${key}=${value}`;
    }
  });

  return searchParams;
}
