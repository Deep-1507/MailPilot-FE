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

import { useState, useRef, useEffect, useMemo } from 'react';
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
import { Trash } from 'lucide-react';
import { Pencil } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from '@tanstack/react-router';

const formSchema = z.object({
  subject: z.string().min(1, {
    message: 'Company Name cannot be empty.'
  }),
  template: z.string().min(1, {
    message: 'Template cannot be empty.'
  }),
  comments: z.string().min(1, {
    message: "Password cannot be empty"
  })
});


export default function ManageTemplate() {

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [templates, setTemplates] = useState<Template[]>([]);
  const hasFetched = useRef(false);

  interface Template {
    _id: string;
    subject: string;
    template: string;
    comments: string;
  }

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => ({
      subject: selectedTemplate?.subject || '',
      template: selectedTemplate?.template || '',
      comments: selectedTemplate?.comments || '',
    }), [selectedTemplate])
  });

  const {
    formState: { isSubmitting }
  } = form;

  useEffect(() => {
    if (selectedTemplate) {
      form.reset({
        subject: selectedTemplate.subject || "",
        comments: selectedTemplate.comments || "",
        template: selectedTemplate.template || "",
      });
    }
  }, [selectedTemplate, form]);



  useEffect(() => {
    if (!hasFetched.current) {
      fetchTemplates();
      hasFetched.current = true;
    }
  }, []);

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

  const handleDelete = async (id: any) => {
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
        `${BACKEND_URL}/api/v3/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 200) {
        enqueueSnackbar("Template deleted successfully", { variant: "success" });
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
        router.navigate({ to: "/sign-in" });
        return;
      }

      if (!BACKEND_URL) {
        throw new Error('BACKEND_URL is not defined');
      }
      const response = await axios.put(
        `${BACKEND_URL}/api/v3/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 200) {
        enqueueSnackbar("Template updated successfully", { variant: "success" });
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

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type === "text/html") {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          form.setValue("template", event.target.result, { shouldValidate: true });
          // setTemplatePreview(event.target.result);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid HTML file.")
    }
  }


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
          <h1 className='text-2xl font-bold tracking-tight'>Manage Templates</h1>
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
            Manage your Templates here!
          </p>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>

              {
                templates.map((template) => {
                  return (
                    <Card
                      key={template._id}
                    >

                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                          {template.subject}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <CardDescription className='block'>{template.comments}</CardDescription>
                      </CardContent>

                      <div className='w-full flex justify-center pb-4'>
                        <Dialog>
                          <div className="flex items-center gap-2">
                            <DialogTrigger asChild>
                              <Button onClick={() => setSelectedTemplate(template)}>

                                <Pencil size={20} />
                              </Button>

                            </DialogTrigger>
                            <Button onClick={() => handleDelete(template._id)} className="bg-red-600">
                              <Trash size={20} />
                            </Button>
                          </div>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle><p>{selectedTemplate?.subject}</p></DialogTitle>
                              <DialogDescription>
                                <Form {...form}>
                                  <form onSubmit={form.handleSubmit((data) => onSubmit(data, selectedTemplate?._id))} className="space-y-8">
                                    <FormField
                                      control={form.control}
                                      name="subject"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Enter the Subject of the Template</FormLabel>
                                          <FormControl>
                                            <Input  {...field} />
                                          </FormControl>
                                          <FormDescription>
                                            This will be sent as the email subject.
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="comments"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Comments</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormDescription>Write down any important notes for sending the email.</FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="template"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Template</FormLabel>
                                          <FormControl>
                                            <Textarea
                                              placeholder="Type your HTML template here..."
                                              {...field}
                                              className="mb-4 h-40 resize-none"
                                              onChange={(e) => {
                                                field.onChange(e);
                                                handleFileUpload(e);
                                              }}
                                            />

                                          </FormControl>
                                          <div className="flex items-center">
                                            <h2>OR</h2>
                                          </div>
                                          <div className="flex items-center gap-4 mt-2">
                                            <input
                                              type="file"
                                              accept=".html"
                                              id="htmlFile"
                                              onChange={handleFileUpload}
                                              className="cursor-pointer px-4 py-2 bg-secondary text-white rounded-lg"
                                            />
                                          </div>
                                          <FormDescription>This template will be sent in the emails.</FormDescription>
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