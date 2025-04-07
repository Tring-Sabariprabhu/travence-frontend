import { useQuery } from "@apollo/client"
import { TripActivities } from "../../../ApolloClient/Queries/Trips"
import { useLocation } from "react-router-dom"

export const Activities = () => {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const member_id = location?.state?.member_id;
    const trip_id = location?.state?.trip_id;

    const { data: tripdata } = useQuery(TripActivities, {
        variables: {
            input: {
                trip_id: trip_id,
                member_id: member_id
            }
        }
    })
    return (
        <main className="trip-activities">
            <h4>Trip Actvities</h4>
            <ol>{
                tripdata?.trip?.trip_activities?.map((item: any, index: number) => (
                    <li key={index}>
                        <p>{item?.activity}</p>
                        <p>{item?.budget}</p>
                    </li>
                ))}
            </ol>
        </main>
    )
}