import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import CustomDialog from "../../../Components/CustomDialog/CustomDialog"
import InputField from "../../../Components/FormFields/InputField/InputField"
import ButtonField from "../../../Components/ButtonField/ButtonField"
import { FormProvider, useForm } from "react-hook-form"
import './ExpenseRemainder.scss';
import { useEffect, useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup';
import { ErrorText } from "../../../Components/ErrorText/ErrorText"
import { useMutation, useQuery } from "@apollo/client"
import { CreateExpenses } from "../../../ApolloClient/Mutation/Expenses"
import { useLocation } from "react-router-dom"
import { makeToast } from "../../../Components/Toast/makeToast"
import { TripMemberDetails, TripMembersDetails } from "../../../ApolloClient/Queries/Trips"
import { TripMemberProps } from "../Main/Trip"
import { Loader } from "../../../Components/Loader/Loader"
import { Info } from "@mui/icons-material"

interface ExpenseRemainderProps {
    open: boolean
    onClose: () => void
}
interface FormValues {
    expense: number
    selected_members: string[]
    paidBy: string
}
export const ExpenseRemainder = ({ open, onClose }: ExpenseRemainderProps) => {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const trip_id = location?.state?.trip_id;
    const member_id = location?.state?.member_id;
    const { data: tripMembersData, loading } = useQuery(TripMembersDetails,
        {
            variables: {
                input: {
                    trip_id: trip_id
                },
            },
            onError: (err) => {
                makeToast({ message: err?.message, toastType: "error" });
            }
        }
    )
    const { data: tripmemberdata } = useQuery(TripMemberDetails,
        {
            variables: {
                input: {
                    group_member_id: member_id,
                    trip_id: trip_id
                }
            },
        },
    )
    const schema = yup
        .object()
        .shape({
            expense: yup.number().positive().required("Expense is required"),
            selected_members: yup
                .array()
                .of(yup.string().required("Members are required"))
                .required("Members are required")
                .min(1, "Atleast select 1 member"),
            paidBy: yup.string().required("Paid by field is required"),
        })
    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
    });
    const { handleSubmit, setValue, formState: { errors }, clearErrors } = methods;

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [createExpsenses] = useMutation(CreateExpenses);

    const SelectPaidBy = (event: SelectChangeEvent) => {
        setValue("paidBy", event?.target?.value);
    }
    const SelectMembers = (event: SelectChangeEvent<typeof selectedMembers>) => {
        setValue("selected_members", event?.target?.value as string[]);
        setSelectedMembers(event?.target?.value as string[]);
    }

    const onSubmit = async (formdata: FormValues) => {
        const expenses = selectedMembers.map((member_id: string) => (
            {
                amount: formdata?.expense,
                toPay: member_id,
                paidBy: formdata?.paidBy
            }
        ));

        await createExpsenses({
            variables: {
                input: {
                    trip_id: trip_id,
                    created_by: tripmemberdata?.tripMember?.trip_member_id,
                    expenses: expenses
                }
            },
            onCompleted: (data) => {
                makeToast({ message: data?.createExpenses, toastType: "success" });
                handleClose();
            },
            onError: (err) => {
                makeToast({ message: err?.message, toastType: "error" });
            }
        })
    }
    const handleClose = () => {
        setValue("expense", 0);
        setValue("paidBy", "");
        setValue("selected_members", []);
        setSelectedMembers([]);
        clearErrors();
        onClose();
    }
    if (loading) {
        return <Loader />;
    }
    return (
        <CustomDialog open={open} onClose={handleClose} dialog_title={"Expense Remainder"}>
            <FormProvider {...methods}>
                <form className="expense-remainder-container"
                    onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-container">
                        <InputField type={"text"} label={"Expense"} name={"expense"} />
                        <div>
                            <label>Paid by</label>
                            <Select className="select" onChange={SelectPaidBy} >
                                {
                                    tripMembersData?.trip?.trip_members?.map((trip_member: TripMemberProps) => (
                                        <MenuItem key={trip_member?.trip_member_id}
                                            value={trip_member?.trip_member_id}>{trip_member?.group_member?.user?.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </div>

                    </div>
                    {errors?.expense?.message
                        &&
                        <ErrorText message={errors?.expense?.message} />}
                    {errors?.paidBy?.message
                        &&
                        <ErrorText message={errors?.paidBy?.message} />}
                    <div>
                        <label>Paid for</label>
                        <Select className="select" multiple value={selectedMembers} onChange={SelectMembers}>
                            {
                                tripMembersData?.trip?.trip_members?.map((trip_member: TripMemberProps) => (
                                    <MenuItem key={trip_member?.trip_member_id}
                                        value={trip_member?.trip_member_id}>{trip_member?.group_member?.user?.name}</MenuItem>
                                ))
                            }
                        </Select>
                        {errors?.selected_members?.message
                            &&
                            <ErrorText message={errors?.selected_members?.message} />}
                    </div>
                    <div className="Buttons">
                        <div className="note"><Info className="icon" /><p>Note : You can Select multiple members to send remainders</p></div>
                        <ButtonField
                            type={"submit"} text={"Send"} className="green_button" />
                    </div>
                </form>
            </FormProvider>
        </CustomDialog>
    )
}