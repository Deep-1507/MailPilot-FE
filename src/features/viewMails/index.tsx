import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "@tanstack/react-router";
import { io, Socket } from "socket.io-client";

const formSchema = z.object({
    credId: z.string().min(1, "Please select a credential"),
});

interface Credential {
    _id: string;
    companyName: string;
    senderEmail: string;
}

interface Mail {
    uid: number;
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    date: string;
    attachments: any[];
}

export default function ViewMails() {
    const router = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    const hasFetched = useRef(false);

    const socketRef = useRef<Socket | null>(null);

    const [credentials, setCredentials] = useState<Credential[]>([]);

    const [emails, setEmails] = useState<Mail[]>([]);

    const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

    const [hasLoadedInbox, setHasLoadedInbox] = useState(false);

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const userId = user.id;

    const [page, setPage] = useState(1);

    const [hasMore, setHasMore] = useState(true);

    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            credId: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const fetchCredentials = async () => {
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

            const token = localStorage.getItem("token");

            const user = JSON.parse(localStorage.getItem("user") || "{}");

            const userId = user.id;

            if (!token) {
                enqueueSnackbar("Please login first", {
                    variant: "warning",
                });

                router.navigate({
                    to: "/sign-in",
                });

                return;
            }

            const response = await axios.get(
                `${BACKEND_URL}/api/v2/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data)
            setCredentials(response.data);
            // console.log(credentials)
        } catch (err: any) {
            console.log(err);

            enqueueSnackbar(
                err?.response?.data?.message || "Unable to fetch credentials",
                {
                    variant: "error",
                }
            );
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            fetchCredentials();

            hasFetched.current = true;
        }

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!hasLoadedInbox) return;


        const observer = new IntersectionObserver(

            entries => {

                if (

                    entries[0].isIntersecting &&

                    hasMore &&

                    !isFetchingMore

                ) {

                    loadMoreMails();

                }

            },

            {

                threshold: 0.5

            }

        );

        if (loaderRef.current) {

            observer.observe(loaderRef.current);

        }

        return () => observer.disconnect();

    }, [

        page,

        hasMore,

        isFetchingMore,

        hasLoadedInbox

    ]);

    const viewMails = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

            const token = localStorage.getItem("token");

            if (!token) {
                enqueueSnackbar("Please login first", {
                    variant: "warning",
                });

                router.navigate({
                    to: "/sign-in",
                });

                return;
            }

            // Create socket only once
            if (!socketRef.current) {
                socketRef.current = io(BACKEND_URL, {
                    transports: ["websocket"],
                });

                socketRef.current.on("connect", () => {
                    console.log("Socket Connected");
                    socketRef.current?.emit("join", userId);
                });

                socketRef.current.on("connect_error", (err) => {
                    console.log(err);
                });

                socketRef.current.on("disconnect", () => {
                    console.log("Socket Disconnected");
                });

                socketRef.current.on("new-mail", (mail: Mail) => {
                    setEmails((prev) => [mail, ...prev]);

                    enqueueSnackbar("New Email Received", {
                        variant: "info",
                    });
                });
            }

            const response = await axios.post(
                `${BACKEND_URL}/api/mail/connect`,
                {
                    userId,
                    credId: values.credId,
                    page: 1,
                    limit: 50,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPage(1);

            setHasMore(true);

            setEmails(response.data.emails || []);
            setHasLoadedInbox(true);

            enqueueSnackbar("Emails Loaded Successfully", {
                variant: "success",
            });
        } catch (err: any) {
            console.error(err);

            enqueueSnackbar(
                err?.response?.data?.message || "Unable to load emails",
                {
                    variant: "error",
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const openMail = (mail: Mail) => {
        setSelectedMail(mail);

        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);

        setSelectedMail(null);
    };

    const refreshInbox = () => {
        form.handleSubmit(viewMails)();
    };

    const loadMoreMails = async () => {

        if (isFetchingMore || !hasMore) return;

        try {

            setIsFetchingMore(true);

            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

            const nextPage = page + 1;

            const response = await axios.post(

                `${BACKEND_URL}/api/mail/connect`,

                {

                    userId,

                    credId: form.getValues("credId"),

                    page: nextPage,

                    limit: 50

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const newEmails = response.data.emails || [];

            if (newEmails.length === 0) {

                setHasMore(false);

                return;

            }

            setEmails(prev => [

                ...prev,

                ...newEmails

            ]);

            setPage(nextPage);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setIsFetchingMore(false);

        }

    };

    return (
        <>
            <Header fixed>
                <Search />

                <div className="ml-auto flex items-center space-x-4">
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                {/* Heading */}

                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">
                        View Mails
                    </h2>

                    <p className="text-muted-foreground">
                        Select a credential and load its inbox.
                    </p>
                </div>

                {/* Form */}

                <div className="rounded-lg border p-6">

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(viewMails)}
                            className="space-y-6"
                        >

                            <FormField
                                control={form.control}
                                name="credId"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel>
                                            Select Credential
                                        </FormLabel>

                                        <FormControl>

                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >

                                                <SelectTrigger>

                                                    <SelectValue placeholder="Choose Credential" />

                                                </SelectTrigger>

                                                <SelectContent>

                                                    {credentials.map((cred) => (

                                                        <SelectItem
                                                            key={cred._id}
                                                            value={cred._id}
                                                        >

                                                            {cred.companyName} - {cred.senderEmail}

                                                        </SelectItem>

                                                    ))}

                                                </SelectContent>

                                            </Select>

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={loading || isSubmitting}
                            >
                                {loading ? "Loading..." : "View Mails"}
                            </Button>

                        </form>
                    </Form>

                </div>

                {/* Mail Table */}

                <div className="mt-8 rounded-lg border">

                    <Table>

                        <TableHeader>

                            <TableRow>

                                <TableHead>From</TableHead>

                                <TableHead>Subject</TableHead>

                                <TableHead>Date</TableHead>

                                <TableHead className="text-center">
                                    Action
                                </TableHead>

                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {emails.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8"
                                    >

                                        No Emails Found

                                    </TableCell>

                                </TableRow>

                            ) : (

                                emails.map((mail) => (

                                    <TableRow
                                        key={mail.uid}
                                    >

                                        <TableCell>

                                            <Badge variant="secondary">

                                                {mail.from}

                                            </Badge>

                                        </TableCell>

                                        <TableCell>

                                            {mail.subject}

                                        </TableCell>

                                        <TableCell>

                                            {new Date(mail.date).toLocaleString()}

                                        </TableCell>

                                        <TableCell className="text-center">

                                            <Button
                                                size="sm"
                                                onClick={() => openMail(mail)}
                                            >
                                                View
                                            </Button>

                                        </TableCell>

                                    </TableRow>

                                ))

                            )}

                        </TableBody>

                    </Table>

                    {emails.length > 0 && (
                        <div
                            ref={loaderRef}
                            className="flex justify-center py-10"
                        >
                            {isFetchingMore && (
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            )}
                        </div>
                    )}

                </div>

                {/* Dialog */}

                <Dialog
                    open={open}
                    onOpenChange={closeDialog}
                >

                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">

                        <DialogHeader>

                            <DialogTitle>

                                {selectedMail?.subject}

                            </DialogTitle>

                        </DialogHeader>

                        {selectedMail && (

                            <div className="space-y-5">

                                <div>

                                    <p>

                                        <strong>From :</strong>{" "}

                                        {selectedMail.from}

                                    </p>

                                    <p>

                                        <strong>To :</strong>{" "}

                                        {selectedMail.to}

                                    </p>

                                    <p>

                                        <strong>Date :</strong>{" "}

                                        {new Date(
                                            selectedMail.date
                                        ).toLocaleString()}

                                    </p>

                                </div>

                                <div className="rounded-lg border p-5">

                                    {selectedMail.html ? (

                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    selectedMail.html,
                                            }}
                                        />

                                    ) : (

                                        <pre className="whitespace-pre-wrap">

                                            {selectedMail.text}

                                        </pre>

                                    )}

                                </div>

                                {selectedMail.attachments.length >
                                    0 && (

                                        <div>

                                            <h3 className="font-semibold mb-3">

                                                Attachments

                                            </h3>

                                            {selectedMail.attachments.map(
                                                (file: any, index: number) => (

                                                    <div
                                                        key={index}
                                                        className="rounded border p-2 mb-2"
                                                    >

                                                        {file.filename}

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                            </div>

                        )}

                    </DialogContent>

                </Dialog>

            </Main>
        </>
    );




}