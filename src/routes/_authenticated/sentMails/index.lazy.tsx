import { createLazyFileRoute } from '@tanstack/react-router'
import SentMails from '@/features/sentMails'

export const Route = createLazyFileRoute('/_authenticated/sentMails/')({
  component: SentMails,
})

