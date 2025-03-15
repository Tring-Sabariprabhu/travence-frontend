import { gql } from "@apollo/client";

export const Signin_user = gql`
    mutation Check($email: String!, $password: String!){
        signin(email: $email, password: $password){
            token,
            user_id
        }
    }
`
export const Signup_user = gql`
    mutation Post($email: String!, $name: String!, $password: String!){
        signup(email: $email, name: $name, password: $password){
            token,
            user_id
        }
    }`