import ButtonField from '../../../../Components/ButtonField/ButtonField';
import '../../../GroupList/GroupList.scss';
import './TripList.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataNotFound } from '../../../../Components/DataNotFound/DataNotFound';
import { useQuery } from '@apollo/client';
import { JoinedTrips } from '../../../../ApolloClient/Queries/Trips';
interface Trip_Props {
    trip_id: string
    trip_name: string
    trip_description: string
    trip_status: string
    trip_days_count: string
    trip_start_date: string
    created_by: {
        member_id: string
        user:{
            name: string
            email: string
        }
    }
    trip_members: {
        trip_member_id: string
        group_member: {
            member_id: string
            user: {
                name: string
                email: string
            }
        }
    }
    trip_checklists: string[]
    trip_activities: {
        activity: string
        budget: string
    }
}
export const TripList = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const group_id = location?.state?.group_id;
    const member_id = location?.state?.member_id;

    const { data: tripdata } = useQuery(JoinedTrips,
        {
            variables: {
                input: {
                    member_id: member_id
                }
            },
            onCompleted: () => {
                console.log(tripdata?.joinedTrips);
            },
            onError: (err) => {
                console.log(err?.message);
            }
        })

    return (
        <div className="grouplist-container triplist-container">
            <div className="triplist-header">
                <div>
                    <p>Filter trips</p>
                    <select name="" id="">
                        <option value="">All</option>
                        <option value="">Completed</option>
                        <option value="">Upcoming</option>
                    </select>
                </div>
                <ButtonField type={'button'}
                    text={'Plan Trip'}
                    className={'blue_button'}
                    onClick={() => navigate('/group/plan-trip',
                        {
                            state: {
                                group_id: group_id,
                                member_id: member_id
                            }
                        }
                    )} />
            </div>
            <main>
                {
                    tripdata?.joinedTrips ?
                    tripdata?.joinedTrips?.map((trip: Trip_Props, index: number)=> (
                        <div className="group">
                            <p className='trip_status'
                                    style={{color: `var(${(trip?.trip_status === "upcoming" ? "--color-blue" : "--color-green")})`}}>{trip?.trip_status}</p>
                            <div className='group-data'>
                                <div>
                                <h3>Trip name</h3>
                                <p>{trip?.trip_name}</p>
                                </div>
                                <div>
                                <h3>Planned by</h3>
                                <p>{trip?.created_by?.user?.name}</p>
                                </div>
                                
                            </div>
                        </div>
                    )): <DataNotFound message={"Trips"} />
                }
            </main>
        </div>
    );
}