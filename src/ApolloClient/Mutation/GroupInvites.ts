import { gql } from "@apollo/client";

export const SendGroupInvites = gql`
    mutation send($input: CreateGroupInviteInput!){
        createGroupInvites(input: $input)
    }`

export const ResendGroupInvites = gql`
    mutation resend($input: ResendGroupInvitesInput!){
        resendGroupInvites(input: $input)
    }`

export const DeleteGroupInvites = gql`
    mutation delete($input: DeleteGroupInvitesInput!){
        deleteGroupInvites(input: $input)
    }`
export const AcceptGroupInvite = gql`
    mutation accept($input: AcceptGroupInviteInput!){
        acceptGroupInvite(input: $input)
    }`

export const RejectGroupInvite = gql`
    mutation reject($input: RejectGroupInviteInput!){
        rejectGroupInvite(input: $input)
    }`