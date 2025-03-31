import React, { useState } from 'react';
import './InvitedList.scss';
import { useMutation } from '@apollo/client';
import { dateformat } from '../../../../Schema/StringFunctions/StringFuctions';
import { makeToast } from '../../../../Components/Toast/makeToast';
import { DeleteGroupInvites, ResendGroupInvites } from '../../../../ApolloClient/Mutation/GroupInvites';
import ButtonField from '../../../../Components/ButtonField/ButtonField';
import { Confirmation } from '../../../../Components/Confirmation/Confirmation';
import { DataNotFound } from '../../../../Components/DataNotFound/DataNotFound';
import { GroupInviteProps } from '../Main/GroupDetails';



interface InvitedListProps {
    invitedList: [GroupInviteProps],
    admin_id: string,
    onUpdated: () => void
}

export const InvitedList = ({ invitedList, admin_id, onUpdated }: InvitedListProps) => {
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

    const [resendRequestsPopup, setResendReqeustsPopup] = useState<boolean>(false);
    const [deleteRequestsPopup, setDeleteReqeustsPopup] = useState<boolean>(false);

    const [resendDisableState, setResendDisableState] = useState<boolean>(false);
    const [deleteDisableState, setDeleteDisableState] = useState<boolean>(false);

    const [resendInviteRequests] = useMutation(ResendGroupInvites);
    const [deleteInviteRequests] = useMutation(DeleteGroupInvites);

    const unSelectAllCheckBoxes = () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            (checkbox as HTMLInputElement).checked = false;
        });
    }
    const resendInvite = async () => {
        setResendDisableState(true);
        setResendReqeustsPopup(false);
        if (selectedRequests?.length > 0) {
            await resendInviteRequests({
                variables:
                {
                    input: {
                        invited_by: admin_id,
                        invites: selectedRequests
                    }
                },
                onCompleted: (data) => {
                    makeToast({ message: data?.resendGroupInvites, toastType: "success" });
                    onUpdated();
                },
                onError: (err) => {
                    makeToast({ message: err.message, toastType: "error" });
                }
            });
            setResendDisableState(false);
            unSelectAllCheckBoxes();
            setSelectedRequests([]);
        }
    }
    const deleteInvite = async () => {
        setDeleteDisableState(true);
        setDeleteReqeustsPopup(false);
        if (selectedRequests?.length > 0) {
            await deleteInviteRequests({
                variables:
                {
                    input: {
                        invited_by: admin_id,
                        invites: selectedRequests
                    }
                },
                onCompleted: (data) => {
                    makeToast({ message: data?.deleteGroupInvites, toastType: "success" });
                    onUpdated();
                },
                onError: (err) => {
                    makeToast({message: err?.message, toastType: "error"});
                }
            });
            setDeleteDisableState(false);
            unSelectAllCheckBoxes();
            setSelectedRequests([]);
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
        (invitedList ? <div className="invited-list group-members">
            <div className='actions'>

                {invitedList?.length > 0 &&
                    <>
                        <p>Actions : </p>
                        <ButtonField
                            type={'button'}
                            text={'Resend'}
                            className={selectedRequests.length > 0 ? 'blue_button' : ""}
                            disabledState={resendDisableState || selectedRequests?.length === 0}
                            onClick={() => setResendReqeustsPopup(true)} />
                        <ButtonField
                            type={'button'}
                            text={'Delete'}
                            className={selectedRequests.length > 0 ? 'red_button' : ""}
                            disabledState={deleteDisableState || selectedRequests?.length === 0}
                            onClick={() => setDeleteReqeustsPopup(true)} />
                    </>
                }
            </div>

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
                    {invitedList?.length > 0 ? invitedList?.map((invite: GroupInviteProps) => (
                        <tr key={invite?.invite_id}>
                            <td><input type="checkbox" name="" id="" value={invite.invite_id} onChange={handleCheckBoxChange} /></td>
                            <td>{invite?.email}</td>
                            <td>{dateformat({ date: invite?.invited_at })}</td>
                            <td>{invite?.registered_user ? "Registered" : "Not Registered"}</td>
                            <td className='invite_status'
                                style={
                                    { color: (invite?.invite_status === 'rejected' ? "var(--color-red)" : "var(--color-blue)") }}>
                                {invite?.invite_status}
                            </td>
                        </tr>
                    )) : <tr><td colSpan={5}><DataNotFound message={"Invited List"} /></td></tr>}
                </tbody>
            </table>
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
        </div > : <DataNotFound message={"Invited List Not found"} />)
    )
}