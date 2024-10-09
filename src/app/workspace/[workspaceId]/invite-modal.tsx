import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogDescription,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
};

export const InviteModal = ({ 
    open, 
    setOpen,
    name,
    joinCode,
}: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure",
        "This will deactivate the current invite code and generate a new one.",
    );

    const { mutate, isPending } = useNewJoinCode();



    const handleNewCode = async () => {
        const ok = await confirm();

        if (!ok) return;

        mutate({ workspaceId }, {
            onSuccess: () => {
                toast.success("Invite code regenerated", {
                    style: {
                        backgroundColor: "#ffffff", // พื้นหลังสีขาว 
                    },
                });
            },
            onError: () => {
                toast.error("Failed to regenerate invite code", {
                    style: {
                        backgroundColor: "#ffffff", // พื้นหลังสีขาว 
                    },
                });
            }
        });
    };

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;

        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success("Invite link copied to clipboard", {
                style: {
                    backgroundColor: "#ffffff", // พื้นหลังสีขาว 
                },
            }));
    };

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 bg-white overflow-hidden">
                    <DialogHeader className="p-4 bg-white">
                        <DialogTitle>Invite people to {name}</DialogTitle>
                        <DialogDescription>
                            Use the code below to invite people to your workspace
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10 bg-white">
                        <p className="text-4xl font-bold tracking-widest uppercase">
                            {joinCode}
                        </p>
                        <Button
                            onClick={handleCopy}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                        >
                            Copy link
                            <CopyIcon className="size-4 ml-2" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between w-full px-4 pb-4 bg-white">
                        <Button
                            disabled={isPending}
                            onClick={handleNewCode}
                            variant="outline"
                            className="bg-white border border-gray-300 text-gray-700"
                        >
                            New code
                            <RefreshCcw className="size-4 ml-2" />
                        </Button>
                        <DialogClose asChild>
                            <Button className="bg-gray-900 text-white">
                                Close
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};