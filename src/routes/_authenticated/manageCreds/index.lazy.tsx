import { createLazyFileRoute } from '@tanstack/react-router'
import ManageCred from '@/features/manageCreds'

export const Route = createLazyFileRoute('/_authenticated/manageCreds/')({
  component: ManageCred,
})
