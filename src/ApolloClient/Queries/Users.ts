import { gql } from "@apollo/client";


export const GetCurrentUser = gql`
    query Get{
        getAuthUser{
            user_id
            name,
            email,
            image,
            password
        }
    }
`