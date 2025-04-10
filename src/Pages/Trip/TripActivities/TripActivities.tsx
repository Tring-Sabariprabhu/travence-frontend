import { useQuery } from "@apollo/client"
import { TripActivities } from "../../../ApolloClient/Queries/Trips"
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

export const Activities = () => {
    const user = useSelector((state: RootState)=> state?.user);
    const { data: tripdata } = useQuery(TripActivities, {
        variables: {
            input: {
                trip_id: user?.trip_id,
            }
        },
        skip: !user?.trip_id
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