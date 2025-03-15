import { useSelector } from "react-redux";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import { RootState } from "../../../Redux/store";
import CustomDialog from "../../../Components/CustomDialog/CustomDialog"
import './InviteOthers.scss';
import { useLazyQuery, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom";

import { makeToast } from "../../../Components/Toast/makeToast";
import { useState } from "react";
import { SendGroupRequests } from "../../../ApolloClient/Mutation/GroupRequests";

interface GroupMemberProps{
    member_id: string
    user_id: string
    profile: {
        name: string,
        email: string
    }
    group_id: string
    joined_at: string
    role: String
}
interface GroupDataProps{
    group_id: string,
    name: string,
    description: string,
    created_by: string,
    group_members: [GroupMemberProps]
}
interface InviteOthersProps {
    open: boolean
    onClose: () => void
    onUpdated: ()=> void
    group_data: GroupDataProps
    userInGroup: GroupMemberProps
}

export const InviteOthers: React.FC<InviteOthersProps> = ({ open, onClose, group_data , userInGroup, onUpdated}) => {
    const location = useLocation();

    const user = useSelector((state: RootState) => state.user);
    const group_id = group_data?.group_id;
    const [emails, setEmails] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [sendInviteRequest] = useMutation(SendGroupRequests);

    const isValidEmail = (email: string): boolean => {
        if (email.length > 0) {
            return /^[^\s@]+@[^0-9\s@]+\.[^\s@]+$/.test(email);
        }
        return false;
    }
    const group_members_emails = group_data?.group_members?.map((member: GroupMemberProps)=> member?.profile?.email);
    
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
                    if(group_members_emails.includes(trimmedValue)){
                        makeToast({message: "Selected Email already in Group", toastType: "error"});
                    }
                    else{
                        setEmails([...emails, trimmedValue]);
                    }
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

    const inviteProcess = async () => {
        if (emails.length > 0) {
            const admin_id = userInGroup?.member_id;
            await sendInviteRequest({variables: {admin_id: admin_id, emails: emails}, 
                onCompleted: (data)=>{
                    makeToast({ message: "Invite Sent", toastType: "success" }); 
                    onUpdated();
                },
                onError: (err)=>{
                    makeToast({message: err.message, toastType: "error"});
                }})
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