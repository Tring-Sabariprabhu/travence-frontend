import { gql } from "@apollo/client";

export const SendGroupJoinRequests = gql`
    mutation send($admin_id: String!, $emails: [String!]!){
        sendGroupJoinRequests(admin_id: $admin_id, emails: $emails)
    }`

export const ResendGroupJoinRequests = gql`
    mutation resend($admin_id: String!, $requestIDs: [String!]!){
        resendGroupJoinRequests(admin_id: $admin_id, requestIDs: $requestIDs)
    }`

export const DeleteGroupJoinRequests = gql`
    mutation delete($admin_id: String!, $requestIDs: [String!]!){
        deleteGroupJoinRequests(admin_id: $admin_id, requestIDs: $requestIDs)
    }`
export const AcceptGroupJoinRequest = gql`
    mutation accept( $admin_id: String!, $user_id: String!){
        acceptGroupJoinRequest( admin_id: $admin_id, user_id: $user_id)
    }`

export const DeclineGroupJoinRequest = gql`
    mutation decline($request_id: String!){
        declineGroupJoinRequest(request_id: $request_id)
    }`