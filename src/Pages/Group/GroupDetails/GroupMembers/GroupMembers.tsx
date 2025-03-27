
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

interface MemberTypeProps {
    member_id: string,
    user_id: string,
    role: string,
    joined_at: string
    profile: {
        name: string
        email: string
    }
}
interface GroupMembersProps {
    userInGroup: MemberTypeProps
    group_members: [MemberTypeProps]
    created_by: string
    onUpdated: () => void
}

export const GroupMembers: React.FC<GroupMembersProps> = ({ userInGroup, group_members, created_by, onUpdated }) => {

    const user = useSelector((state: RootState) => state.user);
    const othersInGroup = group_members?.filter((member: MemberTypeProps) => member?.user_id !== user?.user_id);
    const userIsLeader = userInGroup?.role === "admin";
    const groupAdmins = group_members?.filter((member: MemberTypeProps) => member?.role === "admin");

    const [removeMemberPopupState, setRemoveMemberPopupState] = useState<boolean>(false);
    const [changeRolePopupState, setChangeRolePopupState] = useState<boolean>(false);
    
    const [removeMemberID, setRemoveMemberID] = useState<string>();
    const [changeRoleMemberID, setChangeRoleMemberID] = useState<string>();

    const [removeMemberDisableState, setRemoveMemberDisableState] = useState<boolean>(false);
    const [changeRoleDisableState, setChangeRoleDisableState] = useState<boolean>(false);


    const checkAndSetChangeRoleMember = (member: MemberTypeProps) => {

        if (member?.role === "member" && groupAdmins?.length === 2)
            makeToast({ message: "A Group can have 2 Admins only", toastType: "error" });
        else{
            setChangeRoleMember(member?.member_id, true);
        }    
    }
    const checkAndSetRemoveMember = (member_id: string)=>{
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
            variables: { admin_id: userInGroup?.member_id, member_id: changeRoleMemberID },
            onCompleted: (data) => {
                makeToast({ message: data?.changeRoleInGroup, toastType: "success" });
                onUpdated();
            },
            onError: (err) => {
                makeToast({ message: "Role Changes Failed", toastType: "error" });
                console.log(err.message);
            }
        })
        setChangeRoleMember("", false);
    }
    const removeMemberProcess = async () => {
        setRemoveMemberDisableState(true);
        setRemoveMemberPopupState(false);
        await remove({
            variables: { admin_id: userInGroup?.member_id, member_id: removeMemberID },
            onCompleted: (data) => {
                makeToast({ message: data?.deleteUserFromGroup, toastType: "success" });
                onUpdated();
            },
            onError: (err) => {
                makeToast({ message: err.message, toastType: "error" });
            }
        });
        setRemoveMember("", false);
    }


    return (
        <div className="group-members">
            {userInGroup &&
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Joined at</th>
                            {userIsLeader && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {userInGroup &&
                            <tr>
                                <td className="user-name">
                                    <p>{userInGroup?.profile?.name}</p>
                                    <p>(You)</p>
                                </td>
                                <td className="user-role"> {userInGroup?.role}</td>
                                <td>{dateformat({ date: userInGroup?.joined_at })} </td>

                            </tr>}

                        {othersInGroup?.map((member: MemberTypeProps) => (
                            <tr key={member?.member_id} >
                                <td className="user-name">{member?.profile?.name}</td>
                                <td className="user-role">{member?.role}</td>
                                <td>{dateformat({ date: member.joined_at })} </td>
                                {userIsLeader &&
                                    <>
                                        <td className="button_actions">
                                            <ButtonField
                                                type={"button"}
                                                className={created_by === member?.user_id ? "" : "blue_button"}
                                                text={member?.role === "admin" ? "Set as Member" : "Set as Admin"}
                                                onClick={() => checkAndSetChangeRoleMember(member)}
                                                disabledState={created_by === member?.user_id || changeRoleDisableState}
                                            />

                                            <ButtonField
                                                type={"button"}
                                                className={created_by === member?.user_id ? "" : "red_button"}
                                                text={"Remove"}
                                                onClick={() => checkAndSetRemoveMember(member?.member_id)}
                                                disabledState={created_by === member?.user_id || removeMemberDisableState}
                                            />
                                        </td>
                                    </>}
                            </tr>
                        ))}
                    </tbody>
                </table>}
            <Confirmation
                open={removeMemberPopupState}
                onSuccess={() => removeMemberProcess()}
                onClose={() => setRemoveMember("", false)}
                title={`Do you want to Remove a member?`}
                closeButtonText={"Cancel"}
                confirmButtonText={"Confirm"} />
            <Confirmation
                open={changeRolePopupState}
                onSuccess={() => changeRoleProcess()}
                onClose={() => setChangeRoleMember("", false)}
                title={`Do you want to Change Role of member?`}
                closeButtonText={"Cancel"}
                confirmButtonText={"Confirm"} />
        </div>
    )
}
