
import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react";
import { Confirmation } from "../../../../Components/Confirmation/Confirmation";
import { ChangeRoleInGroup, DeleteUserFromGroup } from "../../../../ApolloClient/Mutation/Groups";
import { makeToast } from "../../../../Components/Toast/makeToast";
import { dateformat } from "../../../../Schema/StringFunctions/StringFuctions";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import './GroupMembers.scss';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { DataNotFound } from "../../../../Components/DataNotFound/DataNotFound";
import { Group_Member_Props } from "../../Main/Group";
import { Person } from "@mui/icons-material";
import { GroupMemberDetails, GroupMembersDetails } from "../../../../ApolloClient/Queries/Groups";
import { setUser } from "../../../../Redux/userSlice";
import { useLocation } from "react-router-dom";
import { Loader } from "../../../../Components/Loader/Loader";
import { ErrorPage } from "../../../../Components/ErrorPage/ErrorPage";



interface GroupMembersProps {
    created_by: {
        user_id: string
    }
 
}

export const GroupMembers: React.FC<GroupMembersProps> = ({ created_by}) => {

    
    const user = useSelector((state: RootState) => state.user);
    
    const [removeMemberPopupState, setRemoveMemberPopupState] = useState<boolean>(false);
    const [changeRolePopupState, setChangeRolePopupState] = useState<boolean>(false);

    const [removeMemberID, setRemoveMemberID] = useState<string>();
    const [changeRoleMemberID, setChangeRoleMemberID] = useState<string>();

    const [removeMemberDisableState, setRemoveMemberDisableState] = useState<boolean>(false);
    const [changeRoleDisableState, setChangeRoleDisableState] = useState<boolean>(false);


    const checkAndSetChangeRoleMember = (member: Group_Member_Props) => {
        setChangeRoleMember(member?.member_id, true);
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
                    admin_id: user?.current_group_member_id,
                    member_id: changeRoleMemberID
                }
            },
            onCompleted: (data) => {
                makeToast({ message: data?.changeRole, toastType: "success" });
                refetch();
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
                    admin_id: user?.current_group_member_id,
                    member_id: removeMemberID
                }
            },
            onCompleted: (data) => {
                makeToast({ message: data?.deleteGroupMember, toastType: "success" });
                refetch();
            },
            onError: (err) => {
                makeToast({ message: err.message, toastType: "error" });
            }
        });
        setRemoveMemberDisableState(false);
        setRemoveMember("", false);
    }

    const { data: userInGroup, loading: userInGroupLoading, error: userInGroupError } = useQuery(GroupMemberDetails, {
        variables: {
            input: {
                group_id: user?.group_id,
            }
        },
        skip: !user?.group_id
    })
    const { data , loading, error, refetch} = useQuery(GroupMembersDetails, 
        {
            variables: {
                input: {
                    group_id: user?.group_id,
                }
            },
            skip: !user?.group_id,
            onCompleted(data) {
               console.log(data) 
            },
        }
    )
    if (loading || userInGroupLoading) {
        return <Loader />;
    } else if (error || userInGroupError) {
        return <ErrorPage />;
    }
    const othersInGroup = data?.groupMembers?.filter((member:Group_Member_Props)=> member?.member_id !== userInGroup?.groupMember?.member_id)    
    return (
        <div className="group-members-container">
            {userInGroup ?
                <div className="group-members-list">
                    <div className="member">
                        <Person />
                        <div className="person-details">
                            <h4 className="user-name">{userInGroup?.groupMember?.user?.name} (You)</h4>
                            <h4 className="user-role">{userInGroup?.groupMember?.user_role}</h4>
                        </div>
                        <div>
                            <h5 title="joined date">{dateformat({ timestamp: userInGroup?.groupMember?.joined_at })}</h5>
                        </div>
                    </div>
                    {
                        othersInGroup &&
                        othersInGroup?.map((member : Group_Member_Props, index: number) => (
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
                                    userInGroup?.groupMember?.user_role === 'admin' &&
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
                </div> : <DataNotFound />
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
