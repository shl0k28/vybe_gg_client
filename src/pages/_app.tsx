import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/jura'
import '@fontsource/manrope'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
