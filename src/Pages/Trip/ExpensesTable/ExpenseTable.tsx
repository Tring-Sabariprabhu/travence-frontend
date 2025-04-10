import { useQuery } from '@apollo/client';
import '../../Group/GroupDetails/InvitedList/InvitedList.scss'
import { ExpenseDetails } from '../../../ApolloClient/Queries/Trips';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
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
    const user = useSelector((state: RootState)=> state?.user);
     const {data: tripdata} = useQuery(ExpenseDetails, {
            variables: {
                input: {
                    trip_id: user?.trip_id
                }
            },
            skip: !user?.trip_id
        })
    return (
        <div className="expense-table-container invited-list-container">    
        {
            tripdata?.trip?.expense_remainders?.length > 0
            &&
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
        }        
            
        </div>
    )
}