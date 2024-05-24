interface IScilUtils {
  alert: (s: string) => void; // to override
  isNullOrEmpty(s: string): boolean;
  endswith(s: string, token: string, casesensitive?: boolean): boolean;
}

export type ScilModuleType = {
  apply<T>(dest: T, atts: Partial<T>, defaults?: Partial<T>): void;
  Utils: IScilUtils;
}
