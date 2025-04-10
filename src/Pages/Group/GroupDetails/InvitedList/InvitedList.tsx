import React, { useEffect, useState } from 'react';
import './InvitedList.scss';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { dateformat } from '../../../../Schema/StringFunctions/StringFuctions';
import { makeToast } from '../../../../Components/Toast/makeToast';
import { DeleteGroupInvites, ResendGroupInvites } from '../../../../ApolloClient/Mutation/GroupInvites';
import ButtonField from '../../../../Components/ButtonField/ButtonField';
import { Confirmation } from '../../../../Components/Confirmation/Confirmation';
import { DataNotFound } from '../../../../Components/DataNotFound/DataNotFound';
import { GroupInviteProps } from '../Main/GroupDetails';
import { GetGroupInvite, GetInvitedList, GetInvitedList_Count } from '../../../../ApolloClient/Queries/GroupInvites';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../Redux/store';
import { Loader } from '../../../../Components/Loader/Loader';
import { ErrorPage } from '../../../../Components/ErrorPage/ErrorPage';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';


export const InvitedList = () => {
    const recordPerPage = 3;

    const user = useSelector((state: RootState) => state.user);
    useQuery(GetInvitedList_Count, {
        variables: {
            admin_id: user?.current_group_member_id
        },
        onCompleted: (data) => {
            setCurrentPage(1);
            const { getGroupInvitedListCount: count } = data;
            setPagesCount(count % recordPerPage === 0 ? count / recordPerPage : parseInt((count / recordPerPage).toString()) + 1)
            console.log(count % recordPerPage === 0 ? count / recordPerPage : parseInt((count / recordPerPage).toString()) + 1)
        },
    })
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pagesCount, setPagesCount] = useState<number>();

    const { data, loading, error, refetch: refetchInvitedList } = useQuery(GetInvitedList,
        {
            variables:
            {
                input: {
                    admin_id: user?.current_group_member_id,
                    limit: recordPerPage,
                    offset: (currentPage - 1) * recordPerPage
                }
            },
            skip: !user?.current_group_member_id,
            fetchPolicy: "network-only"
        });
    const [selectedInvites, setSelectedInvites] = useState<string[]>([]);

    const [resendInvitesPopup, setResendInvitesPopup] = useState<boolean>(false);
    const [deleteInvitesPopup, setDeleteInvitesPopup] = useState<boolean>(false);

    const [resendDisableState, setResendDisableState] = useState<boolean>(false);
    const [deleteDisableState, setDeleteDisableState] = useState<boolean>(false);

    const [resendInvites] = useMutation(ResendGroupInvites);
    const [deleteInvites] = useMutation(DeleteGroupInvites);
    const [searchInput, setSearchInput] = useState<string>("");

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
                        invited_by: user?.current_group_member_id,
                        invites: selectedInvites
                    }
                },
                onCompleted: (data) => {
                    refetchInvitedList();
                    makeToast({ message: data?.resendGroupInvites, toastType: "success" });
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
                        invited_by: user?.current_group_member_id,
                        invites: selectedInvites
                    }
                },
                onCompleted: (data) => {
                    refetchInvitedList();
                    makeToast({ message: data?.deleteGroupInvites, toastType: "success" });
                },
                onError: (err) => {
                    makeToast({ message: err?.message, toastType: "error" });
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
    const [getInvite] = useLazyQuery(GetGroupInvite);
    const [searchedResult, setSearchedResult] = useState<GroupInviteProps>();
    useEffect(() => {
        setTimeout(async () => {
            if (searchInput?.trim()?.length > 0 ) {
                await getInvite({
                    variables: {
                        input: {
                            admin_id: user?.current_group_member_id,
                            email: searchInput
                        }
                    },
                    onCompleted: (data) => {
                        const { getGroupInvite } = data;
                        if (getGroupInvite) {
                            setSearchedResult(getGroupInvite);
                        }
                    },
                })
            }
        }, 1000);
    }, [searchInput]);
    
    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event?.target;
        setSearchInput(value);
        setSearchedResult(undefined);
    }
    if (loading) {
        return <Loader />;
    } else if (error) {
        return <ErrorPage />;
    }
    return (
        <div className="invited-list-container">
            <header>
                {
                    <div>
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
                    </div>
                }
                <div>
                    <label htmlFor='search'>Search: </label>
                    <input type='text' id='search' 
                        onChange={handleSearchInput} 
                        />
                </div>
                {
                    <div style={{visibility: (pagesCount === 0 || searchInput?.length > 0 ? "hidden" : "visible")}}>
                    <p>Page : </p>
                    <ArrowLeft className='icon' sx={{ color: (currentPage === 1 ? "var(--color-gray)" : "black") }}
                        onClick={() => {
                            if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                                refetchInvitedList();
                            }
                        }} />
                    <p>{currentPage} of {pagesCount}</p>
                    <ArrowRight className='icon' sx={{ color: ( currentPage === pagesCount ? "var(--color-gray)" : "black") }}
                        onClick={() => {
                            if (pagesCount && currentPage < pagesCount) {
                                setCurrentPage(currentPage + 1);
                                refetchInvitedList();
                            }
                        }
                        }
                    />
                </div>
                }
            </header>

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
                    {searchInput?.length === 0 ?
                        data?.getGroupInvitedList?.length > 0 ? data?.getGroupInvitedList?.map((invite: GroupInviteProps) => (
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
                        )) : <tr><td colSpan={5}><DataNotFound /></td></tr>
                        :
                        searchedResult ?
                        <tr key={searchedResult?.invite_id}>
                            <td><input type="checkbox" name="" id="" value={searchedResult?.invite_id} onChange={handleCheckBoxChange} /></td>
                            <td>{searchedResult?.email}</td>
                            <td>{dateformat({ timestamp: searchedResult?.invited_at })}</td>
                            <td>{searchedResult?.registered_user ? "Registered" : "Not Registered"}</td>
                            <td className='invite_status'
                                style={
                                    { color: (searchedResult?.invite_status === 'rejected' ? "var(--color-red)" : "var(--color-blue)") }}>
                                {searchedResult?.invite_status}
                            </td>
                        </tr> : <tr><td colSpan={5}><DataNotFound/></td></tr>
                    }
                </tbody>
            </table>
            {/* <footer className='actions'>
                    <p>Page: </p>
            </footer> */}
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