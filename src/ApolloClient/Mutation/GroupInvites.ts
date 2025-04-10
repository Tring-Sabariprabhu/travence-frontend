import { gql } from "@apollo/client";

export const SendGroupInvites = gql`
    mutation send($input: CreateGroupInviteInput!){
        createGroupInvites(input: $input)
    }`

export const ResendGroupInvites = gql`
    mutation resend($input: ResendAndDeleteGroupInvitesInput!){
        resendGroupInvites(input: $input)
    }
`

export const DeleteGroupInvites = gql`
    mutation delete($input: ResendAndDeleteGroupInvitesInput!){
        deleteGroupInvites(input: $input)
    }
`
export const AcceptGroupInvite = gql`
    mutation accept($input: GroupInviteActionsInput!){
        acceptGroupInvite(input: $input)
    }
`

export const RejectGroupInvite = gql`
    mutation reject($input: GroupInviteActionsInput!){
        rejectGroupInvite(input: $input)
    }
`
