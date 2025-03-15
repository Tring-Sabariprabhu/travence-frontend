import { useState } from 'react';
import './InvitedList.scss';
import ButtonField from '../../../Components/ButtonField/ButtonField';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { useLocation } from 'react-router-dom';

import { capitalizeName, dateformat } from '../../../Schema/StringFunctions/StringFuctions';
interface GroupRequestProps {
    email :string,
    requested_at: string,
    status: string

}
export const InvitedList = () => {
    const location = useLocation();
    const user = useSelector((state: RootState) => state.user);
    const group_id = location?.state?.index;
    // const { data: invitedList } = useQuery(Get_RequestsMadeByLeader, { variables: { group_id: group_id, email: user?.email }, fetchPolicy: "network-only" });

    return (
        <div className="invited-list">
            {/* {invitedList?.getRequestsMadeByLeader?.length > 0 ?
                <table>
                    <tr>
                        <th>Email</th>
                        <th>Requested at</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                    {invitedList?.getRequestsMadeByLeader.map((request: GroupRequestProps) => (
                        <tr>
                            <td>{request?.email}</td>
                            <td>{dateformat({date: request?.requested_at})}</td>
                            <td>{capitalizeName({name: request?.status})}</td>
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
            : <p>No Invite Sent</p>} */}

        </div >
    )
}