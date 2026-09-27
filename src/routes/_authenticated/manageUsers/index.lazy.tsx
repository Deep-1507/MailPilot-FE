import { createLazyFileRoute } from '@tanstack/react-router'
import ManageUsers from '@/features/manageUsers'

export const Route = createLazyFileRoute('/_authenticated/manageUsers/')({
  component: ManageUsers,
})
