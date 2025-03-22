import { useMutation, useQuery } from "@apollo/client"
import { useSelector } from "react-redux"

import ButtonField from "../../../Components/ButtonField/ButtonField"
import { RootState } from "../../../Redux/store"
import { dateformat } from "../../../Schema/StringFunctions/StringFuctions"
import { GetGroupJoinRequests } from "../../../ApolloClient/Queries/GroupRequests"
import './GroupRequests.scss';
import { AcceptGroupJoinRequest, DeclineGroupJoinRequest } from "../../../ApolloClient/Mutation/GroupRequests"
import { makeToast } from "../../../Components/Toast/makeToast"
interface GroupRequestsDataProps {
    request_id: string
    group_name: string
    requested_at: string
    requested_by: string
    admin_name: string
}

export const GroupRequests = () => {
    const user = useSelector((state: RootState) => state.user);
    const { data: requests, loading, refetch: refetchRequests } = useQuery(GetGroupJoinRequests,
        { variables: { email: user?.email }, fetchPolicy: "network-only" });

    const [acceptRequest] = useMutation(AcceptGroupJoinRequest);
    const [declineRequest] = useMutation(DeclineGroupJoinRequest);
    if (loading) {
        return <p>Loading</p>;
    }

    const afterClickDecline = async (request: GroupRequestsDataProps) => {
       await declineRequest({variables: {request_id: request?.request_id},
            onCompleted:(data)=>{
                makeToast({message: data?.declineGroupJoinRequest, toastType: "success"});
                refetchRequests();
            },
            onError:(err)=>{
                makeToast({message: err?.message, toastType: "error"});
            }})

    }
    const afterClickAccept = async (request: GroupRequestsDataProps) => {
        console.log(request?.requested_by);
       await acceptRequest({variables: {request_id: request?.request_id, admin_id: request?.requested_by, user_id: user?.user_id},
            onCompleted:(data)=>{
                makeToast({message: data?.acceptGroupJoinRequest, toastType: "success"});
                refetchRequests();
            },
            onError: (err)=>{
                makeToast({message: err.message, toastType: "error"});
            }})
    }
    return (
        <div className="group-requests">
            <table>
                <tbody>
                    {requests?.getGroupJoinRequestsForUser?.length > 0 && requests?.getGroupJoinRequestsForUser?.map((request: GroupRequestsDataProps, index: number) => (

                        <tr key={index}>
                            <td>
                                <div>
                                    <h3>Group name</h3>
                                    <p>{request?.group_name}</p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <h3>Requested by</h3>
                                    <p>{request?.admin_name}</p>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <h3>Requested at</h3>
                                    <p>{dateformat({ date: request?.requested_at })}</p>
                                </div>
                            </td>
                            <td>
                                {<ButtonField 
                                    type={"button"} 
                                    text={"Accept"} 
                                    className={"button_style green_button"}
                                    onClick={()=>afterClickAccept(request)} />}
                            </td>
                            <td>
                                {<ButtonField 
                                    type={"button"}
                                    text={"Decline"}
                                    className={"button_style red_button"}
                                    onClick={()=>afterClickDecline(request)} />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {requests?.getGroupJoinRequestsForUser?.length === 0 && <p>No Group Requests found</p>}

        </div>
    )
}
