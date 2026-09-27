import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
} from '@/components/ui/tabs.js';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useSnackbar } from 'notistack';
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
import { z } from 'zod';
import { Trash } from 'lucide-react';
import { Pencil } from "lucide-react";
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


export default function ManageCreds() {

    interface Credential {
        _id: string;
        companyName: string;
        senderEmail: string;
        password: string;
    }

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const hasFetched = useRef(false);
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: selectedCredential?.companyName || "",
            senderEmail: selectedCredential?.senderEmail || "",
            password: selectedCredential?.password || ""
        }
    });

    const {
        formState: { isSubmitting }
    } = form;

    useEffect(() => {
        if (!hasFetched.current) {
            fetchCredentials();
            hasFetched.current = true;
        }
    }, []);

    useEffect(() => {
        if (selectedCredential) {
            form.reset({
                companyName: selectedCredential.companyName || "",
                senderEmail: selectedCredential.senderEmail || "",
                password: selectedCredential.password || "",
            });
        }
    }, [selectedCredential, form]);


    const fetchCredentials = async () => {
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("token");

            if (!token) {
                enqueueSnackbar("Kindly login or register first", { variant: "warning" });
                router.navigate({ to: "/sign-in" });
            }

            if (!BACKEND_URL) {
                throw new Error('BACKEND_URL is not defined');
            }

            const response = await axios.get(`${BACKEND_URL}/api/v2/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                enqueueSnackbar("Credentials fetched successfully", { variant: "success" });
                setCredentials(response.data);
            }
        } catch (err) {
            console.error("API Error:", err);
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                enqueueSnackbar(err.response.data.message, { variant: "error" });
            } else {
                enqueueSnackbar("An unexpected error occurred.", { variant: "error" });
            }
        }
    };

    const handleDelete = async (id: any) => {
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
            const response = await axios.delete(
                `${BACKEND_URL}/api/v2/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status === 200) {
                enqueueSnackbar("Credentials deleted successfully", { variant: "success" });
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
    }

    const onSubmit = async (data: z.infer<typeof formSchema>, id: any) => {
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
            const response = await axios.put(
                `${BACKEND_URL}/api/v2/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status === 200) {
                enqueueSnackbar("Credentials updated successfully", { variant: "success" });
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
                    <h1 className='text-2xl font-bold tracking-tight'>Manage Credentials</h1>
                    <div className='flex items-center space-x-2'>
                        {/* <Button>Download</Button> */}
                    </div>
                </div>
                <Tabs
                    orientation='vertical'
                    defaultValue='overview'
                    className='space-y-4'
                >
                    <p className='text-muted-foreground'>
                        Manage your Credentials here!
                    </p>
                    <TabsContent value='overview' className='space-y-4'>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>

                            {
                                credentials.map((credential) => {
                                    return (
                                        <Card
                                            key={credential._id}
                                        >

                                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                                <CardTitle className='text-sm font-medium'>
                                                    {credential.companyName}
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent>
                                                <CardDescription className='block'><strong>Email: </strong>{credential.senderEmail}</CardDescription>
                                                <p className='text-xs text-muted-foreground'>
                                                    <strong>Password: </strong>{credential.password}
                                                </p>
                                            </CardContent>

                                            <div className="w-full flex justify-center pb-4">
                                                {/* Dialog Trigger Button */}
                                                <Dialog>
                                                    <div className="flex items-center gap-2">
                                                        <DialogTrigger asChild>
                                                            <Button onClick={() => setSelectedCredential(credential)}>

                                                                <Pencil size={20} />
                                                            </Button>

                                                        </DialogTrigger>
                                                        <Dialog open={open} onOpenChange={setOpen}>
                                                            <DialogTrigger asChild>
                                                                <Button className="bg-red-600">
                                                                    <Trash size={20} />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                                                </DialogHeader>
                                                                <p>Are you sure you want to delete this credential? This action cannot be undone.</p>
                                                                <DialogFooter>
                                                                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                                                    <Button
                                                                        className="bg-red-600"
                                                                        onClick={() => {
                                                                            handleDelete(credential._id);
                                                                            setOpen(false);
                                                                        }}
                                                                    >
                                                                        Confirm Delete
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>

                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle><p>{selectedCredential?.companyName}</p></DialogTitle>
                                                            <DialogDescription>
                                                                <Form {...form}>
                                                                    <form onSubmit={form.handleSubmit((data) => onSubmit(data, selectedCredential?._id))} className="space-y-8">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name="companyName"
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Enter Company or Enterprise Name</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input  {...field} />
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
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </Card>
                                    )
                                })
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            </Main>
        </>
    )
}

