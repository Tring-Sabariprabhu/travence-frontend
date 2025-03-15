import { useMutation, useQuery } from "@apollo/client"
import { useSelector } from "react-redux"

import ButtonField from "../../../Components/ButtonField/ButtonField"
import { makeToast } from "../../../Components/Toast/makeToast"
import { RootState } from "../../../Redux/store"
import { dateformat } from "../../../Schema/StringFunctions/StringFuctions"

interface GroupRequestsDataProps {
    group_id: number
    group_name: string
    requested_at: string
    requested_email: string
}

export const GroupRequests = () => {
    const user = useSelector((state: RootState) => state.user);
    // const { data: requests, loading, refetch: refetchRequests } = useQuery(Get_UserGroupRequests, { variables: { email: user?.email }, fetchPolicy: "network-only" });
    // const [acceptRequest] = useMutation(AcceptGroupJoinRequest);
    // const [deleteRequest] = useMutation(Delete_GroupJoinRequest);
    // if (loading) {
    //     return <p>Loading</p>;
    // }
    const afterClickDecline = async (request: GroupRequestsDataProps) => {
        // const { data: declineRequestData, errors: declineError } = await deleteRequest(
        //     { variables: { email: user?.email, group_id: request?.group_id, requested_email: request?.requested_email } }
        // );
        // if (declineError) {
        //     makeToast({ message: "Error at Server", toastType: "error" });
        // }
        // else if (declineRequestData.deleteGroupJoinRequests === true) {
        //     makeToast({ message: `Requests made by ${request.requested_email} Declined `, toastType: "success" , closeTime: 3000});
        //     refetchRequests();
        // }
        // else {
        //     makeToast({ message: "Query Error", toastType: "error" });
        // }

    }
    const afterClickAccept = async (request: GroupRequestsDataProps)=>{
        // const {data: acceptRequestData, errors: acceptRequestError} = await acceptRequest({ variables: { email: user?.email, group_id: request?.group_id, role: "member"} });
        // if(acceptRequestError){
        //     makeToast({message: "Error at Server", toastType: "error"});
        // }
        // else if(acceptRequestData.acceptGroupJoinRequest === true){
        //     makeToast({message: "Successfully Joined", toastType: "success"});
        //     refetchRequests();
        // }
        // else{
        //     makeToast({message: "Query Error", toastType: "error"});
        // }
        // // console.log(user.email, request.group_id)
    }
    return (
        <div className="group-requests">
            <table>
                {/* {requests?.getGroupRequests?.length > 0 && requests?.getGroupRequests?.map((request: GroupRequestsDataProps, index: number) => (
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
                                <p>{request?.requested_email}</p>
                            </div>
                        </td>
                        <td>
                            <div>
                                <h3>Requested at</h3>
                                <p>{dateformat({ date: request?.requested_at })}</p>
                            </div>
                        </td>
                        <td>
                            <span onClick={() => afterClickAccept(request)}>
                                {<ButtonField type={"button"} text={"Accept"} className={"button_style green_button"} />}
                            </span>
                        </td>
                        <td>
                            <span onClick={() => afterClickDecline(request)}>
                                {<ButtonField type={"button"} text={"Decline"} className={"button_style red_button"} />}
                            </span>
                        </td>
                    </tr>
                ))} */}

            </table>
            {/* {requests.getGroupRequests.length === 0 && <p>No Group Requests found</p>} */}

        </div>
    )
}
