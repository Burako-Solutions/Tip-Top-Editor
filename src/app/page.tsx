'use client';

import * as z from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  RichTextEditor,
} from '@/components';

function extractTextFromHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent?.trim() || '';
}

const formSchema = z.object({
  post: z.string().refine(
    (value) => {
      return extractTextFromHTML(value).trim().length >= 5;
    },
    {
      message: 'The text must be at least 5 characters long after trimming',
    }
  ),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Home() {
  const form = useForm<FormSchema>({
    mode: 'onTouched',
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: '',
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-3xl mx-auto py-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="post"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
