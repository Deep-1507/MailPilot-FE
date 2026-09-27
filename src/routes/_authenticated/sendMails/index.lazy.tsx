import { createLazyFileRoute } from '@tanstack/react-router'
import SendMails from '@/features/sendMails'

export const Route = createLazyFileRoute('/_authenticated/sendMails/')({
  component: SendMails,
})
