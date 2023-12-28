const MAX_RETRY = 3;
const RETRY_INTERVAL = 1000;

export function sleep(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function fetchRetry(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  let retryLeft = MAX_RETRY;
  while (retryLeft > 0) {
    try {
      return await fetch(input, init);
    } catch (err) {
      await sleep(RETRY_INTERVAL);
    } finally {
      retryLeft -= 1;
    }
  }
  throw new Error(`Too many retries`);
}
