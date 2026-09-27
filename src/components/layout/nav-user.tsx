import {
  ChevronsUpDown,
  LogOut
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from '@tanstack/react-router'

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter(); 
  // const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '', username: '' });

  const hasFetched = useRef(false);
  console.log(user)


  useEffect(() => {
    if (!hasFetched.current) {
      fetchuserdeatils();
      hasFetched.current = true;
    }
  }, []);


  const fetchuserdeatils = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      const token = localStorage.getItem("token");

      if (!token) {
        enqueueSnackbar("Kindly login or register first", { variant: "warning" });
        router.navigate({ to: "/sign-in" });
        return;
      }


      if (!BACKEND_URL) {
        throw new Error('BACKEND_URL is not defined');
      }
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/getuserdetail`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 200) {
        setUserDetails(response.data)
      } else {
        enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" });
      }
    } catch (err) {
      console.error("API Error:", err);
      if ((err as any).response) {
        enqueueSnackbar((err as any).response.data.message || "Something went wrong.", { variant: "error" });
      } else {
        enqueueSnackbar("An error occurred. Please try again later.", { variant: "error" });
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.navigate({ to: "/sign-in" });
  };


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className='rounded-lg'>{userDetails.firstName[0]}{userDetails.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{userDetails.firstName}{userDetails.lastName}</span>
                <span className='truncate text-xs'>{userDetails.username}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className='rounded-lg'>{userDetails.firstName}{userDetails.lastName}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{userDetails.firstName}{userDetails.lastName}</span>
                  <span className='truncate text-xs'>{userDetails.username}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
