import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
} from '@/components/ui/tabs.js';
import { Overview } from './components/overview';
import { useRouter } from '@tanstack/react-router';

export default function Dashboard() {
  const router = useRouter(); 
  const { enqueueSnackbar } = useSnackbar();
  const [credentials, setCredentials] = useState([]);
  interface UserDetails {
    firstName: string;
  }
  
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  interface SentMail {
    opened: any;
    _id: string;
    from: string;
    to: string[];
    accepted: string[];
    rejected: string[];
    response: string;
    subject: string;
    createdAt: string;
  }

  const [sentMails, setSentMails] = useState<SentMail[]>([]);
  const [businessUsers, setBusinessUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCredentials();
      fetchTemplates();
      fetchSentMails();
      fetchuserdeatils();
      fetchBusinessUsers();
      hasFetched.current = true;
    }
  }, []);


  const fetchBusinessUsers = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      const token = localStorage.getItem("token");

      if (!token) {
        enqueueSnackbar("Kindly login or register first", { variant: "warning" });
        router.navigate({ to: "/sign-in" }); // Fixed navigation
        return;
      }

      if (!BACKEND_URL) {
        throw new Error('BACKEND_URL is not defined');
      }
      const response = await axios.get(
        `${BACKEND_URL}/api/v6/groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 200) {
        setBusinessUsers(response.data.groups);
        enqueueSnackbar("Business Users fetched successfully", { variant: "success" });
      } else {
        enqueueSnackbar(response.data.message || "Something went wrong.", { variant: "error" });
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

  const fetchCredentials = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      const token = localStorage.getItem("token");

      if (!token) {
        enqueueSnackbar("Kindly login or register first", { variant: "warning" });
        router.navigate({ to: "/sign-in" }); // Fixed navigation
        return;
      }

      if (!BACKEND_URL) {
        throw new Error('BACKEND_URL is not defined');
      }
      const response = await axios.get(
        `${BACKEND_URL}/api/v2/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 200) {
        enqueueSnackbar("Credential fetched successfully", { variant: "success" });
        setCredentials(response.data)
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

  const fetchTemplates = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      const token = localStorage.getItem("token");

      if (!token) {
        enqueueSnackbar("Kindly login or register first", { variant: "warning" });
        router.navigate({ to: "/sign-in" }); // Fixed navigation
        return;
      }

      if (!BACKEND_URL) {
        throw new Error('BACKEND_URL is not defined');
      }
      const response = await axios.get(
        `${BACKEND_URL}/api/v3/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 200) {
        enqueueSnackbar("Templates fetched successfully", { variant: "success" });
        setTemplates(response.data)
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

  const fetchuserdeatils = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      const token = localStorage.getItem("token");

      if (!token) {
        enqueueSnackbar("Kindly login or register first", { variant: "warning" });
        router.navigate({ to: "/sign-in" }); // Fixed navigation
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

  const fetchSentMails = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
  
      if (!token) {
        enqueueSnackbar("Kindly login or register first", { variant: "warning" });
        router.navigate({ to: "/sign-in" }); // Fixed navigation
        return;
      }
  
      if (!BACKEND_URL) {
        throw new Error("BACKEND_URL is not defined");
      }
  
      const response = await axios.get(`${BACKEND_URL}/api/v4/sentmailshistory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        const sortedMails = response.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  
        setSentMails(sortedMails);
        enqueueSnackbar("Data fetched successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to fetch data", { variant: "error" });
      }
    } catch (err) {
      console.error("API Error:", err);
      enqueueSnackbar("Failed to fetch data", { variant: "error" });
    }
  };
  

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          {/* <ThemeSwitch /> */}
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>

            Hello {userDetails?.firstName || "user"}! Welcome to your Personalized Dashboard

          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Credentials Count
                  </CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                  </svg>

                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{credentials.length}</div>
                  <p className='text-xs text-muted-foreground'>
                    Total number of Credentials Created by you
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Templates Count
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{templates.length}</div>
                  <p className='text-xs text-muted-foreground'>
                    Total number of Templates Created by you
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>User's Count</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>

                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{businessUsers.length}</div>
                  <p className='text-xs text-muted-foreground'>
                    Total number of Users Created by you
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Sent Mails Count
                  </CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'>
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>

                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{sentMails.length}</div>
                  <p className='text-xs text-muted-foreground'>
                    Total number of Mails Sent by you till date
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='pt-4'>

      <Overview/>

              <Table className="border rounded-lg">
                <TableHeader>
                  <TableRow className='bg-secondary'>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Accepted</TableHead>
                    <TableHead>Rejeced</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subject/Template</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='max-h-[650px] overflow-y-auto'>
                  {sentMails.length > 0 ? (
                    sentMails.map((item) => (
                      <TableRow key={item?._id}>
                        <TableCell>{item.from.split('@')[0].slice(0, 10)}...</TableCell>
                        <TableCell>
                          {Array.isArray(item.to) && item.to.length > 0
                            ? `${item.to[0].split('@')[0].slice(0, 10)}...`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(item.accepted) && item.accepted.length > 0
                            ? `${item.accepted[0].split('@')[0].slice(0, 10)}...`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(item.rejected) && item.rejected.length > 0
                            ? `${item.rejected[0].split('@')[0].slice(0, 10)}...`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{item.opened
                          ? "Mail Opened"
                          : "Mail sent"}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>
                          {new Date(item.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                          })}
                        </TableCell>

                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center p-4">
                        No mails sent yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center font-medium">
                      Total: {sentMails.length} records
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}