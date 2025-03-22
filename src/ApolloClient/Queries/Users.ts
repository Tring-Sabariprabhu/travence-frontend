import { gql } from "@apollo/client";


export const UserDetails = gql`
    query Get{
        getAuthUser{
        user_id
        name,
        email,
        image
    }
    }
`