import { useMutation, useQuery } from "@apollo/client"
import { useSelector } from "react-redux"

import ButtonField from "../../../Components/ButtonField/ButtonField"
import { RootState } from "../../../Redux/store"
import { dateformat } from "../../../Schema/StringFunctions/StringFuctions"
import { GetGroupInvites } from "../../../ApolloClient/Queries/GroupInvites"
import { AcceptGroupInvite, RejectGroupInvite } from "../../../ApolloClient/Mutation/GroupInvites"
import { makeToast } from "../../../Components/Toast/makeToast"
import { useState } from "react"
import { Loader } from "../../../Components/Loader/Loader"
import { DataNotFound } from "../../../Components/DataNotFound/DataNotFound";
import { GroupInviteProps } from "../../Group/GroupDetails/Main/GroupDetails"
import './GroupRequests.scss';
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage"


export const GroupRequests = () => {

    const user = useSelector((state: RootState) => state.user);

    const [acceptInvite] = useMutation(AcceptGroupInvite);
    const [acceptDisableState, setAcceptDisableState] = useState<boolean>(false);

    const [rejectInvite] = useMutation(RejectGroupInvite);
    const [declineDisableState, setDeclineDisableState] = useState<boolean>(false);

    const { data: groupInvites, loading, error, refetch: refetchRequests } = useQuery(GetGroupInvites,
        { variables: { input: {email: user?.email} }, fetchPolicy: "network-only" });
    
    if (loading) {
        return <Loader />;
    }
    if (error) {
        return <ErrorPage/>;
    }

    const afterClickAccept = async (invite: GroupInviteProps) => {
        setAcceptDisableState(true);
        await acceptInvite({
            variables: 
            { 
                input: {
                    invite_id: invite?.invite_id, 
                }
            },  
            onCompleted: (data) => {
                makeToast({ message: data?.acceptGroupInvite, toastType: "success" });
                refetchRequests();
            },
            onError: (err) => {
                makeToast({ message: err.message, toastType: "error" });
            }
        });
        setAcceptDisableState(false);
    }
    const afterClickDecline = async (invite: GroupInviteProps) => {
        setDeclineDisableState(true);
        await rejectInvite({
            variables: 
            { 
                input: {
                    invite_id: invite?.invite_id, 
                }
            },  
            onCompleted: (data) => {
                makeToast({ message: data?.rejectGroupInvite, toastType: "success" });
                refetchRequests();
            },
            onError: (err) => {
                makeToast({ message: err?.message, toastType: "error" });
            }
        });
        setDeclineDisableState(false);
    }
    return (
        (groupInvites?.getGroupInvites?.length > 0 ?
            <div className="group-requests">
                <table>
                    <tbody>
                        {groupInvites?.getGroupInvites?.map((invite: GroupInviteProps, index: number) => (

                            <tr key={index}>
                                <td>
                                    <div>
                                        <h3>Group name</h3>
                                        <p>{invite?.invited_by?.group?.group_name}</p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <h3>Requested by</h3>
                                        <p>{invite?.invited_by?.user?.name}</p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <h3>Requested at</h3>
                                        <p>{dateformat({ date: invite?.invited_at })}</p>
                                    </div>
                                </td>
                                <td>
                                    {<ButtonField
                                        type={"button"}
                                        text={"Accept"}
                                        className={"button_style green_button"}
                                        onClick={() => afterClickAccept(invite)}
                                        disabledState={acceptDisableState} />}
                                </td>
                                <td>
                                    {<ButtonField
                                        type={"button"}
                                        text={"Decline"}
                                        className={"button_style red_button"}
                                        onClick={() => afterClickDecline(invite)}
                                        disabledState={declineDisableState} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> : <DataNotFound message={"Group Requests"} />)
    )
}
