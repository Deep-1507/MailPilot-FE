import {
  IconBrowserCheck,
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconSettings,
  IconUserCog,
} from '@tabler/icons-react'
import {
  AudioWaveform, 
  Command, 
  GalleryVerticalEnd, 
  KeyRound, 
  ShieldCheck, 
  Plus, 
  Mail,
  FilePlus,
  File,
  Code2,
  FileEdit,
  UserCog2,
  UserPlus,
  Group,
  History
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {

  
  user: {
    name: 'Aman Sharma',
    email: 'aman@rapydlaunch.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Rapydlaunch Admin',
      logo: Command,
      plan: 'NextJS',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Credentials',
          icon: KeyRound,
          items: [
            {
              title: "Create Credentials",
              url: '/createCred',
              icon: Plus,
            },
            {
              title: "Manage Credentials",
              url: '/manageCreds',
              icon: ShieldCheck
            },
          ]
        },
        {
          title: 'Templates',
          icon: File,
          items: [
            {
              title: "Create Templates",
              url: '/createTemplates',
              icon: FilePlus,
            },
            {
              title: "Manage Templates",
              url: '/manageTemplates',
              icon: FileEdit
            },
          ]
        },
        {
          title: 'Business Groups',
          icon: Group,
          items: [
            {
              title: "Create Groups",
              url: '/createUsers',
              icon: UserPlus,
            },
            {
              title: "Manage Groups",
              url: '/manageUsers',
              icon:UserCog2
            },
          ]
        },
        {
          title: 'Send Mails',
          url: '/sendMails',
          icon: Mail,
        },
        {
          title: 'View Mails',
          url: '/viewMails',
          icon: Mail,
        },
        {
          title: 'Mail History',
          url: '/sentMails',
          icon: History,
        },
        {
          title: 'Integrate API',
          url: '/integrateAPI',
          icon: Code2,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
