
import { useMutation, useQuery, } from "@apollo/client"
import { useLocation } from "react-router-dom"
import { useState } from "react";
import { Confirmation } from "../../../Components/Confirmation/Confirmation";
import { ChangeRoleInGroup, DeleteUserFromGroup } from "../../../ApolloClient/Mutation/Groups";
import { makeToast } from "../../../Components/Toast/makeToast";
import { dateformat } from "../../../Schema/StringFunctions/StringFuctions";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import { GroupData } from "../../../ApolloClient/Queries/Groups";

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
}

export const GroupMembers: React.FC<GroupMembersProps> = ({ userInGroup }) => {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const { data: group_data, loading,error, refetch: refetchGroupData } = useQuery(GroupData,
        {
            variables: { group_id: group_id },
            skip: !group_id,
            fetchPolicy: "network-only",
            onError: (err) => {
                console.log("Fetching Group Members data failed ", err.message);
            }
        });
    const userIsLeader = userInGroup?.role === "admin";
    const group_members = group_data?.group?.group_members?.filter((member: MemberTypeProps) => userInGroup?.user_id !== member?.user_id);

    const [removeMemberPopupState, setRemoveMemberPopupState] = useState<boolean>(false);
    const [removeMemberID, setRemoveMemberID] = useState<string>();

    const [changeRolePopupState, setChangeRolePopupState] = useState<boolean>(false);
    const [changeRoleMemberID, setChangeRoleMemberID] = useState<string>();

    
    const setRemoveMember = (member_id: string, popupState: boolean) => {
        setRemoveMemberID(member_id);
        setRemoveMemberPopupState(popupState);
    }
    const setChangeRoleMember = (member_id: string, popupState: boolean)=>{
        setChangeRoleMemberID(member_id);
        setChangeRolePopupState(popupState);
    }

    const [remove] = useMutation(DeleteUserFromGroup);          // Remove Member Mutation
    const [change] = useMutation(ChangeRoleInGroup);            // Change Role  of Member Mutation

    if(loading){
        return <p>Loading...</p>;
    }
    if(error){
        return <p>Error..</p>;
    }
    const removeMember = async () => {
        await remove({
            variables: { admin_id: userInGroup?.member_id, member_id: removeMemberID },
            onCompleted: (data) => {
                makeToast({ message: data?.deleteUserFromGroup, toastType: "success" });
                refetchGroupData();
            },
            onError: (err) => {
                makeToast({ message: err.message, toastType: "error" });
            }
        });
        setRemoveMember("", false);
    }
    const changeRole= async ()=>{
        await change({
            variables: {admin_id: userInGroup?.member_id, member_id: changeRoleMemberID},
            onCompleted: (data)=>{
                makeToast({message: data?.changeRoleInGroup, toastType: "success"});
                refetchGroupData();
            },
            onError: (err)=>{
                makeToast({message: "Role Changes Failed", toastType: "error"});
                console.log(err.message);
            }
        })
        setChangeRoleMember("", false);
    }

    return (
        <div className="group-members">
         { userInGroup &&
                <table>
                    <tr>
                        <th>Name</th>
                        {/* <th>Email</th> */}
                        <th>Role</th>
                        <th>Joined at</th>
                        {userIsLeader && group_members?.length > 0 &&
                            <>
                                <th></th>
                                <th></th>
                            </>
                        }
                    </tr>
                    {userInGroup &&
                        <tr>
                            <td className="capitalized">
                                {userInGroup?.profile?.name}<p> (You)</p>
                            </td>
                            <td className="capitalized"> {userInGroup?.role}</td>
                            <td>{dateformat({ date: userInGroup?.joined_at })} </td>

                        </tr>}

                    {group_members?.map((member: MemberTypeProps) => (
                        <tr key={member?.member_id} title={group_data?.group?.created_by === member?.user_id ? "Group Owner" : member?.role}>
                            <td className="capitalized">{member?.profile?.name}</td>
                            <td className="capitalized">{member?.role}</td>
                            <td>{dateformat({ date: member.joined_at })} </td>
                            {userIsLeader  && 
                            <>
                                <td >
                                <ButtonField
                                    type={"button"}
                                    className={group_data?.group?.created_by === member?.user_id ? "" : (member?.role==="admin" ? "blue_button": "darkblue_button")}
                                    text={member?.role === "admin" ? "Set as Member" : "Set as Admin"}
                                    onClick={() => {setChangeRoleMember(member?.member_id, true)}}
                                    disabledState= {group_data?.group?.created_by === member?.user_id}
                                />
                                </td>
                                <td >
                                    <ButtonField
                                        type={"button"}
                                        className={group_data?.group?.created_by === member?.user_id ? "" : "red_button"}
                                        text={"Remove"}
                                        onClick={() => setRemoveMember(member?.member_id, true)}
                                        disabledState= {group_data?.group?.created_by === member?.user_id}
                                    />
                                </td>
                            </>}
                        </tr>
                    ))}
                </table>}
            <Confirmation open={removeMemberPopupState} onSuccess={() => removeMember()} onClose={() => setRemoveMember("", false)} title={`Remove `} closeButtonText={"Cancel"} confirmButtonText={"Confirm"} />
            <Confirmation open={changeRolePopupState} onSuccess={() => changeRole()} onClose={() => setChangeRoleMember("", false)} title={`Change Role`} closeButtonText={"Cancel"} confirmButtonText={"Confirm"} />
        </div>
    )
}
