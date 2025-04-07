import ButtonField from "../../../Components/ButtonField/ButtonField"
import TextAreaField from "../../../Components/FormFields/TextareaField/TextareaField"
import InputField from "../../../Components/FormFields/InputField/InputField"
import { useFieldArray, useFormContext } from "react-hook-form";
import { PlanTripFormValues } from "../Main/PlanTrip";
import { ErrorText } from "../../../Components/ErrorText/ErrorText";

export const Activities = () => {

    const { control, formState: {errors}} = useFormContext<PlanTripFormValues>();
    const { fields, append, remove} = useFieldArray({
        control,
        name: "trip_activities"
    });

    return (
        <div className="trip-activities">
            <h3>Activities</h3>
            <div className="container">
                {
                    fields.map((activity, index) => {
                        const activityError =  errors.trip_activities?.[index]?.activity?.message;
                        const budgetError =  errors.trip_activities?.[index]?.budget?.message;
                        return(
                            <div key={index} className="activity">
                            <TextAreaField label={""}
                                name={`trip_activities[${index}].activity`}
                                placeholder={"Activity"} />
                            {activityError && <p className="error">{activityError}</p>}
                            <InputField type={"text"}
                                label={""}
                                name={`trip_activities[${index}].budget`}
                                placeholder={"Budget"} />
                            {budgetError && <p className="error">{budgetError}</p>}
                            <ButtonField type={"button"}
                                text={"Remove"}
                                onClick={() => remove(index)}
                                className={"red_button"} />
                        </div>
                        )
                    })
                }
                <ButtonField type={"button"}
                    text={"Add Activity"}
                    onClick={()=> append({activity: "", budget: 0})}
                    className={"blue_button"} />
                {errors?.trip_activities?.message 
                    && 
                <ErrorText message={errors?.trip_activities?.message.toString()}/>}
            </div>
        </div>
    )
}