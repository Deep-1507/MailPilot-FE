import { createLazyFileRoute } from '@tanstack/react-router'
import CreateTemplate from '@/features/createTemplates'

export const Route = createLazyFileRoute('/_authenticated/createTemplates/')({
  component: CreateTemplate,
})

