import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonField from '../../../Components/ButtonField/ButtonField';
import { Header } from '../../../Components/Header/header';
import { makeToast } from '../../../Components/Toast/makeToast';
import { RootState } from '../../../Redux/store';
import AddGroup from '../AddGroup/AddGroup';
import { GroupMembers } from '../GroupMembers/GroupMembers';
import { InvitedList } from '../InvitedList/InvitedList';
import { InviteOthers } from '../InviteOthers/InviteOthers';
import './Group.scss';
import { GroupData } from '../../../ApolloClient/Queries/Groups';
import { Confirmation } from '../../../Components/Confirmation/Confirmation';
import { error } from 'console';

interface Group_Member_Props {
    user_id: String
    role: String
    profile: {
        name: String
        email: String
    }
}

const Group = () => {
    const [groupChild, setGroupChild] = useState<number>(0);

    const user = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const group_id = location?.state?.group_id;


    const [editGroup, setEditGroup] = useState<boolean>(false);
    const [inviteOtherState, setInviteOtherState] = useState<boolean>(false);
    const { data: group_data, loading, error, refetch: refetchGroupData } = useQuery(GroupData,
        {
            variables: { group_id: group_id },
            skip: !group_id,
            fetchPolicy: "network-only",
            onError: (err) => {
                console.log("Fetching Group Data failed ", err.message);
            }
        });
    if (loading) {
        return <p>Loading...</p>
    }
    if(error){
        return <p>Error</p>;
    }
    const userInGroup = group_data?.group?.group_members?.find((member: Group_Member_Props) => member.user_id === user?.user_id);
    const userIsLeader = userInGroup?.role === "admin";

    const MemberNavItems = [
        { label: "Group", onClick: () => setGroupChild(0) },
    ]
    const LeaderNavItems = [
        { label: "Group", onClick: () => setGroupChild(0) },
        { label: "Plan Trip", onClick: () => makeToast({ message: "Plan Trip Clicked", toastType: "success" }) },
    ]
    return (
        <div className="left-main-container group-container">
            <Header items={true ? LeaderNavItems : MemberNavItems} />
            {!userInGroup && <Confirmation open={true} onClose={() => navigate(-1)} title={'You are Removed From this Group'} confirmButtonText={'Ok'} />}
            <div className='group-header'>
                <div className='group-data'>
                    <div>
                        <h3>Group name </h3>
                        <p className='group_name'>{group_data?.group?.name}</p>
                    </div>
                    <div>
                        <h3>Group description</h3>
                        <p>{group_data?.group?.description}</p>
                    </div>
                </div>
                {userIsLeader &&
                    <ButtonField type={'button'} text={`Edit Group details`} className={'blue_button'} onClick={() => setEditGroup(true)} />
                }
            </div>
            <div className="tabs-container">
                <div className='tabs'>
                    <ButtonField type={"button"} text={"Group Members"} className={groupChild === 0 ? 'active_tab tab' : 'tab '} onClick={() => setGroupChild(0)} />
                    {userIsLeader &&
                        <ButtonField type={"button"} text={"Invited List"} className={groupChild === 1 ? 'active_tab tab' : 'tab'} onClick={() => setGroupChild(1)} />
                        }

                </div>
                {userIsLeader && 
                    <ButtonField type={"button"} text={"Invite"} className={"blue_button invite-button"} onClick={() => setInviteOtherState(true)} />
                    }
                
            </div>

            <div className='group-body'>
                {groupChild === 0 && <GroupMembers userInGroup={userInGroup} />}
                {groupChild === 1 && <InvitedList />}
            </div>
            <AddGroup group_id={group_id} group_name={group_data?.group?.name} group_description={group_data?.group?.description}
                onUpdated={() => { refetchGroupData() }} open={editGroup} onClose={() => setEditGroup(false)} />
            <InviteOthers open={inviteOtherState} onClose={() => setInviteOtherState(false)} />
        </div>

    )
}
export default Group;