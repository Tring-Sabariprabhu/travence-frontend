import { useSelector } from "react-redux";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import { RootState } from "../../../Redux/store";
import CustomDialog from "../../../Components/CustomDialog/CustomDialog"
import './InviteOthers.scss';
import { useMutation } from "@apollo/client";
import { makeToast } from "../../../Components/Toast/makeToast";
import { useState } from "react";
import { SendGroupJoinRequests } from "../../../ApolloClient/Mutation/GroupRequests";

interface GroupMemberProps {
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

interface InviteOthersProps {
    open: boolean
    onClose: () => void
    onUpdated: () => void
    group_members: [GroupMemberProps]
    admin_id: string
    invitedEmails: [string]
}

export const InviteOthers: React.FC<InviteOthersProps> = ({ open, onClose, group_members, admin_id, onUpdated, invitedEmails }) => {

    const user = useSelector((state: RootState) => state.user);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [sendInviteRequest] = useMutation(SendGroupJoinRequests);
    const [errorState, setErrorState] = useState<string>("");

    const isValidEmail = (email: string): boolean => {
        if (email.length > 0) {
            return /^[^\s@]+@[^0-9\s@]+\.[^\s@]+$/.test(email);
        }
        return false;
    }
    const group_members_emails = group_members?.map((member: GroupMemberProps) => member?.profile?.email);

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === ",") {
            emailCheck();
        }
    }
    const emailCheck = () => {
        const trimmedValue = inputValue.trim().toLowerCase();
        if (isValidEmail(trimmedValue)) {
            if (user?.email === trimmedValue) {
                setErrorState("You are already in Group");
            } else if (selectedEmails.length > 0 && selectedEmails.includes(trimmedValue)) {
                setErrorState(`${inputValue} already in queue`);
            } else if (invitedEmails.length > 0 && invitedEmails.includes(trimmedValue)) {
                setErrorState("This Email is already Invited");
            }
            else {
                if (group_members_emails.includes(trimmedValue)) {
                    setErrorState("Selected Email already in Group");
                }
                else {
                    setErrorState("");
                    setSelectedEmails([...selectedEmails, trimmedValue]);
                }
            }
            setInputValue("");
        } else {
            setErrorState("Invalid Email");
        }
        
        setTimeout(()=>{
            setErrorState("");
        },3000);
    }
    const handleRemoveEmail = (emailToRemove: string) => {
        setSelectedEmails(selectedEmails.filter((email) => email !== emailToRemove));
    };

    const inviteProcess = async () => {
        if (inputValue?.length > 0) {
            emailCheck();   
        }
        if (selectedEmails.length > 0) {
            await sendInviteRequest({
                variables: { admin_id: admin_id, emails: selectedEmails },
                onCompleted: (data) => {
                    makeToast({ message: "Invite Sent", toastType: "success" });
                    onUpdated();
                },
                onError: (err) => {
                    makeToast({ message: err.message, toastType: "error" });
                }
            })
            setSelectedEmails([]);
            onClose();
        }
        else {
            makeToast({ message: "No Emails Selected", toastType: "warning" });
        }
    }
    const handleClose = () => {
        onClose();
        setErrorState("");
    }
    return (
        <CustomDialog open={open} onClose={handleClose} dialog_title={"Invite Others"} >
            <div className="inviteOthers-form">
                <div className="input-container">
                    <input type="text" placeholder="Enter Email"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown} />
                    
                </div>
                <div className="selected-members">
                    {errorState?.length > 0 && <p className="error">{errorState}</p>}
                    {selectedEmails?.length > 0 && <label className="heading">Selected Emails</label>}
                    <ol>
                        {selectedEmails.map((email) => (

                            <li key={email} >
                                {email} <button onClick={() => handleRemoveEmail(email)}>x</button>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="inviteOthers-footer">
                    <p>ℹ️  Note: Select multiple emails by entering comma (,) or enter </p>
                    <ButtonField type={"button"} text={"Invite"} className={"blue_button"} onClick={inviteProcess} />
                </div>
            </div>
        </CustomDialog >
    )
}