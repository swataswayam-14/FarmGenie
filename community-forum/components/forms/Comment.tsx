"use client"

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { CommentValidation } from '@/lib/validations/thread';
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
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.action';
//import { createThread } from '@/lib/actions/thread.action';


interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

export default function Comment({threadId, currentUserImg , currentUserId}: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues:{
            thread: '',
        }
    })

    const onSubmit = async(values: z.infer<typeof CommentValidation>)=>{
        await addCommentToThread(threadId, values.thread, currentUserId, pathname);
        form.reset();
    }

    return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
      <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className='flex items-center gap-3 w-full'>
              <FormLabel>
                <Image
                    src={currentUserImg}
                    alt='profile image'
                    width={48}
                    height={48}
                    className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input  
                    type='text'
                    placeholder='Comment...'
                    className='no focus text-light-1 outline-none'
                    {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit' className='comment-form_btn'>Reply</Button>
      </form>
      </Form>
    )
}