import { gql } from "@apollo/client";


export const GetCurrentUser = gql`
    query Get($token: String!){
        getCurrentUser(token: $token){
            user_id
            name,
            email,
            password
        }
    }
`