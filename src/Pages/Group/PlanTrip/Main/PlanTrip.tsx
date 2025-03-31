import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
// import ButtonField from "../../../../Components/ButtonField/ButtonField";
import { InviteMembers } from "../InviteMembers/InviteMembers";
import { TripDetails } from "../TripDetails.tsx/TripDetails";
import './PlanTrip.scss';
import { ToDo } from "../ToDo/ToDo";
import { CheckLists } from "../CheckLists/CheckLists";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import { useNavigate } from "react-router-dom";
export const PlanTrip=()=>{

    const navigate = useNavigate();
    const methods = useForm();

  const {
    handleSubmit } = methods;

    const onSubmit=()=>{
        
    }
    return (
        <div className="plan-trip-container">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Plan Trip</h2>
                        <TripDetails/>
                        <InviteMembers/>
                        <ToDo/>
                        <CheckLists/>
                        <div className="Buttons">
                            <ButtonField type={"button"} 
                                text={"Save"} 
                                className={"blue_button"}/>
                            <ButtonField type={"button"} 
                                text={"Cancel"} 
                                onClick={()=> navigate(-1)}/>
                        </div>
                </form>
            </FormProvider>
        </div>
    )
}