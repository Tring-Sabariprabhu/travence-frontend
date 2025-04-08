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
    const [selectedInvites, setSelectedInvites] = useState<string[]>([]);

    const [resendInvitesPopup, setResendInvitesPopup] = useState<boolean>(false);
    const [deleteInvitesPopup, setDeleteInvitesPopup] = useState<boolean>(false);

    const [resendDisableState, setResendDisableState] = useState<boolean>(false);
    const [deleteDisableState, setDeleteDisableState] = useState<boolean>(false);

    const [resendInvites] = useMutation(ResendGroupInvites);
    const [deleteInvites] = useMutation(DeleteGroupInvites);

    const unSelectAllCheckBoxes = () => {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            (checkbox as HTMLInputElement).checked = false;
        });
    }
    const resendInvite = async () => {
        setResendDisableState(true);
        setResendInvitesPopup(false);
        if (selectedInvites?.length > 0) {
            await resendInvites({
                variables:
                {
                    input: {
                        invited_by: admin_id,
                        invites: selectedInvites
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
            setSelectedInvites([]);
        }
    }
    const deleteInvite = async () => {
        setDeleteDisableState(true);
        setDeleteInvitesPopup(false);
        if (selectedInvites?.length > 0) {
            await deleteInvites({
                variables:
                {
                    input: {
                        invited_by: admin_id,
                        invites: selectedInvites
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
            setSelectedInvites([]);
        }

    }
    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event?.target;
        setSelectedInvites((prevInvites) => {
            if (checked) {
                return [...prevInvites, value];
            } else {
                return prevInvites.filter((id) => id !== value);
            }
        });
    }

    return (
        <div className="invited-list-container">
            <div className='actions'>
                {invitedList?.length > 0 &&
                    <>
                        <p>Actions : </p>
                        <ButtonField
                            type={'button'}
                            text={'Resend'}
                            className={selectedInvites.length > 0 ? 'blue_button' : ""}
                            disabledState={resendDisableState || selectedInvites?.length === 0}
                            onClick={() => setResendInvitesPopup(true)} />
                        <ButtonField
                            type={'button'}
                            text={'Delete'}
                            className={selectedInvites.length > 0 ? 'red_button' : ""}
                            disabledState={deleteDisableState || selectedInvites?.length === 0}
                            onClick={() => setDeleteInvitesPopup(true)} />
                    </>
                }
            </div>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Email</th>
                        <th>Invited at</th>
                        <th>Registered</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {invitedList?.length > 0 ? invitedList?.map((invite: GroupInviteProps) => (
                        <tr key={invite?.invite_id}>
                            <td><input type="checkbox" name="" id="" value={invite.invite_id} onChange={handleCheckBoxChange} /></td>
                            <td>{invite?.email}</td>
                            <td>{dateformat({ timestamp: invite?.invited_at })}</td>
                            <td>{invite?.registered_user ? "Registered" : "Not Registered"}</td>
                            <td className='invite_status'
                                style={
                                    { color: (invite?.invite_status === 'rejected' ? "var(--color-red)" : "var(--color-blue)") }}>
                                {invite?.invite_status}
                            </td>
                        </tr>
                    )) : <tr><td colSpan={5}><DataNotFound  /></td></tr>}
                </tbody>
            </table>
            <Confirmation
                open={resendInvitesPopup}
                onClose={() => setResendInvitesPopup(false)}
                title={'Do you want to Resend Invite Requests'}
                confirmButtonText={'Yes'}
                closeButtonText={'No'}
                onSuccess={resendInvite} />
            <Confirmation
                open={deleteInvitesPopup}
                onClose={() => setDeleteInvitesPopup(false)}
                title={'Do you want to Delete Invite Requests'}
                confirmButtonText={'Yes'}
                closeButtonText={'No'}
                onSuccess={deleteInvite} />
        </div>
    )
}