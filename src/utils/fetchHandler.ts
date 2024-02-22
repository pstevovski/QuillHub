import handleErrorMessage from "./handleErrorMessage";

type Methods = "GET" | "POST" | "PUT" | "DELETE";

// todo: Update to use different property types based on "method" value
export default async function fetchHandler(
  method: Methods,
  endpoint: string,
  body?: Record<string, unknown> | undefined
) {
  try {
    const URL: string = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`;
    const response = await fetch(URL, {
      method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    // Exit function if response is 204 - No Content
    if (response.status === 204) return;

    // Parse the received data object
    const data = await response.json();

    // Throw error if the request has failed
    if (!response.ok) throw new Error(data.error);

    // Return the data if everything was ok
    return data;
  } catch (error) {
    throw new Error(handleErrorMessage(error));
  }
}
