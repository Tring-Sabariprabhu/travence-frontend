import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {  Group_Details, GroupMemberDetails } from "../../../../ApolloClient/Queries/Groups";
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
import { setUser } from "../../../../Redux/userSlice";

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
    const [groupDetailsChild, setGroupDetailsChild] = useState('group-members');

    const [invitePopupState, setInvitePopupState] = useState<boolean>(false);
   
    const { data: group_data, loading, error } = useQuery(Group_Details,
        {
            variables: { 
                input: { 
                    group_id: user?.group_id 
                } 
            },
            skip: !user?.group_id,
            fetchPolicy: "network-only",
            onError: (err) => {
                console.log(err.message);
                makeToast({message: err?.message, toastType: "error"});
            }
        });

    const [userInGroup, setUserInGroup] = useState<Group_Member_Props>();
    
     useQuery(GroupMemberDetails, {
        variables: {
            input: {
                group_id: user?.group_id,
            }
        },
        skip: !user?.group_id,
        onCompleted(data) {
            setUserInGroup(data?.groupMember);
        },
    })
    
    
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
                    </div>
                </div>
                <div className="tabs-container">
                    <div className='tabs'>
                        <ButtonField
                            type={"button"}
                            text={"Group Members"}
                            className={groupDetailsChild === 'group-members' ? 'active-tab tab' : 'tab '}
                            onClick={() => setGroupDetailsChild('group-members')} />
                        {userInGroup?.user_role === "admin" &&
                            <ButtonField
                                type={"button"}
                                text={"Invited List"}
                                className={groupDetailsChild === 'invited-list' ? 'active-tab tab' : 'tab'}
                                onClick={() => setGroupDetailsChild('invited-list')} />}

                    </div>
                    <div className="Buttons">
                    {userInGroup?.user_role === "admin" &&
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
                            created_by={group_data?.group?.created_by}/>}
                    {groupDetailsChild === 'invited-list' &&
                        <InvitedList/>}
                </div>
                <InviteOthers
                    open={invitePopupState}
                    onClose={() => setInvitePopupState(false)}
                    />
            </div> : <DataNotFound />)

    )
}