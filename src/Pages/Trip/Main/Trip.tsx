
import '../../Group/GroupDetails/GroupMembers/GroupMembers.scss';
import './Trip.scss';
import { ExpenseTable } from '../ExpensesTable/ExpenseTable';
import { Header } from '../../../Components/Header/header';
import { useState } from 'react';
import { TripDetails } from '../TripDetails/TripDetails';
import { TripMembers } from '../TripMembers/TripMembers';
import { Activities } from '../TripActivities/TripActivities';
import { Checklists } from '../TripChecklists/TripChecklists';
import { useLocation, useNavigate } from 'react-router-dom';
import { TripMemberDetails } from '../../../ApolloClient/Queries/Trips';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { useQuery } from '@apollo/client';
import { setUser } from '../../../Redux/userSlice';
import { makeToast } from '../../../Components/Toast/makeToast';



export interface TripMemberProps {
    trip_member_id: string
    group_member: {
        member_id: string
        user: {
            name: string
            email: string
            user_id: string
        }
    }
}


export const Trip = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const trip_id = location?.state?.trip_id;
    const user = useSelector((state: RootState)=>state?.user);
    
    useQuery(TripMemberDetails,
            {
                variables: {
                    input: {
                        group_member_id: user?.current_group_member_id,
                        trip_id: trip_id
                    }
                },
                onCompleted:(data)=>{
                    const {tripMember} = data;
                    dispatch(setUser({...user, trip_id: trip_id,
                        current_trip_member_id: tripMember?.trip_member_id
                    }))
                    console.log("Trip id --> "+trip_id);
                    console.log("trip_member_id --> "+tripMember?.trip_member_id);
                },
                onError:(err)=>{
                    if(err?.message?.includes("Trip Member not found"))
                        makeToast({message: "You are not in This Trip", toastType: "info"});
                    navigate(-1);
                }
            }
        )
    return (
        <div className="trip-page-container">
            <TripDetails/>
            <TripMembers/>
            <Activities/>
            <Checklists/>
            <ExpenseTable/>
        </div>
        
    );
}