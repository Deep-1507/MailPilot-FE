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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import {
  Tabs,
} from '@/components/ui/tabs.js';
import { useRouter } from '@tanstack/react-router';

const formSchema = z.object({
  credId: z.string().min(1, {
    message: "Credential cannot be empty.",
  }),
  templateId: z.string().min(1, {
    message: "Template cannot be empty.",
  }),
  to: z.array(
    z.string().email({
      message: "Invalid email format.",
    })
  ).min(1, {
    message: "At least one recipient is required.",
  }),
  companyName: z.string().min(1, {
    message: "Company name cannot be empty.",
  }),
  recipientName: z.array(
    z.string().min(1, {
      message: "At least one recipient is required.",
    }))
});


export default function SendMails() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter(); 
  const [templatePreview, setTemplatePreview] = useState("");
  const [apiKey, setapiKey] = useState("");
  const [subject, setSubject] = useState("");
  const [comments, setComments] = useState("");
  interface Template {
    _id: string;
    subject: string;
    template: string;
    comments?: string;
  }

  const [templates, setTemplates] = useState<Template[]>([]);
  interface BusinessGroup {
    _id: string;
    groupName: string;
    users: { _id: string; name: string; email: string }[];
  }
  
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  interface Credential {
    _id: string;
    companyName: string;
    senderEmail: string;
  }

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<{ _id: string; name: string; email: string }[]>([]);
  const hasFetched = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credId: "",
      templateId: "",
      to: [],
      companyName: "",
      recipientName: [],
    },
  });

  const {
    formState: { isSubmitting }
  } = form;

  useEffect(() => {
    if (!hasFetched.current) {
      fetchTemplates();
      fetchCredentials();
      fetchuserdeatils();
      fetchBusinessUsers();
      hasFetched.current = true;
    }
  }, []);




  // const handleSelect = (value) => {
  //   // Find the selected user
  //   const selectedUser = businessUsers.find(user => user._id === value);

  //   if (selectedUser && !selectedRecipients.some(user => user._id === value)) {
  //     const updatedRecipients = [...selectedRecipients, selectedUser]; // Add new user
  //     setSelectedRecipients(updatedRecipients);

  //     // Update the "to" field in the form with only emails
  //     form.setValue("to", updatedRecipients.map(user => user.email));
  //     form.setValue("recipientName", updatedRecipients.map(user => user.name));
  //   }
  // };


  // const handleRemove = (userId) => {
  //   const updatedRecipients = selectedRecipients.filter(user => user._id !== userId);
  //   setSelectedRecipients(updatedRecipients);
  //   form.setValue("to", updatedRecipients.map(user => user.email)); // Updating form state
  // };


  const handleSelectGroup = (groupId:any) => {
    // Find the selected group
    const selectedGroup = businessGroups.find(group => group._id === groupId);

    if (selectedGroup) {
      // Extract users from the selected group
      const groupUsers = selectedGroup.users || [];

      // Filter out already selected users to avoid duplication
      const newUsers = groupUsers.filter(user => !selectedRecipients.some(rec => rec._id === user._id));

      if (newUsers.length > 0) {
        const updatedRecipients = [...selectedRecipients, ...newUsers];
        setSelectedRecipients(updatedRecipients);

        // Update form fields
        form.setValue("to", updatedRecipients.map(user => user.email));
        form.setValue("recipientName", updatedRecipients.map(user => user.name));
      }
    }
  };

   const handleRemoveGroup = (userId:any) => {
     const updatedRecipients = selectedRecipients.filter(user => user._id !== userId);
     setSelectedRecipients(updatedRecipients);

     form.setValue("to", updatedRecipients.map(user => user.email));
     form.setValue("recipientName", updatedRecipients.map(user => user.name));
   };



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

  const fetchuserapikey = async (id:any) => {
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
        setapiKey(response.data.APIKEY)
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
        setBusinessGroups(response.data.groups);
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
        throw new Error("BACKEND_URL is not defined");
      }
  
      const dataToSend = {
        ...data,
        apiKey: apiKey,
        subject: subject,
      };
  
      console.log(dataToSend);
  
      const response = await axios.post(`${BACKEND_URL}/api/v4/sendmail`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Mail sent successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      if ((err as any).response) {
        Swal.fire({
          title: "Error!",
          text: (err as any).response.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "An error occurred. Please check your input.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    } finally {
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
          <h1 className='text-2xl font-bold tracking-tight'>Send Mails</h1>
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
            Shoot your mails from this platorm!
          </p>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="w-full lg:w-1/2 order-1  max-h-[650px] overflow-y-auto">
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
                        <FormDescription>This template will be sent in the email.</FormDescription>
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
                                setTemplatePreview(selectedTemplate.template || "");
                                setSubject(selectedTemplate.subject || "")
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

                  <FormField
                    control={form.control}
                    name="to"
                    render={({ }) => (
                      <FormItem>
                        <FormLabel>Select Groups</FormLabel>

                        {/* Display Selected Users */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {selectedRecipients.map((user) => (
                            <div key={user._id} className="flex items-center bg-secondary px-3 py-1 rounded-full">
                              {user.name} ({user.email})
                              <button onClick={() => handleRemoveGroup(user._id)} className="ml-2 text-red-500 hover:text-red-700">
                                ✖
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Dropdown for Selecting Groups */}
                        <FormControl>
                          <Select onValueChange={handleSelectGroup}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose Groups" />
                            </SelectTrigger>
                            <SelectContent>
                              {businessGroups.map((group) => (
                                <SelectItem key={group._id} value={group._id}>
                                  {group.groupName} ({group.users.length} Users)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormDescription>The mail will be sent to all users in the selected groups.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Replace the Company Name with a variable later!" {...field} />
                        </FormControl>
                        <FormDescription>If the company's name is missing in the template, it will be replaced by this.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isSubmitting} type="submit">
                    Send Mail
                  </Button>
                  {/* <button disabled={isSubmitting} className="absolute bottom-0 left-5 w-[80vh] bg-white p-2 shadow-md hover:shadow-[0_0_20px_#29e3e0] text-black rounded-md" type="submit">Send mail</button> */}
                </form>
              </Form>
            </div>

            {/* Preview Section */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1 border rounded-lg shadow-[0_0_20px_#29e3e0] transition-shadow duration-300">
              <Card>
                <CardHeader className="text-lg font-bold">Template Preview</CardHeader>
                <CardContent>
                  {templatePreview ? (
                    <iframe
                      srcDoc={templatePreview}
                      className="w-full h-[75vh] border rounded-md"
                      title="Template Preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[75vh] text-gray-500">
                      <p className="text-lg font-semibold">No Template Selected</p>
                      <p className="text-sm">Please select a template to preview it here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>



        </Tabs>
      </Main>
    </>
  )

}