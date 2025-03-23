
import { useMutation, useQuery, } from "@apollo/client"
import { useLocation } from "react-router-dom"
import { useState } from "react";
import { Confirmation } from "../../../Components/Confirmation/Confirmation";
import { ChangeRoleInGroup, DeleteUserFromGroup } from "../../../ApolloClient/Mutation/Groups";
import { makeToast } from "../../../Components/Toast/makeToast";
import { dateformat } from "../../../Schema/StringFunctions/StringFuctions";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import { GroupData } from "../../../ApolloClient/Queries/Groups";
import './GroupMembers.scss';
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

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
    const othersInGroup = group_members.filter((member: MemberTypeProps) => member?.user_id !== user?.user_id);
    const userIsLeader = userInGroup?.role === "admin";
    const groupAdmins = group_members?.filter((member: MemberTypeProps) => member?.role === "admin");

    const [removeMemberPopupState, setRemoveMemberPopupState] = useState<boolean>(false);
    const [removeMemberID, setRemoveMemberID] = useState<string>();

    const [changeRolePopupState, setChangeRolePopupState] = useState<boolean>(false);
    const [changeRoleMemberID, setChangeRoleMemberID] = useState<string>();


    const checkAndSetChangeRoleMember = (member: MemberTypeProps) => {
        if (member?.role === "member" && groupAdmins?.length === 2)
            makeToast({ message: "A Group can have 2 Admins only", toastType: "error" });
        else
            setChangeRoleMember(member?.member_id, true);
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


    const removeMemberProcess = async () => {
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
    const changeRoleProcess = async () => {
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
                                <td className="capitalized userInGroup">
                                    <p>{userInGroup?.profile?.name}</p>
                                    <p>(You)</p>
                                </td>
                                <td className="capitalized"> {userInGroup?.role}</td>
                                <td>{dateformat({ date: userInGroup?.joined_at })} </td>

                            </tr>}

                        {othersInGroup?.map((member: MemberTypeProps) => (
                            <tr key={member?.member_id} >
                                <td className="capitalized">{member?.profile?.name}</td>
                                <td className="capitalized">{member?.role}</td>
                                <td>{dateformat({ date: member.joined_at })} </td>
                                {userIsLeader &&
                                    <>
                                        <td className="button_actions">
                                            <ButtonField
                                                type={"button"}
                                                className={created_by === member?.user_id ? "" : "blue_button"}
                                                text={member?.role === "admin" ? "Set as Member" : "Set as Admin"}
                                                onClick={() => checkAndSetChangeRoleMember(member)}
                                                disabledState={created_by === member?.user_id}
                                            />

                                            <ButtonField
                                                type={"button"}
                                                className={created_by === member?.user_id ? "" : "red_button"}
                                                text={"Remove"}
                                                onClick={() => setRemoveMember(member?.member_id, true)}
                                                disabledState={created_by === member?.user_id}
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
                title={`Remove Member`}
                closeButtonText={"Cancel"}
                confirmButtonText={"Confirm"} />
            <Confirmation
                open={changeRolePopupState}
                onSuccess={() => changeRoleProcess()}
                onClose={() => setChangeRoleMember("", false)}
                title={`Change Role`}
                closeButtonText={"Cancel"}
                confirmButtonText={"Confirm"} />
        </div>
    )
}
