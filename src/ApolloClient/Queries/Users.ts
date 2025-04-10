import { gql } from "@apollo/client";


export const GetCurrentUser = gql`
    query Get{
        getCurrentUser{
            user_id
            name,
            email,
            password
        }
    }
`
