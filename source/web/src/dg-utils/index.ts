export function errMsg(err: any): string {
  if (typeof err === 'string' || err instanceof String)
    return err as string;
  else if (err.constructor.name === 'StateError')
    return err['message'];
  else if (err.constructor.name === 'StateError' && '$thrownJsError' in err)
    return errMsg(err['$thrownJsError']);
  else if (err instanceof Error)
    return (err as Error).message;
  else
    return err.toString();
}

export function errStack(err: any): string | undefined {
  if (err instanceof Error)
    return err.stack;
  else if (err.constructor.name === 'StateError' && '$thrownJsError' in err)
    return errStack(err['$thrownJsError']);
  return undefined;
}

export function errInfo(err: any): [string, string | undefined] {
  return [errMsg(err), errStack(err)];
}

// Returns test execution result or an error in case of timeout
export async function timeout<T>(
  promise: Promise<T>, testTimeout: number, timeoutReason: string = `timeout ${testTimeout} ms`
): Promise<T> {
  let timeout: number | null = null;
  // https://stackoverflow.com/questions/20068467/does-never-resolved-promise-cause-memory-leak
  // you don't have to worry about unresolved promises as long as you don't have external references to them
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeout = window.setTimeout(() => {
      reject(new Error(timeoutReason));
    }, testTimeout);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeout)
      clearTimeout(timeout);
  }
}
