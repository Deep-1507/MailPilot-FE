import { createLazyFileRoute } from '@tanstack/react-router'
import CreateUser from '@/features/createUsers'

export const Route = createLazyFileRoute('/_authenticated/createUsers/')({
  component: CreateUser,
})
