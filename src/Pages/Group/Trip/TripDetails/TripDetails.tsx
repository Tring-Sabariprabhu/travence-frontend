import { useQuery } from "@apollo/client";
import { ErrorPage } from "../../../../Components/ErrorPage/ErrorPage";
import { Loader } from "../../../../Components/Loader/Loader";
import { useLocation } from "react-router-dom";
import { TripData } from "../../../../ApolloClient/Queries/Trips";
import { dateformat } from "../../../../Schema/StringFunctions/StringFuctions";

export const TripDetails =()=> {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const trip_id = location?.state?.trip_id;
    const member_id = location?.state?.member_id;

    const { data: tripdata, loading, error } = useQuery(TripData,
        {
            variables: {
                input: {
                    member_id: member_id,
                    trip_id: trip_id
                }
            }
        });
    if (loading) {
        return <Loader />;
    } else if (error) {
        return <ErrorPage />;
    }
    return (
        <div className="trip-details-container">
            <div>
                <h4 className="name">Trip name : {tripdata?.trip?.trip_name}</h4>
                <h4>Trip description : {tripdata?.trip?.trip_description}</h4>
                <h4>Trip Budget: {tripdata?.trip?.trip_budget}</h4>
                <h4 className="name">Trip status : {tripdata?.trip?.trip_status}</h4>
                <h4>Trip start date : {dateformat({date: tripdata?.trip?.trip_start_date})}</h4>
                <h4>Trip days count : {tripdata?.trip?.trip_days_count}</h4>
                <h4>Trip Checklists : </h4>
                {
                    tripdata?.trip?.trip_checklists.map((item: string)=> 
                        <h5>{item}</h5>
                    )
                }
                <h4>Trip Actvities</h4>
                {
                    tripdata?.trip?.trip_activities.map((item : any, index: number)=> (
                        <div>
                            <h5>{item?.activity}</h5>
                            <h5>{item?.budget}</h5>
                        </div>
                    ))
                }
            </div>
            
        </div>
    )
}