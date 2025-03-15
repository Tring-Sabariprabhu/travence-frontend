import { useSelector } from "react-redux";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import { RootState } from "../../../Redux/store";
import CustomDialog from "../../../Components/CustomDialog/CustomDialog"
import './InviteOthers.scss';
import { useLazyQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";

import { makeToast } from "../../../Components/Toast/makeToast";
import { useState } from "react";



interface InviteOthersProps {
    open: boolean
    onClose: () => void
}

export const InviteOthers: React.FC<InviteOthersProps> = ({ open, onClose }) => {
    const location = useLocation();
    const group_id = location?.state?.index;

    const user = useSelector((state: RootState) => state.user);
    // const [Presented] = useLazyQuery(UserPresentInGroupAndGroupRequests);

    const [emails, setEmails] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const isValidEmail = (email: string): boolean => {
        if (email.length > 0) {
            return /^[^\s@]+@[^0-9\s@]+\.[^\s@]+$/.test(email);

        }
        return false;
    }
    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            const trimmedValue = inputValue.trim().toLowerCase();
            if (isValidEmail(trimmedValue)) {
                if (user?.email === trimmedValue) {
                    makeToast({ message: "You are already in Group", toastType: "error" });
                }else if (emails.includes(trimmedValue)) {
                    makeToast({ message: `${inputValue} already in queue`, toastType: "error" });
                }else {
                    // const { data } = await Presented({ variables: { group_id: group_id, email: trimmedValue , requested_email: user?.email}, fetchPolicy: "network-only"});
                    // if(data?.userPresentInGroupAndGroupRequests){
                    //     if(data?.userPresentInGroupAndGroupRequests?.group_id){
                    //         makeToast({message: "User already Present in Group", toastType: "error"});
                    //     }else if(data?.userPresentInGroupAndGroupRequests?.email != null){
                    //         makeToast({message: "This Email already has Request", toastType: "error"});
                    //     }
                    // }else{
                        setEmails([...emails, trimmedValue]);
                    // }
                    // console.log(data?.userPresentInGroupAndGroupRequests)
                }
                setInputValue("");
            }else {
                makeToast({ message: "Invalid Email", toastType: "error" });
            }
        }
    }
    const handleRemoveEmail = (emailToRemove: string) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    const inviteProcess = () => {
        if (emails.length > 0) {
            makeToast({ message: "Invite Sent", toastType: "success" });
            setEmails([]);
            onClose();
        }
        else {
            makeToast({ message: "No Emails Selected", toastType: "warning" });
        }

    }

    return (
        <CustomDialog open={open} onClose={onClose} dialog_title={"Invite Others"} >
            <div className="inviteOthers-form">
                <div className="input-container">
                    <input type="text" name="" placeholder="Enter Email"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown} />
                    <p>Note: Select multiple emails by entering comma (,) or enter </p>
                </div>
                <div className="selected-members">
                    <label className="heading">{emails.length > 0 ? "Selected Emails" : "No Emails Selected"}</label>
                    {emails.map((email) => (
                        <ol>
                            <li key={email} >
                                {email} <button onClick={() => handleRemoveEmail(email)}>x</button>
                            </li>
                        </ol>
                    ))}
                    
                </div>
                <div className="inviteOthers-footer">
                    <span onClick={inviteProcess}>
                        <ButtonField type={"button"} text={"Invite"} className={"darkblue_button"} />
                    </span>
                </div>
            </div>
        </CustomDialog >
    )
}