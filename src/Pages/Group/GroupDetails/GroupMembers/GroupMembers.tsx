
import { useMutation } from "@apollo/client"
import { useState } from "react";
import { Confirmation } from "../../../../Components/Confirmation/Confirmation";
import { ChangeRoleInGroup, DeleteUserFromGroup } from "../../../../ApolloClient/Mutation/Groups";
import { makeToast } from "../../../../Components/Toast/makeToast";
import { dateformat } from "../../../../Schema/StringFunctions/StringFuctions";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import './GroupMembers.scss';
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { DataNotFound } from "../../../../Components/DataNotFound/DataNotFound";
import { Group_Member_Props } from "../../Main/Group";
import { AdminPanelSettings, Leaderboard, Person, Person2Rounded, Person3, Person4, PersonRemove } from "@mui/icons-material";
import { ListSubheader } from "@mui/material";



interface GroupMembersProps {
    userInGroup: Group_Member_Props
    group_members: [Group_Member_Props]
    created_by: {
        user_id: string
    }
    onUpdated: () => void
}

export const GroupMembers: React.FC<GroupMembersProps> = ({ userInGroup, group_members, created_by, onUpdated }) => {

    const user = useSelector((state: RootState) => state.user);
    const othersInGroup = group_members?.filter((member: Group_Member_Props) => member?.user?.user_id !== user?.user_id);
    const groupAdmins = group_members?.filter((member: Group_Member_Props) => member?.user_role === "admin");

    const [removeMemberPopupState, setRemoveMemberPopupState] = useState<boolean>(false);
    const [changeRolePopupState, setChangeRolePopupState] = useState<boolean>(false);

    const [removeMemberID, setRemoveMemberID] = useState<string>();
    const [changeRoleMemberID, setChangeRoleMemberID] = useState<string>();

    const [removeMemberDisableState, setRemoveMemberDisableState] = useState<boolean>(false);
    const [changeRoleDisableState, setChangeRoleDisableState] = useState<boolean>(false);


    const checkAndSetChangeRoleMember = (member: Group_Member_Props) => {

        if (member?.user_role === "member" && groupAdmins?.length === 2)
            makeToast({ message: "A Group can have 2 Admins only", toastType: "error" });
        else {
            setChangeRoleMember(member?.member_id, true);
        }
    }
    const checkAndSetRemoveMember = (member_id: string) => {
        setRemoveMember(member_id, true);
    }

    const setRemoveMember = (member_id: string, popupState: boolean) => {
        setRemoveMemberID(member_id);
        setRemoveMemberPopupState(popupState);
    }

    const setChangeRoleMember = (member_id: string, popupState: boolean) => {
        setChangeRoleMemberID(member_id);
        setChangeRolePopupState(popupState);
    }

    const [remove] = useMutation(DeleteUserFromGroup);          // Remove Member Mutation
    const [change] = useMutation(ChangeRoleInGroup);            // Change Role  of Member Mutation


    const changeRoleProcess = async () => {
        setChangeRoleDisableState(true);
        setChangeRolePopupState(false);
        await change({
            variables:
            {
                input: {
                    admin_id: userInGroup?.member_id,
                    member_id: changeRoleMemberID
                }
            },
            onCompleted: (data) => {
                makeToast({ message: data?.changeRole, toastType: "success" });
                onUpdated();
            },
            onError: (err) => {
                makeToast({ message: "Role Changes Failed", toastType: "error" });
                console.log(err.message);
            }
        })
        setChangeRoleDisableState(false);
        setChangeRoleMember("", false);
    }
    const removeMemberProcess = async () => {
        setRemoveMemberDisableState(true);
        setRemoveMemberPopupState(false);
        await remove({
            variables:
            {
                input: {
                    admin_id: userInGroup?.member_id,
                    member_id: removeMemberID
                }
            },
            onCompleted: (data) => {
                makeToast({ message: data?.deleteGroupMember, toastType: "success" });
                onUpdated();
            },
            onError: (err) => {
                makeToast({ message: err.message, toastType: "error" });
            }
        });
        setRemoveMemberDisableState(false);
        setRemoveMember("", false);
    }


    return (
        <div className="group-members-container">
            {userInGroup ?
                <div className="group-members-list">
                    <div className="member">
                        <Person />
                        <div className="person-details">
                            <h4 className="user-name">{userInGroup?.user?.name} (You)</h4>
                            <h4 className="user-role">{userInGroup?.user_role}</h4>
                        </div>
                        <div>
                            <h5 title="joined date">{dateformat({ timestamp: userInGroup?.joined_at })}</h5>
                        </div>
                    </div>
                    {
                        othersInGroup &&
                        othersInGroup.map((member, index) => (
                            <div className="member" key={index}>
                                <Person />
                                <div >
                                    <h4 className="user-name">{member?.user?.name}</h4>
                                    <h4 className="user-role">{member?.user_role}</h4>
                                </div>
                                <div>
                                    <h5 title="joined date">{dateformat({ timestamp: member?.joined_at })}</h5>
                                </div>
                                {
                                    userInGroup?.user_role === 'admin' &&
                                    <div className="button_actions">

                                        <ButtonField
                                            type={"button"}
                                            className={created_by?.user_id === member?.user?.user_id ? "" : "blue_button"}
                                            text={member?.user_role === "admin" ? "Set as Member" : "Set as Admin"}
                                            onClick={() => checkAndSetChangeRoleMember(member)}
                                            disabledState={created_by?.user_id === member?.user?.user_id || changeRoleDisableState}
                                        />

                                        <ButtonField
                                            type={"button"}
                                            className={created_by?.user_id === member?.user?.user_id ? "" : "red_button"}
                                            text={"Remove"}
                                            onClick={() => checkAndSetRemoveMember(member?.member_id)}
                                            disabledState={created_by?.user_id === member?.user?.user_id || removeMemberDisableState}
                                        />
                                    </div>}
                            </div>
                        ))
                    }
                </div> : <DataNotFound  />
            }

            <Confirmation
                open={removeMemberPopupState}
                onSuccess={() => removeMemberProcess()}
                onClose={() => setRemoveMember("", false)}
                title={`Do you want to Remove a user?`}
                closeButtonText={"Cancel"}
                confirmButtonText={"Confirm"} />
            <Confirmation
                open={changeRolePopupState}
                onSuccess={() => changeRoleProcess()}
                onClose={() => setChangeRoleMember("", false)}
                title={`Do you want to Change Role of user?`}
                closeButtonText={"Cancel"}
                confirmButtonText={"Confirm"} />
        </div>
    )
}
