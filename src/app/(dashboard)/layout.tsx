'use client'

import { DashboardLayout } from '@/components/layouts/Dashboard'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
