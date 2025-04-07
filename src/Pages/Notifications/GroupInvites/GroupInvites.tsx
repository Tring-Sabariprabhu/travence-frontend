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
import './GroupInvites.scss';
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage"


export const GroupInvites = () => {

    const user = useSelector((state: RootState) => state.user);

    const [acceptInvite] = useMutation(AcceptGroupInvite);
    const [acceptDisableState, setAcceptDisableState] = useState<boolean>(false);

    const [rejectInvite] = useMutation(RejectGroupInvite);
    const [rejectDisableState, setRejectDisableState] = useState<boolean>(false);

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
    const afterClickReject = async (invite: GroupInviteProps) => {
        setRejectDisableState(true);
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
        setRejectDisableState(false);
    }
    return (
        (groupInvites?.getGroupInvites?.length > 0 ?
            <div className="group-invite-container">
               
                        {groupInvites?.getGroupInvites?.map((invite: GroupInviteProps, index: number) => (
                               <div className="invite">                                
                                    <h4>
                                        You have Invited by 
                                        <span>{invite?.invited_by?.user?.name}</span> 
                                        to Join their Group 
                                        <span>{invite?.invited_by?.group?.group_name}</span>
                                    </h4>
                                    <div className="buttons">
                                    <ButtonField
                                        type={"button"}
                                        text={"Accept"}
                                        className={"button_style green_button"}
                                        onClick={() => afterClickAccept(invite)}
                                        disabledState={acceptDisableState} />
                                
                                
                                    <ButtonField
                                        type={"button"}
                                        text={"Reject"}
                                        className={"button_style red_button"}
                                        onClick={() => afterClickReject(invite)}
                                        disabledState={rejectDisableState} />
                                    </div>
                                    
                                
                            </div>
                        ))}
                    
            </div> : <DataNotFound />)
    )
}
