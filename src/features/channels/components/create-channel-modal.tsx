import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useCreatChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateChannelModal = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const [open, setOpen] = useCreatChannelModal();

    const { mutate, isPending } = useCreateChannel();

    const [name, setName] = useState("");

    const handleClose = () => {
        setName("");
        setOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setName(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(
            { name, workspaceId },
            {
                onSuccess: (id) => {
                    toast.success("Channel created", {
                        style: {
                            backgroundColor: "#ffffff", // สีขาว 
                        },
                    });
                    router.push(`/workspace/${workspaceId}/channel/${id}`);
                    handleClose();
                },
                onError: () => {
                    toast.error("Failed to create channel", {
                        style: {
                            backgroundColor: "#ffffff", // สีขาว 
                        },
                    });
                }
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4 flex flex-col gap-y-2">
                    <Input
                        value={name}
                        disabled={isPending}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget"
                        className="border p-2 rounded bg-white"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending} className="bg-gray-900 text-white py-2 px-4 rounded">
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};