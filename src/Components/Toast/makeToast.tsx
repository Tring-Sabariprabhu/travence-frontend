import { toast, TypeOptions } from "react-toastify"

interface MakeToastProps {
    message: string;
    toastType: TypeOptions;
    closeTime?: number;
}

export const makeToast = ({ message, toastType, closeTime = 1000 }: MakeToastProps): void => {
    toast(message, {
        autoClose: closeTime,
        type: toastType,
        closeOnClick: true,
    });
};
