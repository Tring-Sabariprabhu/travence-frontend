import { FormProvider, useForm } from "react-hook-form";
import CustomDialog from "../../../../Components/CustomDialog/CustomDialog"
import './PlanTrip.scss';
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import { TripDetails } from "../TripDetails.tsx/TripDetails";
import { useEffect, useState } from "react";
import { InviteMembers } from "../InviteMembers/InviteMembers";
import { ToDo } from "../ToDo/ToDo";
import { CheckLists } from "../CheckLists/CheckLists";

interface PlanTripProps{
    openState: boolean,
    onClose: ()=> void,
}

export const PlanTrip=({openState, onClose}: PlanTripProps)=>{
    const methods = useForm();
    const [formPageIndex, setFormPageIndex] = useState<number>(1);
    
  const {
    handleSubmit,
    formState:{ errors } } = methods;

    const onSubmit=()=>{
        
    }
    return (
        <CustomDialog open={openState} onClose={onClose} dialog_title={"Plan Trip"} >
            <FormProvider {...methods}>
                <form className="plan-trip-form" onSubmit={handleSubmit(onSubmit)}>
                    {formPageIndex === 1 && <TripDetails/>}
                    {formPageIndex === 2 && <InviteMembers/>}
                    {/* {formPageIndex === 3 && <ToDo/>}
                    {formPageIndex === 4 && <CheckLists/>} */}
                    <div className="button-container">
                        {
                            formPageIndex < 2 &&
                            <ButtonField type={"button"} text={"Next"} className={"blue_button"} 
                                onClick={()=>setFormPageIndex(formPageIndex + 1)}/>
                            }
                        {
                            formPageIndex === 2 &&
                            <ButtonField type={"submit"} text={"Submit"} className="blue_button"/>
                            }
                        {
                            formPageIndex > 1 &&
                            <ButtonField type={"button"} text={"Back"} 
                                onClick={()=>setFormPageIndex(formPageIndex - 1)}/>
                            }
                    </div>
                </form>
            </FormProvider>
        </CustomDialog>
    )
}