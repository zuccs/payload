type DeepMergeFn = <T1, T2>(target: T1, source: T2) => DeepMerge<T1, T2>
type DeepMergeAllFn = <T extends Array<any>>(...targets: T) => DeepMergeAll<{}, T>

type Primitive = bigint | boolean | null | number | string | symbol | undefined

type BuiltIns = Date | Primitive | RegExp

type MergeArrays<T, U> = T extends readonly any[]
  ? U extends readonly any[]
    ? [...T, ...U]
    : never
  : never

type DifferenceKeys<
  T,
  U,
  T0 = Omit<T, keyof U> & Omit<U, keyof T>,
  T1 = { [K in keyof T0]: T0[K] },
> = T1

type IntersectionKeys<T, U> = Omit<T | U, keyof DifferenceKeys<T, U>>

type DeepMergeHelper<
  T,
  U,
  T0 = { [K in keyof IntersectionKeys<T, U>]: DeepMerge<T[K], U[K]> } & DifferenceKeys<T, U>,
  T1 = { [K in keyof T0]: T0[K] },
> = T1

type DeepMerge<T, U> = U extends BuiltIns
  ? U
  : [T, U] extends [readonly any[], readonly any[]]
    ? MergeArrays<T, U>
    : [T, U] extends [{ [key: string]: unknown }, { [key: string]: unknown }]
      ? DeepMergeHelper<T, U>
      : U

type First<T> = T extends [infer _I, ...infer _Rest] ? _I : never
type Rest<T> = T extends [infer _I, ...infer _Rest] ? _Rest : never

type DeepMergeAll<R, T> = First<T> extends never ? R : DeepMergeAll<DeepMerge<R, First<T>>, Rest<T>>

type MergeArrayFnOptions = {
  clone: (value: any) => any
  deepmerge: DeepMergeFn
  getKeys: (value: object) => string[]
  isMergeableObject: (value: any) => boolean
}

type MergeArrayFn = (options: MergeArrayFnOptions) => (target: any[], source: any[]) => any[]

export interface Options {
  mergeArray?: MergeArrayFn
  symbols?: boolean
}
