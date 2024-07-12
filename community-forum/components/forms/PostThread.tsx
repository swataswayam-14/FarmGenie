"use client"

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { ThreadValidation } from '@/lib/validations/thread';
import { Button } from "@/components/ui/button"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUploadThing } from '@/lib/uploadthing';
//import { updateUser } from '@/lib/actions/user.action';
import { usePathname, useRouter } from 'next/navigation';
import { createThread } from '@/lib/actions/thread.action';

interface Props {
    user:{
        id:string;
        objectId: string;
        username:string;
        name:string;
        bio:string;
        image:string;
    };
    btnTitle: string;
}


export default function PostThread({userId}:{userId:string}) {
    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues:{
            thread: '',
            accountId: JSON.parse(userId)
        }
    })

    const onSubmit = async(values: z.infer<typeof ThreadValidation>)=>{

        await createThread({
            text: values.thread,
            author: JSON.parse(userId),
            communityId: null,
            path: pathname
        })
        router.push("/")
    }

    return <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col justify-start gap-10">
      <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea 
                    rows={15}
                    {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>Post Thread</Button>
      </form>
      </Form>
}
