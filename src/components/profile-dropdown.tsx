import { useRouter } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useRef, useEffect } from 'react';

export function ProfileDropdown() {


  const router = useRouter(); 
  const { enqueueSnackbar } = useSnackbar();
  const [userDetails, setUserDetails] = useState<{ firstName: string; lastName: string; username: string }>({
    firstName: "",
    lastName: "",
    username: ""
  });
  const hasFetched = useRef(false);


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

  
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>{userDetails.firstName[0]}{userDetails.lastName[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{userDetails.firstName}{userDetails.lastName}</p>
            <p className='text-xs leading-none text-muted-foreground'>
            {userDetails.username}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
