import en, { type TranslationTree } from './en'

type NestedKeyOf<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? NestedKeyOf<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>
    : Prefix extends ''
      ? K
      : `${Prefix}.${K}`
}[keyof T & string]

export type TranslationKey = NestedKeyOf<TranslationTree>

function getByPath(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as object)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
  return typeof value === 'string' ? value : path
}

export function t(key: TranslationKey): string {
  return getByPath(en as unknown as Record<string, unknown>, key)
}
