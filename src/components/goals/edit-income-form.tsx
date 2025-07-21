
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { updateSavingsRecord } from "@/lib/firebase/firestore";
import { uploadScreenshot, deleteFileFromStorage } from "@/lib/firebase/storage";
import type { SavingsRecord } from "@/types";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil } from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  screenshot: z
    .custom<FileList>()
    .refine((files) => files === undefined || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
    .refine(
      (files) => files === undefined || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png formats are supported."
    ).optional(),
});

interface EditIncomeFormProps {
    record: SavingsRecord;
}

export function EditIncomeForm({ record }: EditIncomeFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: record.description,
      amount: record.amount,
    },
  });

  const fileRef = form.register("screenshot");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const screenshotFile = values.screenshot?.[0];
      const updatedData: Partial<SavingsRecord> = {
        description: values.description,
        amount: values.amount,
      };

      if (screenshotFile) {
        if (record.storagePath) {
          await deleteFileFromStorage(record.storagePath);
        }
        const { downloadURL, storagePath } = await uploadScreenshot(screenshotFile, record.userId, record.id);
        updatedData.screenshotUrl = downloadURL;
        updatedData.storagePath = storagePath;
      }
      
      await updateSavingsRecord(record.id, record.goalId, record.amount, updatedData);
      
      toast({
        title: "Income Record Updated",
        description: "Your income record has been successfully updated.",
      });
      form.reset({
        description: values.description,
        amount: values.amount,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating income record: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update the income record. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Income Record</DialogTitle>
          <DialogDescription>
            Make changes to your income record here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Paycheck" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="e.g., 250.00" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {record.screenshotUrl && (
                <div className="space-y-2">
                    <Label>Current Screenshot</Label>
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        <Image src={record.screenshotUrl} alt="Screenshot" layout="fill" objectFit="cover" />
                    </div>
                </div>
            )}
            <FormField
              control={form.control}
              name="screenshot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{record.screenshotUrl ? 'Upload New Screenshot' : 'Screenshot (Optional)'}</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/png, image/jpeg" {...fileRef} disabled={isLoading} />
                  </FormControl>
                   <FormDescription>
                    {record.screenshotUrl ? 'Uploading a new file will replace the current one.' : 'Attach proof of transaction (.png, .jpg, max 2MB).'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
