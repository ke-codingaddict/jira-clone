"use client";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { Project } from "../types";
import { useUpdateProject } from "../api/use-update-projects";
import { updateProjectSchema } from "../schema";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

export const EditProjectForm = ({
  onCancel,
  initialValues
}: EditProjectFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  //const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
  //useDeleteWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action is irreversible",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? ""
    }
  });

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    /*deleteWorkspace(
     { param: { workspaceId: initialValues.$id } },
     {
       onSuccess: () => {
         router.push("/");
       }
     }
   );*/
  };

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : ""
    };

    mutate(
      {
        form: {
          name: finalValues.name as string, // ensure type matches ParsedFormValue
          image: finalValues.image
        },
        param: { projectId: initialValues.$id }
      },
      {
        onSuccess: () => {
          form.reset();
        }
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />

      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                    )
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>

        <DottedSeparator className="px-7" />

        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          placeholder="Enter project name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] rounded-md overflow-hidden relative">
                            <Image
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Logo"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Project Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, MAX SIZE 1MB
                          </p>
                          <input
                            className="hidden"
                            accept=".jpg, .png, .jpeg, .svg"
                            type="file"
                            ref={inputRef}
                            onChange={handleImageChange}
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant="destructive"
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"tertiary"}
                              size="xs"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="space-x-5 flex justify-between">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(
                    "bg-red-600 text-white hover:bg-red-400",
                    !onCancel && "invisible"
                  )}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold text-red-600">Danger Zone</h3>
            <p className="text-sm text-muted-foreground text-red-600">
              Deleting project is irreversible and will remove all associated
              data.
            </p>
            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 fit ml-auto bg-red-600 hover:bg-red-700"
              size="sm"
              type="button"
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
