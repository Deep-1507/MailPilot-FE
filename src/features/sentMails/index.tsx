import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { enqueueSnackbar } from 'notistack';
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
import { useRouter } from '@tanstack/react-router';
import {MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function SentMails() {

    // const navigate = useNavigate();
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
    const router = useRouter();
    const [sentMails, setSentMails] = useState<SentMail[]>([]);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchSentMails();
            hasFetched.current = true;
        }
    }, []);

    const fetchSentMails = async () => {
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");

            if (!token) {
                enqueueSnackbar("Kindly login or register first", { variant: "warning" });
                router.navigate({ to: "/sign-in" });
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
            if ((err as any).response) {
              enqueueSnackbar((err as any).response.data.message || "Something went wrong.", { variant: "error" });
            } else {
              enqueueSnackbar("An error occurred. Please check your input.", { variant: "error" });
            }
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

                        Your Complete Mail History is here!

                    </div>
                    <TabsContent value='overview' className='space-y-4'>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-4 pb-2'>
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
                            <div className="border rounded-lg overflow-hidden">
                                <div className="max-h-[650px] overflow-y-auto">
                                    <Table className="border rounded-lg">
                                        {/* Fixed Table Header */}
                                        <TableHeader className="sticky top-0 bg-secondary z-10">
                                            <TableRow>
                                                <TableHead>From</TableHead>
                                                <TableHead>To</TableHead>
                                                {/* <TableHead>Accepted</TableHead>
                                                <TableHead>Rejected</TableHead> */}
                                                <TableHead>Status</TableHead>
                                                <TableHead>Subject/Template</TableHead>
                                                <TableHead>Date & Time</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        {/* Scrollable Table Body */}
                                        <TableBody>
                                            {sentMails.length > 0 ? (
                                                sentMails.map((item) => (
                                                    <TableRow key={item._id}>
                                                        <TableCell>{item.from.split('@')[0].slice(0, 10)}...</TableCell>
                                                        <TableCell>
                                                            {Array.isArray(item.to) && item.to.length > 0
                                                                ? `${item.to[0].split('@')[0].slice(0, 10)}...`
                                                                : 'N/A'}
                                                        </TableCell>
                                                        {/* <TableCell>
                                                            {Array.isArray(item.accepted) && item.accepted.length > 0
                                                                ? `${item.accepted[0].split('@')[0].slice(0, 10)}...`
                                                                : 'N/A'}
                                                        </TableCell> */}
                                                        {/* <TableCell>
                                                            {Array.isArray(item.rejected) && item.rejected.length > 0
                                                                ? `${item.rejected[0].split('@')[0].slice(0, 10)}...`
                                                                : 'N/A'}
                                                        </TableCell> */}
                                                        <TableCell>{item.opened
                                                            ? <p className='text-green-500'>Mail Opened</p>
                                                            : <p>Mail Sent</p>}</TableCell>
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
                                                        <TableCell>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button>
                                                                        <MailCheck /> View Mail Data
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>

                                                                        <DialogTitle>{item.subject}</DialogTitle>
                                                                        <DialogDescription>
                                                                            <div><strong>From: </strong><>{item.from}</></div>
                                                                            <div><strong>To: </strong><>{item.to}</></div>
                                                                            {/* <div><strong>Accepted: </strong><>{item.accepted}</></div>
                                                                            <div><strong>Rejected: </strong><>{item.rejected ? item.rejected : "Null"}</></div> */}
                                                                            <div><strong>Response: </strong><>{item.response}</></div>
                                                                            <div className='flex'><strong>Status:&nbsp; </strong><>{item.opened
                                                                                ? <p className='text-green-500 '>Mail Opened</p>
                                                                                : <p>Mail Sent</p>}</></div>

                                                                            <div><strong>Date: </strong><>{new Date(item.createdAt).toLocaleString('en-IN', {
                                                                                day: '2-digit',
                                                                                month: 'short',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                                second: '2-digit',
                                                                                hour12: true,
                                                                            })}</></div>
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                </DialogContent>
                                                            </Dialog>


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

                                        {/* Footer */}
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center font-medium">
                                                    Total: {sentMails.length} records
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            </div>


                        </div>
                    </TabsContent>
                </Tabs>
            </Main>
        </>
    )
}
