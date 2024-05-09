"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { Attachment, Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { File, ImageIcon, Loader, Pencil, PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";

interface ImageFormProps {
  courseId: string;
  initialData: Course & {
    attachments: Attachment[];
  };
}

const formSchema = z.object({
  url: z.string().min(1, "url is required"),
});

export const AttachmentForm = ({ courseId, initialData }: ImageFormProps) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [DeletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <span>Course Files</span>

        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 to-slate-500 italic">
              No Attachents yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border text-sky-700 rounded-md"
                >
                  <File className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {DeletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {DeletingId !== attachment.id && (
                    <Button
                      className="ml-auto hover:opacity-75 transition"
                      variant={"ghost"}
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />

          <div className="mt-4 text-xs text-muted-foreground">
            Anything your students might need to complete this course.
          </div>
        </div>
      )}
    </div>
  );
};
