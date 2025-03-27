import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GetInvitedlist } from "../../../../ApolloClient/Queries/GroupRequests";
import { GroupData } from "../../../../ApolloClient/Queries/Groups";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import { Loader } from "../../../../Components/Loader/Loader";
import { RootState } from "../../../../Redux/store";
import AddGroup from "../AddGroup/AddGroup";
import { GroupMembers } from "../GroupMembers/GroupMembers";
import { InvitedList } from "../InvitedList/InvitedList";
import { InviteOthers } from "../InviteOthers/InviteOthers";
import './GroupDetails.scss';
import { DataNotFound } from "../../../../Components/DataNotFound/DataNotFound";


interface Group_Member_Props {
    user_id: string
    role: string
    profile: {
        name: string
        email: string
    }
}
interface GroupRequestProps {
    request_id: string,
    email: string,
    user_registered: boolean,
    requested_at: string,
    status: string
}


export const GroupDetails = () => {

    const user = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const [groupDetailsChild, setGroupDetailsChild] = useState('group-members');

    const [editGroupPopupState, setEditGroupPopupState] = useState<boolean>(false);
    const [invitePopupState, setInvitePopupState] = useState<boolean>(false);

    const { data: group_data, loading, error, refetch: refetchGroupData } = useQuery(GroupData,
        {
            variables: { group_id: group_id },
            skip: !group_id,
            fetchPolicy: "network-only",
            onError: (err) => {
                console.log("Fetching Group Data failed ", err.message);
            }
        });

    const userInGroup = group_data?.group?.group_members?.find((member: Group_Member_Props) => member.user_id === user?.user_id);
    const userIsLeader = userInGroup?.role === "admin";

    const { data: invitedList, refetch: refetchInvitedList } = useQuery(GetInvitedlist,
        {
            variables: { admin_id: userInGroup?.member_id },
            fetchPolicy: "network-only"
        });

    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <p>Error</p>;
    }
    const invitedEmails = invitedList?.getGroupInvitedList?.map((request: GroupRequestProps) => request.email);

    return (
        (group_data?.group ?
            <div className="group-details-container">
                <div className='group-header'>
                    <div className='group-data'>
                        <div>
                            <h4>Group name : </h4>
                            <p className='group_name'>{group_data?.group?.name}</p>
                        </div>
                        <div>
                            <h4>Group description :</h4>
                            <p>{group_data?.group?.description}</p>
                        </div>
                        <div>
                            <h4>Members :</h4>
                            <p>{group_data?.group?.group_members?.length}</p>
                        </div>
                    </div>
                    {userIsLeader &&
                        <ButtonField type={'button'}
                            text={`Edit Group details`}
                            className={'blue_button'}
                            onClick={() => setEditGroupPopupState(true)} />
                    }
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
                    {userIsLeader &&
                        <ButtonField
                            type={"button"}
                            text={"Invite"}
                            className={"blue_button invite-button"}
                            onClick={() => setInvitePopupState(true)} />}
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
                <AddGroup
                    open={editGroupPopupState}
                    onClose={() => setEditGroupPopupState(false)}
                    group_id={group_id}
                    group_name={group_data?.group?.name}
                    group_description={group_data?.group?.description}
                    onUpdated={refetchGroupData} />
                <InviteOthers
                    group_members={group_data?.group?.group_members}
                    admin_id={userInGroup?.member_id}
                    invitedEmails={invitedEmails}
                    open={invitePopupState}
                    onClose={() => setInvitePopupState(false)}
                    onUpdated={refetchInvitedList} />
            </div> : <DataNotFound message={"Group Not Found"} />)

    )
}