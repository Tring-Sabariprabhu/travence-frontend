import ButtonField from "../../../Components/ButtonField/ButtonField"
import TextAreaField from "../../../Components/FormFields/TextareaField/TextareaField"
import InputField from "../../../Components/FormFields/InputField/InputField"
import { useFieldArray, useFormContext } from "react-hook-form";

export const Activities = () => {

    const { control, formState: {errors}} = useFormContext();
    const { fields, append, remove} = useFieldArray({
        control,
        name: "trip_activities"
    });

    return (
        <div className="trip-activities">
            <h3>Activities</h3>
            <div className="container">
                {
                    fields.map((activity, index) => (
                        <div key={index} className="activity">
                            <TextAreaField label={""}
                                name={`trip_activities[${index}].activity`}
                                placeholder={"Activity"} />
                            <InputField type={"text"}
                                label={""}
                                name={`trip_activities[${index}].budget`}
                                placeholder={"Budget"} />
                            <ButtonField type={"button"}
                                text={"Remove"}
                                onClick={() => remove(index)}
                                className={"red_button"} />
                        </div>
                    ))
                }
                <ButtonField type={"button"}
                    text={"Add Activity"}
                    onClick={()=> append({activity: "", budget: ""})}
                    className={"blue_button"} />
                {errors?.trip_activities?.message && <p className="error">{errors?.trip_activities?.message?.toString()}</p>}
            </div>
        </div>
    )
}