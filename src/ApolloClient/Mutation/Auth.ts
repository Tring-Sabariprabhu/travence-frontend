import { gql } from "@apollo/client";

export const Signin_user = gql`
    mutation Check($input: SigninInput!){
        signin(input: $input){
            token
        }
    }
`
export const Signup_user = gql`
    mutation Post($input: SignupInput!){
        signup(input: $input)
    }`