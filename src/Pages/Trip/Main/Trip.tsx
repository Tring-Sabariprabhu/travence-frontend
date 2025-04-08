
import '../../Group/GroupDetails/GroupMembers/GroupMembers.scss';
import { Activities } from '../TripActivities/TripActivities';
import { Checklists } from '../TripChecklists/TripChecklists';
import { TripDetails } from '../TripDetails/TripDetails';
import { TripMembers } from '../TripMembers/TripMembers';
import './Trip.scss';



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

    return (
        <div className="trip-page-container">
                <TripDetails />
                <TripMembers />
                <Checklists/>
                <Activities/>
        </div>
    );
}