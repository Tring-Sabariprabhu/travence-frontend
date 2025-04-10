import { useSelector } from "react-redux";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import { RootState } from "../../../../Redux/store";
import CustomDialog from "../../../../Components/CustomDialog/CustomDialog"
import './InviteOthers.scss';
import { useMutation } from "@apollo/client";
import { makeToast } from "../../../../Components/Toast/makeToast";
import { useState } from "react";
import { Info } from "@mui/icons-material";
import { Group_Member_Props } from "../../Main/Group";
import { SendGroupInvites } from "../../../../ApolloClient/Mutation/GroupInvites";
import { ErrorText } from "../../../../Components/ErrorText/ErrorText";


interface InviteOthersProps {
    open: boolean
    onClose: () => void
    
}

export const InviteOthers: React.FC<InviteOthersProps> = ({ open, onClose }) => {

    const user = useSelector((state: RootState) => state.user);
    const [disableButtonState, setDisableButtonState] = useState<boolean>(false);

    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [sendInviteRequest] = useMutation(SendGroupInvites);
    const [errorState, setErrorState] = useState<string>("");


    const isValidEmail = (email: string): boolean => {
        if (email?.length > 0) {
            return /^[^\s@]+@[^0-9\s@]+\.[^\s@]+$/.test(email);
        }
        return false;
    }


    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === ",") {
            handleEmail();
        }
    }
    const handleEmail = () => {
        const trimmedValue = inputValue.trim().toLowerCase();
        if (isValidEmail(trimmedValue)) {
            if (user?.email === trimmedValue) {
                setErrorState("You are already in Group");
            } else if (selectedEmails?.length > 0 && selectedEmails?.includes(trimmedValue)) {
                setErrorState(`${inputValue} already in queue`);
            } else {
                setInputValue("");
                setSelectedEmails([...selectedEmails, trimmedValue]);
            }
        } else {
            setErrorState("Invalid Email");
        }

    }
    const removeEmail = (emailToRemove: string) => {
        setSelectedEmails(selectedEmails?.filter((email) => email !== emailToRemove));
    };

    const inviteProcess = async () => {
        setDisableButtonState(true);
        if (inputValue?.length > 0) {
            handleEmail();
        }else if (selectedEmails?.length > 0) {
                await sendInviteRequest({
                    variables:
                    {
                        input: {
                            invited_by: user?.current_group_member_id,
                            emails: selectedEmails
                        }
                    },
                    onCompleted: (data) => {
                        makeToast({ message: data?.createGroupInvites, toastType: "success" });

                    },
                    onError: (err) => {
                        makeToast({ message: err.message, toastType: "error" });
                    }
                })
                setSelectedEmails([]);
                onClose();
            }
            else {
                setErrorState("No Emails Selected")
            }
        
        setDisableButtonState(false);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setErrorState("");
    }
    const handleClose = () => {
        onClose();
        setSelectedEmails([]);
        setInputValue("");
        setErrorState("");
    }
    return (
        <CustomDialog open={open} onClose={handleClose} dialog_title={"Invite Others"} >
            <div className="inviteOthers-form">
                <div className="input-container">
                    <input type="text" placeholder="Enter Email"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown} />

                </div>
                <div className="selected-members">
                    {errorState?.length > 0 && <ErrorText message={errorState} />}
                    {selectedEmails?.length > 0 && <label className="heading">Selected Emails</label>}
                    <ol>
                        {selectedEmails?.map((email) => (
                            <li key={email} >
                                {email} <button onClick={() => removeEmail(email)}>x</button>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="inviteOthers-footer">
                    <div className="note">
                        <Info className="info-icon" />
                        <p> Note: Select multiple emails by entering comma (,) or enter </p>
                    </div>
                    <ButtonField
                        type={"button"}
                        text={"Invite"}
                        className={"blue_button"}
                        onClick={inviteProcess}
                        disabledState={disableButtonState} />
                </div>
            </div>
        </CustomDialog >
    )
}