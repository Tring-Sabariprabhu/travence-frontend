import { gql, useMutation, useQuery } from "@apollo/client";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import { Loader } from "../../../Components/Loader/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { FullTripDetails, TripMemberDetails } from "../../../ApolloClient/Queries/Trips";
import { dateformat } from "../../../Schema/StringFunctions/StringFuctions";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import { useState } from "react";
import { Confirmation } from "../../../Components/Confirmation/Confirmation";
import { DeleteTripMember } from "../../../ApolloClient/Mutation/Trips";
import { makeToast } from "../../../Components/Toast/makeToast";
import { getTripStatusColor } from "../../TripList/Main/TripList";

export const TripDetails = () => {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const trip_id = location?.state?.trip_id;
    const member_id = location?.state?.member_id;
    const navigate = useNavigate();

    const [leaveTripConfirm, setLeaveTripConfirm] = useState<boolean>(false);
    const [leaveTripDisable, setLeaveTripDisable] = useState<boolean>(false);

    const { data: tripmemberdata } = useQuery(TripMemberDetails,
        {
            variables: {
                input: {
                    group_member_id: member_id
                }
            }
        }
    )
    const TripDetails = gql`
        query($input: TripInput!){
            trip(input: $input){
                trip_name,
                trip_description,
                trip_budget,
                trip_status,
                trip_days_count,
                trip_start_date,
                created_by{
                 
                        member_id
                    
                }
            }
        }
    `
    const { data: tripdata, loading, error } = useQuery(TripDetails,
        {
            variables: {
                input: {
                    member_id: member_id,
                    trip_id: trip_id
                }
            }
        });
    const [deleteTripMember] = useMutation(DeleteTripMember);
    const deleteTripMemberProcess = async () => {
        setLeaveTripDisable(true);
        setLeaveTripConfirm(false);
        await deleteTripMember({
            variables: {
                input: {
                    trip_member_id: tripmemberdata?.tripMember?.trip_member_id
                }
            },
            onCompleted: (data) => {
                makeToast({ message: data?.deleteTripMember, toastType: "success" });
            },
            onError: (err) => {
                makeToast({ message: err?.message, toastType: "error" });
            }
        })
        setLeaveTripDisable(false);
    }
    if (loading) {
        return <Loader />;
    } else if (error) {
        return <ErrorPage />;
    }
    return (
        <main className="trip-details-container">
            {
                tripdata?.trip?.created_by?.member_id !== member_id
                &&
                <ButtonField type={"button"}
                    text={"Leave"}
                    className="red_button"
                    disabledState={leaveTripDisable}
                    onClick={() => setLeaveTripConfirm(true)} />
            }
            <div className="item">
                <h4>Trip name : </h4><p className="name">{tripdata?.trip?.trip_name}</p>
            </div>
            <div>
                <h4>Trip budget: </h4><p>{tripdata?.trip?.trip_budget}</p>
            </div>
            <div>
                <h4>Trip status : </h4>
                    <p className="name"
                        style={{color:`var(${getTripStatusColor(tripdata?.trip?.trip_status)})`}}    >{tripdata?.trip?.trip_status}</p>
            </div>
            <div>
                <h4>Trip start date : </h4><p>{dateformat({ timestamp: tripdata?.trip?.trip_start_date })}</p>
            </div>
            <div>
                <h4>Trip days count : </h4><p>{tripdata?.trip?.trip_days_count}</p>
            </div>
            <div>
                <h4>Trip description : </h4><p>{tripdata?.trip?.trip_description}</p>
            </div>

            <Confirmation open={leaveTripConfirm}
                onClose={() => setLeaveTripConfirm(false)}
                title={`Do you want to leave from this Trip ${tripdata?.trip?.trip_name}`}
                confirmButtonText={"Confirm"}
                closeButtonText={"Cancel"}
                onSuccess={deleteTripMemberProcess} />
        </main>
    )
}