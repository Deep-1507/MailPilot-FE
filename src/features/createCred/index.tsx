import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { z } from 'zod';
import { useRouter } from '@tanstack/react-router';

const formSchema = z.object({
  companyName: z.string().min(1, {
    message: 'Company Name cannot be empty.'
  }),
  senderEmail: z.string().email({
    message: 'Invalid email address.'
  }),
  password: z.string().min(1, {
    message: "Password cannot be empty"
  })
});

export default function CreateCred() {
const router = useRouter(); 
  const { enqueueSnackbar } = useSnackbar();
  // const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      senderEmail: '',
      password: ''
    }
  });

  const {
    formState: { errors, isSubmitting }
  } = form;

  console.log('formState', errors);

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
      const response = await axios.post(
        `${BACKEND_URL}/api/v2/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 201) {
        enqueueSnackbar("Credential created successfully", { variant: "success" });
        setTimeout(() => {
          window.location.reload();
      }, 1000)
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


  return (
  <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Create Credentials</h2>
            <p className='text-muted-foreground'>
              Create your credentials here, which you can use to send the mails!
            </p>
          </div>
          {/* <TasksPrimaryButtons /> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 pt-4'>
          {/* <DataTable data={tasks} columns={columns} /> */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Company or Enterprise Name</FormLabel>
                    <FormControl>
                      <Input placeholder="RapydLaunch" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name by which you will manage the emails.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Email</FormLabel>
                    <FormControl>
                      <Input placeholder="deependra@rapydlaunch.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the mail id which will be used to send mails.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="abcd efgh ijkl" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide the password of the above mentioned email for authentication purpose.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </Main>
      </>
  )
}