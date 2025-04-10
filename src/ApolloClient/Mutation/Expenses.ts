import { gql } from "@apollo/client";

export const CreateExpenses = gql`
    mutation create($input: CreateExpensesInput!){
        createExpenses(input: $input)
    }
`
