import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const SUPPORTED_LOCALES = ['id', 'en'] as const
const DEFAULT_LOCALE = 'id'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const raw = cookieStore.get('locale')?.value
  const locale = raw && SUPPORTED_LOCALES.includes(raw as typeof SUPPORTED_LOCALES[number])
    ? raw
    : DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
