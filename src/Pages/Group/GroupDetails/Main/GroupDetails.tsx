import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GetInvitedList } from "../../../../ApolloClient/Queries/GroupInvites";
import { FullGroupDetails } from "../../../../ApolloClient/Queries/Groups";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import { Loader } from "../../../../Components/Loader/Loader";
import { RootState } from "../../../../Redux/store";
import { GroupMembers } from "../GroupMembers/GroupMembers";
import { InviteOthers } from "../InviteOthers/InviteOthers";
import './GroupDetails.scss';
import { DataNotFound } from "../../../../Components/DataNotFound/DataNotFound";
import { Group_Member_Props } from "../../Main/Group";
import { InvitedList } from "../InvitedList/InvitedList";
import { ErrorPage } from "../../../../Components/ErrorPage/ErrorPage";
import { makeToast } from "../../../../Components/Toast/makeToast";

export interface GroupInviteProps {
    invite_id: string,
    email: string,
    registered_user: boolean,
    invite_status: string,
    invited_at: string,
    invited_by: {
        member_id: string
        user: {
            name: string,
            email: string
        }
        group: {
            group_name: string,
            group_description: string
        }
    }
}


export const GroupDetails = () => {

    const user = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const [groupDetailsChild, setGroupDetailsChild] = useState('group-members');

    const [invitePopupState, setInvitePopupState] = useState<boolean>(false);
   
    const { data: group_data, loading, error, refetch: refetchGroupData } = useQuery(FullGroupDetails,
        {
            variables: { input: { group_id: group_id } },
            skip: !group_id,
            fetchPolicy: "network-only",
            onError: (err) => {
                console.log(err.message);
                makeToast({message: err?.message, toastType: "error"});
            }
        });

    const userInGroup = group_data?.group?.group_members?.find((member: Group_Member_Props) => member?.user?.user_id === user?.user_id);
    const userIsLeader = userInGroup?.user_role === "admin";

    const { data: invitedList, refetch: refetchInvitedList } = useQuery(GetInvitedList,
        {
            variables: { input: { admin_id: userInGroup?.member_id } },
            skip: !userInGroup?.member_id,
            fetchPolicy: "network-only"
        });
        
    const invitedEmails = invitedList?.getGroupInvitedList?.map((invite: GroupInviteProps) => invite?.email);
    
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorPage />;
    }
    

    return (
        (group_data?.group ?
            <div className="group-details-container">
                <div className='group-header'>
                    <div className='group-data'>
                        <div>
                            <h4>Group name : </h4>
                            <p className='group_name'>{group_data?.group?.group_name}</p>
                        </div>
                        <div>
                            <h4>Group description :</h4>
                            <p>{group_data?.group?.group_description}</p>
                        </div>
                        <div>
                            <h4>Members :</h4>
                            <p>{group_data?.group?.group_members?.length}</p>
                        </div>
                    </div>
                </div>
                <div className="tabs-container">
                    <div className='tabs'>
                        <ButtonField
                            type={"button"}
                            text={"Group Members"}
                            className={groupDetailsChild === 'group-members' ? 'active-tab tab' : 'tab '}
                            onClick={() => setGroupDetailsChild('group-members')} />
                        {userIsLeader &&
                            <ButtonField
                                type={"button"}
                                text={"Invited List"}
                                className={groupDetailsChild === 'invited-list' ? 'active-tab tab' : 'tab'}
                                onClick={() => setGroupDetailsChild('invited-list')} />}

                    </div>
                    <div className="Buttons">
                        {userIsLeader &&
                            <ButtonField
                                type={"button"}
                                text={"Invite"}
                                className={"blue_button invite-button"}
                                onClick={() => setInvitePopupState(true)} />}
                    </div>

                </div>

                <div className='group-body'>
                    {groupDetailsChild === 'group-members' &&
                        <GroupMembers
                            created_by={group_data?.group?.created_by}
                            group_members={group_data?.group?.group_members}
                            userInGroup={userInGroup}
                            onUpdated={refetchGroupData} />}
                    {groupDetailsChild === 'invited-list' &&
                        <InvitedList
                            admin_id={userInGroup?.member_id}
                            invitedList={invitedList?.getGroupInvitedList}
                            onUpdated={refetchInvitedList} />}
                </div>
                <InviteOthers
                    group_members={group_data?.group?.group_members}
                    admin_id={userInGroup?.member_id}
                    invitedEmails={invitedEmails}
                    open={invitePopupState}
                    onClose={() => setInvitePopupState(false)}
                    onUpdated={refetchInvitedList} />
            </div> : <DataNotFound />)

    )
}