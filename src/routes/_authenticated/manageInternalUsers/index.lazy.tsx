import { createLazyFileRoute } from '@tanstack/react-router'
import ManageInternalUsers from '@/features/manageInternalUsers'

export const Route = createLazyFileRoute(
  '/_authenticated/manageInternalUsers/',
)({
  component: ManageInternalUsers,
})
