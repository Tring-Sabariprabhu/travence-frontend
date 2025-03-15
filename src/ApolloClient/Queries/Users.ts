import { gql } from "@apollo/client";


export const UserDetails = gql`
    query Get($user_id: String){
        getUser(user_id: $user_id){
        user_id
        name,
        email
    }
    }
`