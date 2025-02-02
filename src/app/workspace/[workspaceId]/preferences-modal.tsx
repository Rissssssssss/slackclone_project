import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter,
}   from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
};

export const PreferencesModal = ({
    open,
    setOpen,
    initialValue,
}: PreferencesModalProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This action is irreversible."
    );

    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeWorkspace({
            id: workspaceId
        }, {
            onSuccess: () => {
                toast.success("Workspace removed", {
                    style: {
                        backgroundColor: "#ffffff", // สีขาว 
                    },
                });
                router.replace("/");
            },
            onError: () => {
                toast.error("Failed to remove workspace", {
                    style: {
                        backgroundColor: "#ffffff", // สีขาว 
                    },
                });
            }
        })
    };

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateWorkspace({
            id: workspaceId,
            name: value,
        }, {
            onSuccess: () => {
                toast.success("Workspace updated", {
                    style: {
                        backgroundColor: "#ffffff", // สีขาว 
                    },
                });
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update workspace", {
                    style: {
                        backgroundColor: "#ffffff", // สีขาว 
                    },
                });
            }
        })
    };

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            {value}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            Workspace name
                                        </p>
                                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                            Edit
                                        </p>
                                    </div>
                                    <p className="text-sm">
                                        {value}
                                    </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                                <DialogHeader className="p-4 border-b bg-white">
                                    <DialogTitle>Rename this workspace</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4 px-4 pb-4 flex flex-col gap-y-2" onSubmit={handleEdit}>
                                    <Input
                                        value={value}
                                        disabled={isUpdatingWorkspace}
                                        onChange={(e) => setValue(e.target.value)}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="Workspace name e.g 'Work', 'Personal', 'Home'"
                                        className="border rounded px-3 py-2"
                                    />
                                    <DialogFooter className="flex justify-end space-x-2">
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={isUpdatingWorkspace} className="border bg-white text-gray-700 py-2 px-4 rounded">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isUpdatingWorkspace} className="bg-gray-900 text-white py-2 px-4 rounded">
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button
                            disabled={isRemovingWorkspace}
                            onClick={handleRemove}
                            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-700"
                        >
                            <TrashIcon className="size-4" />
                            <p className="text-sm font-semibold">Delete workspace</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};