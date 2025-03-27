import React, { useState } from 'react';
import './InvitedList.scss';
import { useMutation } from '@apollo/client';
import { dateformat } from '../../../../Schema/StringFunctions/StringFuctions';
import { makeToast } from '../../../../Components/Toast/makeToast';
import { DeleteGroupJoinRequests, ResendGroupJoinRequests } from '../../../../ApolloClient/Mutation/GroupRequests';
import ButtonField from '../../../../Components/ButtonField/ButtonField';
import { Confirmation } from '../../../../Components/Confirmation/Confirmation';


interface GroupRequestProps {
    request_id: string,
    email: string,
    user_registered: boolean,
    requested_at: string,
    status: string
}
interface InvitedListProps {
    invitedList: [GroupRequestProps],
    admin_id: string,
    onUpdated: () => void
}

export const InvitedList = ({ invitedList, admin_id, onUpdated }: InvitedListProps) => {
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

    const [resendRequestsPopup, setResendReqeustsPopup] = useState<boolean>(false);
    const [deleteRequestsPopup, setDeleteReqeustsPopup] = useState<boolean>(false);
    
    const [resendDisableState, setResendDisableState] = useState<boolean>(false);
    const [deleteDisableState, setDeleteDisableState] = useState<boolean>(false);

    const [resendInviteRequests] = useMutation(ResendGroupJoinRequests);
    const [deleteInviteRequests] = useMutation(DeleteGroupJoinRequests);

    const unSelectAllCheckBoxes = ()=>{
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            (cb as HTMLInputElement).checked = false;
        });
    }
    const resendInvite = async () => {
        if (selectedRequests?.length > 0) {
            await resendInviteRequests({
                variables: { admin_id: admin_id, requestIDs: selectedRequests },
                onCompleted: (data) => {
                    makeToast({ message: data?.resendGroupJoinRequests, toastType: "success" });
                    onUpdated();
                },
                onError: (err) => {
                    makeToast({message: err.message, toastType: "error"});
                }
            });
            unSelectAllCheckBoxes();
            setSelectedRequests([]);
            setResendReqeustsPopup(false);
        }
    }
    const deleteInvite = async () => {
        if (selectedRequests?.length > 0) {
            await deleteInviteRequests({
                variables: { admin_id: admin_id, requestIDs: selectedRequests },
                onCompleted: (data) => {
                    makeToast({ message: data?.deleteGroupJoinRequests, toastType: "success" });
                    onUpdated();
                },
                onError: (err) => {
                    console.log(err.message);
                }
            });
            unSelectAllCheckBoxes();
            setSelectedRequests([]);
            setDeleteReqeustsPopup(false);
        }

    }
    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event?.target;
        setSelectedRequests((prevSelected) => {
            if (checked) {
                return [...prevSelected, value];
            } else {
                return prevSelected.filter((id) => id !== value);
            }
        });
    }

    return (
        <div className="invited-list group-members">
            <div className='actions'>

                {invitedList?.length > 0 &&
                    <>
                    <p>Actions : </p>
                        <ButtonField 
                            type={'button'} 
                            text={'Resend'} 
                            className={selectedRequests.length > 0 ? 'blue_button' : ""} 
                            disabledState={selectedRequests?.length === 0} 
                            onClick={()=>setResendReqeustsPopup(true)}/>
                        <ButtonField 
                            type={'button'} 
                            text={'Delete'} 
                            className={selectedRequests.length > 0 ? 'red_button' : ""} 
                            disabledState={selectedRequests?.length === 0} 
                            onClick={()=>setDeleteReqeustsPopup(true)}/>
                    </>
                }
            </div>
            {invitedList?.length > 0 ?
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Email</th>
                            <th>Requested at</th>
                            <th>Registered</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitedList?.map((request: GroupRequestProps) => (
                            <tr key={request.request_id}>
                                <td><input type="checkbox" name="" id="" value={request.request_id} onChange={handleCheckBoxChange} /></td>
                                <td>{request?.email}</td>
                                <td>{dateformat({ date: request?.requested_at })}</td>
                                <td>{request?.user_registered ? "Registered" : "Not Registered"}</td>
                                <td className='request-status'
                                    style={
                                            {color: (request?.status === 'rejected' ? "var(--color-red)": "var(--color-blue)")}}>
                                    {request?.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table> : <p>No Invite Sent</p>}
            <Confirmation
                open={resendRequestsPopup}
                onClose={() => setResendReqeustsPopup(false)}
                title={'Do you want to Resend Invite Requests'}
                confirmButtonText={'Yes'}
                closeButtonText={'No'}
                onSuccess={resendInvite} />
            <Confirmation
                open={deleteRequestsPopup}
                onClose={() => setDeleteReqeustsPopup(false)}
                title={'Do you want to Delete Invite Requests'}
                confirmButtonText={'Yes'}
                closeButtonText={'No'}
                onSuccess={deleteInvite} />
        </div >
    )
}