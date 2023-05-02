export type ITypeFromArray<
  T extends ReadonlyArray<unknown>
> = T extends ReadonlyArray<infer TypeFromArray> ? TypeFromArray : never;

export type IInferValueTypes<T> = T extends { [key: string]: infer U }
  ? U
  : never;
