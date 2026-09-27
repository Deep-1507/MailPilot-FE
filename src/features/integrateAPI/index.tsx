import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { Button } from '@/components/ui/button';
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import { useEffect, useState, useRef } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from '@tanstack/react-router';


const formSchema = z.object({
    credId: z.string().min(1, {
        message: 'Credential cannot be empty.'
    }),
    templateId: z.string().min(1, {
        message: 'Template cannot be empty.'
    })
});

export default function IntegrateAPI() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [curlCommand, setCurlCommand] = useState("");
    const [APIKEY, setAPIKEY] = useState("");
    const [comments, setComments] = useState("");
    interface Template {
        _id: string;
        subject: string;
        comments?: string;
    }

    const [templates, setTemplates] = useState<Template[]>([]);
    interface Credential {
        _id: string;
        companyName: string;
        senderEmail: string;
    }

    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [copied, setCopied] = useState(false);
    const hasFetched = useRef(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            credId: '',
            templateId: ''
        }
    });

    const {
        formState: { isSubmitting }
    } = form;


    useEffect(() => {
        if (!hasFetched.current) {
            fetchuserdeatils();
            fetchTemplates();
            fetchCredentials();
            hasFetched.current = true;
        }
    }, []);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => {
                setCopied(false);
            }, 5000)

            return () => clearTimeout(timer);
        }
    }, [copied])

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

    const fetchTemplates = async () => {
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

    const fetchCredentials = async () => {
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

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Form Data Before submit:", data);

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



            const command = `
      curl --location "${BACKEND_URL}/api/v4/sendmail" \\
      --header 'Content-Type: application/json' \\
      --header 'Authorization: Bearer ${token}' \\
      --data-raw '{
          "to":["recipient1@example.com","recipient2@example.com"],
          "credId":"${data.credId}",
          "templateId":"${data.templateId}",
          "companyName":"Specify the Company name here",
          "recipientName":["Recipient 1","Recipient 2"],
          "apiKey":"${APIKEY}"
      }'`;

            setCurlCommand(command);

            enqueueSnackbar("Curl generated successfully!", { variant: "success" });

        } catch (err) {
            if ((err as any).response) {
              enqueueSnackbar((err as any).response.data.message || "Something went wrong.", { variant: "error" });
            } else {
              enqueueSnackbar("An error occurred. Please check your input.", { variant: "error" });
            }
          }
    };


    return (
        // <TasksProvider>
        <>
            <Header fixed>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                    {/* <ThemeSwitch /> */}
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Integrate API</h2>
                        <p className='text-muted-foreground'>
                            Select the mentioned details and generate a CURL request of the API and integrate it in your backend!
                        </p>
                    </div>
                    {/* <TasksPrimaryButtons /> */}
                </div>
                <div className="flex flex-col lg:flex-row gap-8 max-h-[650px] overflow-y-auto">
                    {/* Form Section */}
                    <div className="w-full lg:w-1/2 order-1">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="credId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Choose a Credential</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={(value) => field.onChange(value)}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a Credential" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {credentials.map((credentials) => (
                                                            <SelectItem key={credentials._id} value={credentials._id}>
                                                                {credentials.companyName} : {credentials.senderEmail}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>This credential will be used to send the email.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="templateId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Choose a Template</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        const selectedTemplate = templates.find((template) => template._id === value);
                                                        if (selectedTemplate) {
                                                            setComments(selectedTemplate.comments || "");
                                                        }
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a Template" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {templates.map((template) => (
                                                            <SelectItem key={template._id} value={template._id}>
                                                                {template.subject}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <h4> <strong>Note:</strong> {comments}</h4>
                                            <FormDescription>This template will be sent in the email.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                <Button disabled={isSubmitting} type="submit">
                                    Generate Curl
                                </Button>
                                {/* <button disabled={isSubmitting} className="absolute bottom-0 left-5 w-[80vh] bg-white p-2 shadow-md hover:shadow-[0_0_20px_#29e3e0] text-black rounded-md" type="submit">Send mail</button> */}
                            </form>
                        </Form>
                    </div>

                    {/* Preview Section*/}
                    {curlCommand ? (
                        <div className="w-full lg:w-1/2 order-2 lg:order-1 bg-black border rounded-lg">
                            <CopyToClipboard text={curlCommand} onCopy={() => setCopied(true)}>
                                <button className='text-white mx-4 border-2 mt-2 rounded-lg p-2'>
                                    {copied ? "Copied✅" : "Copy📋"}
                                </button>
                            </CopyToClipboard>
                            <pre className="overflow-x-auto whitespace-pre-wrap break-words text-white p-2 mb-4 mx-4">
                                {curlCommand.replace(/(Authorization: Bearer )(\S{10})\S+(\S{10})/, "$1$2...$3")}
                            </pre>
                        </div>
                    ) : (
                        <div className=" w-full lg:w-1/2 order-2 lg:order-1 flex flex-col items-center justify-center bg-black border rounded-lg text-gray-500">
                            <p className="text-lg font-semibold">Kindly fill the details and hit the Genrate Curl Button.</p>
                        </div>
                    )}

                </div>
            </Main>

        </>

    )
}
