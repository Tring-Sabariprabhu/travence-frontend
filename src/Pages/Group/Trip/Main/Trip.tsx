import { useLocation, useNavigate } from 'react-router-dom';
import '../../GroupDetails/GroupMembers/GroupMembers.scss';
import { TripDetails } from '../TripDetails/TripDetails';
import { TripMembers } from '../TripMembers/TripMembers';
import './Trip.scss';
import ButtonField from '../../../../Components/ButtonField/ButtonField';


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
    
    const location = useLocation();
    const navigate = useNavigate();
    const group_id = location?.state?.group_id;
    const trip_id = location?.state?.trip_id;
    const member_id = location?.state?.member_id;

    return (
        <div className="trip-page-container">
            <ButtonField type={'button'} 
                text={'Edit Trip details'}
                className='blue_button'
                onClick={()=> navigate('/group/plan-trip',
                    {
                        state: {
                            group_id: group_id,
                            member_id: member_id,
                            trip_id: trip_id
                        }
                    }
                )}/>
            <TripDetails/>
            <TripMembers/>
        </div>
    );
}