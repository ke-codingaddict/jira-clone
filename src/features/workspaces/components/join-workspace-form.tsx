"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export const JoinWorkspaceForm = ({
  initialValues
}: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit = () => {
    mutate(
      { param: { workspaceId }, json: { code: inviteCode } },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        }
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You've been invited to join <strong>{initialValues.name} </strong>
          workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex items-center justify-between flex-col space-y-5 px-20 lg:flex-row lg:space-x-3 lg:space-y-0 lg:px-0">
          <Button
            size="lg"
            type="button"
            className="w-full bg-red-600 hover:bg-red-700"
            asChild
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            size="lg"
            className="w-full"
            onClick={onSubmit}
            disabled={isPending}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
