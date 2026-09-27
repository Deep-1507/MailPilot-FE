import { createLazyFileRoute } from '@tanstack/react-router'

import ViewMails from '@/features/viewMails'

export const Route = createLazyFileRoute('/_authenticated/viewMails/')({
  component: ViewMails,
})
