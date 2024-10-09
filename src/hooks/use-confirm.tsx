import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export const useConfirm = (
    title: string,
    message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const ConfirmDialog = () => (
        <Dialog open={promise !== null} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle className="text-lg font-semibold">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="p-4 flex justify-end space-x-2 bg-white">
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border bg-white text-gray-700 py-2 px-4 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    return [ConfirmDialog, confirm];
}; 