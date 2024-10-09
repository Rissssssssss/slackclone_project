import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const CreateWorkspaceModal = () => {
    const router = useRouter();
    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState("");

    const { mutate, isPending } = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        setName("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();

       mutate({ name }, {
        onSuccess(id) {
            toast.success("Workspace created");
            router.push(`/workspace/${id}`);
            handleClose();
        },
       })
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4 flex flex-col gap-y-2">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        placeholder="Workspace name e.g 'Work', 'Personal', 'Home'"
                        className="border rounded px-3 py-2"
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