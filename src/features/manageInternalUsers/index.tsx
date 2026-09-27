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

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { Pencil,Trash } from "lucide-react";
import { useRouter,useSearch} from '@tanstack/react-router';


const userformSchema = z.object({
    name: z.string().min(1, {
        message: 'Name cannot be empty.'
    }),
    email: z.string().email().min(1, {
        message: 'Email cannot be empty'
    })
});



export default function ManageInternalUsers() {

    const router = useRouter(); 
    const { enqueueSnackbar } = useSnackbar();
    interface Group {
        _id: string;
        name: string;
        email: string;
    }
    
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const hasFetched = useRef(false);
    const [businessUsers, setBusinessUsers] = useState<Group[]>([]);
    const [groupName, setGroupName] = useState("");
    const searchParams = useSearch({ from: "/_authenticated/manageInternalUsers/" });
    const id = (searchParams as { id?: string })?.id;


    const userform = useForm<z.infer<typeof userformSchema>>({
        resolver: zodResolver(userformSchema),
        defaultValues: {
            name: '',
            email: ''
        }
    });

    const {
        formState: { isSubmitting }
    } = userform;

    useEffect(() => {
        if (!hasFetched.current) {
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
            router.navigate({ to: "/sign-in" });
            return;
          }
      
          if (!BACKEND_URL) {
            throw new Error("BACKEND_URL is not defined");
          }
      
          const response = await axios.get(`${BACKEND_URL}/api/v6/groups/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response.status === 200) {
            setBusinessUsers(response.data.group.users);
            setGroupName(response.data.group.groupName)
            console.log(response.data.group.users)
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
      

    const handleDelete = async (email: any) => {
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
            const response = await axios.delete(
                `${BACKEND_URL}/api/v6/groups/${id}/users/${email}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status === 200) {
                enqueueSnackbar("User deleted successfully", { variant: "success" });
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

    const onSubmit = async (data: z.infer<typeof userformSchema>, email:any) => {
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
                `${BACKEND_URL}/api/v6/groups/${id}/users/${email}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status === 200) {
                enqueueSnackbar("User's Details updated successfully", { variant: "success" });
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

    useEffect(() => {
        if (selectedGroup) {
            userform.reset({
                email: selectedGroup?.email || '',
                name: selectedGroup?.name || ''
            });
        }
    }, [selectedGroup, useForm]);



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
                    <h1 className='text-2xl font-bold tracking-tight'>Manage User's ({groupName})</h1>
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
                        Manage your {groupName} here!
                    </p>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        User's Count
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>{businessUsers.length}</div>
                                    <p className='text-xs text-muted-foreground'>
                                        Total number of users in this group
                                    </p>
                                </CardContent>
                            </Card>

                        </div>
                    </TabsContent>

                    <div className="pt-4">
                        <Table className="border rounded-lg">
                            <TableHeader>
                                <TableRow className='bg-secondary'>
                                    <TableHead>User's Email</TableHead>
                                    <TableHead>User's Name</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className='max-h-[650px] overflow-y-auto'>
                                {businessUsers.length > 0 ? (
                                    businessUsers.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {/* Add Users Dialog */}
                                                    {/* <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button onClick={() => setSelectedGroup(item)}>
                                                                <Plus /> Add Users
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <strong>Group Name: </strong><p>{item.groupName}</p>
                                                                <DialogTitle>Add User</DialogTitle>
                                                                <DialogDescription>
                                                                    <Form {...userform}>
                                                                        <form onSubmit={userform.handleSubmit((data) => 
                                                                                onSubmitUser(data, selectedGroup?._id))} className="space-y-8">
                                                                            <FormField
                                                                                control={userform.control}
                                                                                name="name"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>Enter the User's full name</FormLabel>
                                                                                        <FormControl>
                                                                                            <Input placeholder="Deependra Kumar" {...field} />
                                                                                        </FormControl>
                                                                                        <FormDescription>
                                                                                            This is the name by which the users will be visible.
                                                                                        </FormDescription>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                            <FormField
                                                                                control={userform.control}
                                                                                name="email"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>User's Email Id</FormLabel>
                                                                                        <FormControl>
                                                                                            <Input placeholder="deependra@rapydlaunch.com" {...field} />
                                                                                        </FormControl>
                                                                                        <FormDescription>
                                                                                            The mails will be sent to this email id.
                                                                                        </FormDescription>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                            <Button disabled={isUserSubmitting} type="submit">
                                                                                Submit
                                                                            </Button>
                                                                        </form>
                                                                    </Form>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog> */}

                                                    {/* Edit User Dialog */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button onClick={() => setSelectedGroup(item)}>
                                                                <Pencil size={20} />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Edit User's Details</DialogTitle>
                                                                <DialogDescription>
                                                                    <Form {...userform}>
                                                                        <form
                                                                            onSubmit={userform.handleSubmit((data:any) =>
                                                                                onSubmit(data, selectedGroup?.email||"")
                                                                            )}
                                                                            className="space-y-8"
                                                                        >
                                                                            <FormField
                                                                                control={userform.control}
                                                                                name="email"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>Enter User's Email</FormLabel>
                                                                                        <FormControl>
                                                                                            <Input {...field} />
                                                                                        </FormControl>
                                                                                        <FormDescription>
                                                                                            The Mails will be sent to this Email.
                                                                                        </FormDescription>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />

                                                                            <FormField
                                                                                control={userform.control}
                                                                                name="name"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>Enter User's Name</FormLabel>
                                                                                        <FormControl>
                                                                                            <Input {...field} />
                                                                                        </FormControl>
                                                                                        <FormDescription>
                                                                                            The Mails will be sent by this Name.
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

                                                    {/* Delete Button */}
                                                    <Button onClick={() => handleDelete(item?.email||"")} className="bg-red-600">
                                                        <Trash size={20} />
                                                    </Button>
                                                </div>
                                            </TableCell>


                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center p-4">
                                            No users available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center font-medium">
                                        Total: {businessUsers.length} records
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>

                </Tabs>
            </Main>
        </>
    )
}