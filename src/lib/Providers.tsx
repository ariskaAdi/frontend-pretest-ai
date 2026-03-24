'use client'

import * as React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientTS } from './queryClientTS'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClientTS}>{children}</QueryClientProvider>
}
