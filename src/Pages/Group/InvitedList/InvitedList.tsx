import { useState } from 'react';
import './InvitedList.scss';
import ButtonField from '../../../Components/ButtonField/ButtonField';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { useLocation } from 'react-router-dom';
import { GetInvitedlist } from '../../../ApolloClient/Queries/GroupRequests';
import { dateformat } from '../../../Schema/StringFunctions/StringFuctions';

interface InvitedListProps{
  invitedList: [GroupRequestProps]
}

interface GroupRequestProps {
    request_id: string,
    email :string,
    user_registered: boolean,
    requested_at: string,
    status: string
}

export const InvitedList = ({invitedList}: InvitedListProps) => {
    
    return (
        <div className="group-members">
            {invitedList?.length > 0 ?
                <table>
                    <tr>
                        <th>Email</th>
                        <th>Requested at</th>
                        <th>Registered</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                    {invitedList?.map((request: GroupRequestProps) => (
                        <tr>
                            <td>{request?.email}</td>
                            <td>{dateformat({date: request?.requested_at})}</td>
                            <td>{request?.user_registered ? "Registered" : "Not Registered" }</td>
                            <td className='capitalized'>{request?.status}</td>
                            <td>
                                <span >
                                    <ButtonField type={'button'} text={'Resend'} className='darkblue_button'/>
                                </span>
                            </td>   
                            <td>
                                <span>
                                    <ButtonField type={'button'} text={'Delete'} className='red_button'/>
                                </span>
                            </td>   
                        </tr>
                    ))}

                </table>
            : <p>No Invite Sent</p>}

        </div >
    )
}