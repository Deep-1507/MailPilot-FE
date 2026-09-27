import { createLazyFileRoute } from '@tanstack/react-router'
import IntegrateAPI from '@/features/integrateAPI'
export const Route = createLazyFileRoute('/_authenticated/integrateAPI/')({
  component: IntegrateAPI,
})
