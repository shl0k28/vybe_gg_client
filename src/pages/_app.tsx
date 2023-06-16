import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@fontsource/jura'
import '@fontsource/manrope'

export default function App({ Component, pageProps }: AppProps) {
  
  const queryClient = new QueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
