import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import CustomDialog from "../../../../Components/CustomDialog/CustomDialog";
import { InviteMembers } from "../InviteMembers/InviteMembers";
import { TripDetails } from "../TripDetails.tsx/TripDetails";
import './PlanTrip.scss';
export const PlanTrip=()=>{
    const methods = useForm();
    const [formPageIndex, setFormPageIndex] = useState<number>(1);
    
  const {
    handleSubmit } = methods;

    const onSubmit=()=>{
        
    }
    return (
        
            <FormProvider {...methods}>
                <form className="plan-trip-form" onSubmit={handleSubmit(onSubmit)}>
                    {formPageIndex === 1 && <TripDetails/>}
                    {formPageIndex === 2 && <InviteMembers/>}
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
        
    )
}