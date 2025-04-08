
import '../../Group/GroupDetails/GroupMembers/GroupMembers.scss';
import './Trip.scss';
import { ExpenseTable } from '../ExpensesTable/ExpenseTable';
import { Header } from '../../../Components/Header/header';
import { useState } from 'react';
import { TripDetails } from '../TripDetails/TripDetails';
import { TripMembers } from '../TripMembers/TripMembers';
import { Activities } from '../TripActivities/TripActivities';
import { Checklists } from '../TripChecklists/TripChecklists';



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
   
    const [bodyItem, setBodyItem] = useState<string>()
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