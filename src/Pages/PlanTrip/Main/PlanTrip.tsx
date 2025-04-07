import { useForm, FormProvider } from "react-hook-form";
import './PlanTrip.scss';
import { CheckLists } from "../CheckLists/CheckLists";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import { useLocation, useNavigate } from "react-router-dom";
import { Activities } from "../Activities/Activities";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AddMembers } from "../AddMembers/AddMembers";
import { TripDetails } from "../TripDetails/TripDetails";
import { useMutation, useQuery } from "@apollo/client";
import { CreateTrip, UpdateTrip } from "../../../ApolloClient/Mutation/Trips";
import { makeToast } from "../../../Components/Toast/makeToast";
import { Loader } from "../../../Components/Loader/Loader";
import { ErrorPage } from "../../../Components/ErrorPage/ErrorPage";
import { FullTripDetails } from "../../../ApolloClient/Queries/Trips";
import { useEffect } from "react";


interface Activity {
    activity: string
    budget: number
}
export interface PlanTripFormValues {
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
    const member_id = location?.state?.member_id;
    const trip_id = location?.state?.trip_id;

    const navigate = useNavigate();
    const schema = yup
        .object()
        .shape({
            trip_name: yup.string().required("Trip name required"),
            trip_description: yup.string().required("Trip decription required"),
            trip_start_date: yup.date().required("Trip start date required").min(new Date(), "Enter Valid date"),
            trip_days_count: yup.number().positive().required("Trip days count required"),
            trip_members: yup
                .array()
                .required()
                .of(yup.string().required())
                ,
            trip_activities: yup
                .array()
                .of(yup.object().shape({
                    activity: yup.string().required("Activity required"),
                    budget: yup.number().required("Budget required").positive()
                }))
                .required("Trip Activities are required")
                .min(2, "Trip Activities must have 2 items"),
            trip_checklists: yup
                .array()
                .of(yup.string().required("Checklist Item is required"))
                .required("Trip Checklists are required")
                .min(2, "Trip Checklists must have 2 items"),
        })
    const methods = useForm<PlanTripFormValues>({
        resolver: yupResolver(schema),
        defaultValues:{
            trip_members: []
        }
    });

    const { handleSubmit, setValue } = methods;
    const { data: tripdata, loading, error } = useQuery(FullTripDetails,
        {
            variables: {
                input: {
                    member_id: member_id,
                    trip_id: trip_id
                }
            }, skip: !trip_id
        });
    const [createTrip] = useMutation(CreateTrip);
    const [updateTrip] = useMutation(UpdateTrip);

    useEffect(() => {
        if (tripdata) {
            const { trip } = tripdata;
            const filtered_trip_activities = trip?.trip_activities.map((activity: any) => (
                {
                    activity: activity?.activity,
                    budget: activity?.budget
                }
            ))
            setValue("trip_name", trip?.trip_name);
            setValue("trip_description", trip?.trip_description);
            setValue("trip_days_count", trip?.trip_days_count);
            setValue("trip_start_date", trip?.trip_start_date?.slice(0, 10));
            setValue("trip_checklists", trip?.trip_checklists);
            setValue("trip_activities", filtered_trip_activities);
        }
    }, [tripdata]);

    if (loading) {
        return <Loader />;
    } else if (error) {
        return <ErrorPage />;
    }
    const onSubmit = async (formdata: PlanTripFormValues) => {
        let trip_budget = 0;
        for (const activity of formdata?.trip_activities) {
            trip_budget = trip_budget + activity?.budget;
        }
        if(!trip_id && !formdata?.trip_members?.includes(member_id)){
            formdata?.trip_members.push(member_id);
        }
        
        if (trip_id) {
            await updateTrip(
                {
                    variables: {
                        input: {
                            trip_id: trip_id,
                            group_member_id: member_id,
                            trip_name: formdata?.trip_name,
                            trip_description: formdata?.trip_description,
                            trip_start_date: new Date(formdata?.trip_start_date),
                            trip_days_count: formdata?.trip_days_count,
                            trip_budget: trip_budget,
                            trip_members: formdata?.trip_members,
                            trip_activities: formdata?.trip_activities,
                            trip_checklists: formdata?.trip_checklists,
                        }
                    },
                    onCompleted: (data) => {
                        makeToast({ message: data?.updateTrip, toastType: "success" });
                        navigate(-1);
                    },
                    onError: (err) => {
                        makeToast({ message: err?.message, toastType: "error" });
                    }
                },)
        } else {
            await createTrip(
                {
                    variables: {
                        input: {
                            group_member_id: member_id,
                            trip_name: formdata?.trip_name,
                            trip_description: formdata?.trip_description,
                            trip_start_date: formdata?.trip_start_date,
                            trip_days_count: formdata?.trip_days_count,
                            trip_budget: trip_budget,
                            trip_members: formdata?.trip_members,
                            trip_activities: formdata?.trip_activities,
                            trip_checklists: formdata?.trip_checklists,
                        }
                    },
                    onCompleted: (data) => {
                        makeToast({ message: data?.createTrip, toastType: "success" });
                        navigate(-1);
                    },
                    onError: (err) => {
                        makeToast({ message: err?.message, toastType: "error" });
                    }
                },)
        }

    }
    return (
        <div className="plan-trip-container">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>{trip_id ? "Edit Trip" : "Plan Trip"}</h2>
                    <TripDetails />
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