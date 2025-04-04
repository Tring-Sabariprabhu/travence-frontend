import { useForm, FormProvider } from "react-hook-form";
import './PlanTrip.scss';
import { CheckLists } from "../CheckLists/CheckLists";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import { useLocation, useNavigate } from "react-router-dom";
import { Activities } from "../Activities/Activities";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AddMembers } from "../AddMembers/AddMembers";
import { TripDetails } from "../TripDetails/TripDetails";
import { useMutation } from "@apollo/client";
import { CreateTrip } from "../../../../ApolloClient/Mutation/Trips";
import { makeToast } from "../../../../Components/Toast/makeToast";


interface Activity {
    activity: string
    budget: number
}
interface FormValues {
    trip_name: string;
    trip_description: string;
    trip_start_date: Date;
    trip_days_count: number;
    trip_members: string[];
    trip_activities: Activity[];
    trip_checklists: string[];
}
export const PlanTrip = () => {

    const location = useLocation();
    const group_id = location?.state?.group_id;
    const admin_id = location?.state?.admin_id;
    const navigate = useNavigate();
    const schema = yup
        .object()
        .shape({
            trip_name: yup.string().required("Trip name required"),
            trip_description: yup.string().required("Trip decription required"),
            trip_start_date: yup.date().required("Trip start date required"),
            trip_days_count: yup.number().positive().required("Trip days count required"),
            trip_members: yup
                .array()
                .of( yup.string().required())
                .required("Trip Members are required")
                .min(1),
            trip_activities: yup
                .array()
                .of( yup.object().shape({
                        activity: yup.string().required(),
                        budget: yup.number().positive().required("Budget required")
                    }))
                .required("Trip Activities are required")
                .min(2),
            trip_checklists: yup
                .array()
                .of( yup.string().required("Checklist Item is required"))
                .required("Trip Checklists are required")
                .min(2),
        })
    const methods = useForm<FormValues>({
        resolver: yupResolver(schema)
    });

    const { handleSubmit } = methods;
    const [createTrip] = useMutation(CreateTrip);
    const onSubmit = async (formdata: FormValues) => {
        console.log("Form submitted");
        console.log(admin_id)
        await createTrip(
            {
                variables: {
                    input: {
                        group_id: group_id,
                        admin_id: admin_id,
                        trip_name: formdata?.trip_name,
                        trip_description: formdata?.trip_description,
                        trip_start_date: formdata?.trip_start_date,
                        trip_days_count: formdata?.trip_days_count,
                        trip_members: formdata?.trip_members,
                        trip_activities: formdata?.trip_activities,
                        trip_checklists: formdata?.trip_checklists,
                    }
                },
                onCompleted: (data)=>{
                    makeToast({message: data?.createTrip, toastType: "success"});
                    navigate(-1);
                },
                onError:(err)=>{
                    makeToast({message: err?.message, toastType: "error"});
                }
            },)
    }
    return (
        <div className="plan-trip-container">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Plan Trip</h2>
                    <TripDetails/>
                    <AddMembers />
                    <Activities />
                    <CheckLists />
                    <div className="Buttons">
                        <ButtonField type={"submit"}
                            text={"Save"}
                            className={"blue_button"} />
                        <ButtonField type={"button"}
                            text={"Cancel"}
                            onClick={() => navigate(-1)} />
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}