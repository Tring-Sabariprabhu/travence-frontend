import { gql } from "@apollo/client";

export const SendGroupRequests = gql`
    mutation send($admin_id: String!, $emails: [String!]!){
        sendGroupRequests(admin_id: $admin_id, emails: $emails)
    }`