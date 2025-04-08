import { useQuery } from '@apollo/client';
import '../../Group/GroupDetails/InvitedList/InvitedList.scss'
import { ExpenseDetails } from '../../../ApolloClient/Queries/Trips';
import { useLocation } from 'react-router-dom';
interface Expense{
    amount: number
    paidBy: {
        group_member:{
            user:{
                name: string
            }
        }
    }
    toPay:{
        group_member:{
            user:{
                name: string
            }
        }
    }
}
export const ExpenseTable=()=>{
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const member_id = location?.state?.member_id;
    const trip_id = location?.state?.trip_id;
     const {data: tripdata} = useQuery(ExpenseDetails, {
            variables: {
                input: {
                    trip_id: trip_id
                }
            },
            skip: !trip_id
        })
    return (
        <div className="expense-table-container invited-list-container">            
            <table>
                <tr>
                    <th>Amount</th>
                    <th>Paid by</th>
                    <th>Paid for</th>
                </tr>
                {
                    tripdata?.trip?.expense_remainders?.map((expense: Expense, index: number)=>(
                        <tr>
                            <td>{expense?.amount}</td>
                            <td>{expense?.paidBy?.group_member?.user?.name}</td>
                            <td>{expense?.toPay?.group_member?.user?.name}</td>
                        </tr>
                    ))
                }
            </table>
        </div>
    )
}