import en, { type TranslationTree } from './locales/en'
import vi from './locales/vi'

export type Locale = 'en' | 'vi'

const locales: Record<Locale, TranslationTree> = {
  en,
  // Until VI is fully translated, reuse EN so look-ups never miss keys.
  vi: { ...en, ...vi } as TranslationTree,
}

let currentLocale: Locale = 'en'

type NestedKeyOf<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? NestedKeyOf<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>
    : Prefix extends ''
      ? K
      : `${Prefix}.${K}`
}[keyof T & string]

export type TranslationKey = NestedKeyOf<TranslationTree>
export type { TranslationTree }

export function getLocale(): Locale {
  return currentLocale
}

export function setLocale(locale: Locale) {
  currentLocale = locale
}

export function getDictionary(locale: Locale = currentLocale): TranslationTree {
  return locales[locale] ?? locales.en
}

function getByPath(obj: Record<string, unknown>, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as object)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
  return typeof value === 'string' ? value : undefined
}

export function t(key: TranslationKey): string {
  const dict = getDictionary() as unknown as Record<string, unknown>
  return getByPath(dict, key) ?? key
}

function humanizeEntity(raw: string): string {
  const dict = getDictionary() as unknown as Record<string, unknown>
  const labeled = getByPath(dict, `entities.${raw}`)
  if (labeled) return labeled
  return raw
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function applyTemplate(template: string, entity: string): string {
  return template.replace('{entity}', entity)
}

function translateTemplateCode(messageCode: string): string | undefined {
  const dict = getDictionary() as unknown as Record<string, unknown>

  const notFound = /^error\.(.+)\.not-found$/.exec(messageCode)
  if (notFound) {
    const template =
      getByPath(dict, 'errorTemplates.notFound') ?? '{entity} was not found.'
    return applyTemplate(template, humanizeEntity(notFound[1]))
  }

  const invalid = /^error\.(.+)\.invalid$/.exec(messageCode)
  if (invalid) {
    const template =
      getByPath(dict, 'errorTemplates.invalid') ?? '{entity} is invalid.'
    return applyTemplate(template, humanizeEntity(invalid[1]))
  }

  const existed = /^error\.(.+)\.existed$/.exec(messageCode)
  if (existed) {
    const template =
      getByPath(dict, 'errorTemplates.existed') ?? '{entity} already exists.'
    return applyTemplate(template, humanizeEntity(existed[1]))
  }

  return undefined
}

/** Resolve backend `messageCode` against the active locale dictionary. */
export function translateMessageCode(
  messageCode?: string | null,
  fallback?: string,
): string {
  const dict = getDictionary() as unknown as Record<string, unknown>
  const defaultFallback =
    fallback ?? getByPath(dict, 'common.error') ?? 'Something went wrong'

  if (!messageCode) return defaultFallback

  const mapped = getByPath(dict, messageCode)
  if (mapped) return mapped

  const templated = translateTemplateCode(messageCode)
  if (templated) return templated

  return defaultFallback
}

export { default as en } from './locales/en'
