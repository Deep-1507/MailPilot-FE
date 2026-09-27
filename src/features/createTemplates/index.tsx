import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import axios from 'axios';
import { z } from 'zod';
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
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
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

export default function CreateTemplate() {
  const router = useRouter(); 
    const { enqueueSnackbar } = useSnackbar();
    const [templatePreview, setTemplatePreview] = useState("");
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        subject: '',
        template: '',
        comments: '',
      }
    });
  
    const {
      formState: { errors, isSubmitting }
    } = form;
  
    console.log('formState', errors);
  
    const handleFileUpload = (e: any) => {
      const file = e.target.files[0];
      if (file && file.type === "text/html") {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            form.setValue("template", event.target.result, { shouldValidate: true });
            setTemplatePreview(event.target.result);
          }
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid HTML file.")
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
      const response = await axios.post(
        `${BACKEND_URL}/api/v3/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      if (response.status === 201) {
        enqueueSnackbar("Template created successfully", { variant: "success" });
        setTimeout(() => {
          window.location.reload();
      }, 1000)
        return;
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
          {/* <ThemeSwitch /> */}
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Create Template</h2>
            <p className='text-muted-foreground'>
              Create your Templates here, which you can use to send the mails!
            </p>
          </div>
          {/* <TasksPrimaryButtons /> */}
        </div>
        <div className=" flex flex-col lg:flex-row gap-8">

        
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 pt-4'>
          {/* <DataTable data={tasks} columns={columns} /> */}

          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the subject of the Template</FormLabel>
                  <FormControl>
                    <Input placeholder="Welcome Mail..." {...field} />
                  </FormControl>
                  <FormDescription>This will be sent as the email subject.</FormDescription>
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
                        field.onChange(e); // Preserve the default behavior
                        handleFileUpload(e); // Call your function
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
                      className="cursor-pointer px-4 py-2 bg-secondary text-black rounded-lg"
                    />
                  </div>
                  <FormDescription>This template will be sent in the emails.</FormDescription>
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
                    <Input placeholder="Replace the Company Name with a variable later!" {...field} />
                  </FormControl>
                  <FormDescription>Write down any important notes for sending the email.</FormDescription>
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


         {/* Preview Section - Moves Below on Small Screens */}
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


      </Main>

    </>
  )
}
