export type Valuable<T> = { [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] };
