import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

const formSchema = z.object({
  username: z.string().email({
    message: 'Invalid email address.'
  }),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});


export default function ProfileForm() {

  const router = useRouter(); 
  const { enqueueSnackbar } = useSnackbar();
  const [userDetails, setUserDetails] = useState<{ username: string; firstName: string; lastName: string; password: string } | null>(null);
  const [APIKEY, setAPIKEY] = useState("");
  const hasFetched = useRef(false);


   const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues: {
              username: userDetails?.username || "",
              firstName: userDetails?.firstName || "",
              lastName: userDetails?.lastName || "",
              password: userDetails?.password || "",
          }
      });
  
        useEffect(() => {
              if (userDetails) {
                  form.reset({
                    username: userDetails?.username || "",
                    firstName: userDetails?.firstName || "",
                    lastName: userDetails?.lastName || "",
                    password: userDetails?.password || "",
                  });
              }
          }, [userDetails, form]);
      


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
        fetchuserapikey(response.data.apiKeyId)
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

  const fetchuserapikey = async (id: any) => {
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
      const response = await axios.post(
        `${BACKEND_URL}/api/v5/getapikey`,
        { apiKeyId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 200) {
        enqueueSnackbar("API KEY fetched successfully", { variant: "success" });
        setAPIKEY(response.data.APIKEY)
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

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
              const response = await axios.put(
                  `${BACKEND_URL}/api/v1/`,
                  data,
                  {
                      headers: {
                          Authorization: `Bearer ${token}`
                      }
                  });
  
              if (response.status === 200) {
                  enqueueSnackbar("User Details updated successfully", { variant: "success" });
                  setTimeout(() => {
                    window.location.reload();
                  },1000)
              } else {
                  enqueueSnackbar("Something went wrong. Please try again.", { variant: "error" });
              }
          } catch (err) {
              console.error("API Error:", err);
              if ((err as any).response) {
                  enqueueSnackbar((err as any).response.data.message || "Something went wrong.", { variant: "error" });
              } else {
                  enqueueSnackbar("An error occurred. Please check your input.", { variant: "error" });
              }
          }
      };

  return (<>
    <p className='mb-4'><strong>Your API KEY: </strong>{APIKEY}</p>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

      
      
        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  </>
  )
}
