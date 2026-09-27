import { createLazyFileRoute } from '@tanstack/react-router'
import CreateCred from '@/features/createCred'

export const Route = createLazyFileRoute('/_authenticated/createCred/')({
  component: CreateCred,
})

