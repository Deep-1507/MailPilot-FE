import { createLazyFileRoute } from '@tanstack/react-router'
import ManageTemplate from '@/features/manageTemplates'

export const Route = createLazyFileRoute('/_authenticated/manageTemplates/')({
  component: ManageTemplate,
})
