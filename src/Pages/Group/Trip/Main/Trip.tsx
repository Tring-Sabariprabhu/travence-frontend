import '../../GroupDetails/GroupMembers/GroupMembers.scss';
import { TripDetails } from '../TripDetails/TripDetails';
import { TripMembers } from '../TripMembers/TripMembers';
import './Trip.scss';


export interface TripMemberProps{
    trip_member_id: string
    group_member:{
        user:{
            name: string
            email: string
            user_id: string
        }
    }
}
export const Trip = () => {
    
    return (
        <div className="trip-page-container">
            <TripDetails/>
            <TripMembers/>
        </div>
    );
}