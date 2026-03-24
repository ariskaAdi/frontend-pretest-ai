import { QueryClient } from '@tanstack/react-query'

export const queryClientTS = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
})
