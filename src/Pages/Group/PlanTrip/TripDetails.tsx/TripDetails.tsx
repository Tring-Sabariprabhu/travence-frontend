import { useFormContext } from "react-hook-form"
import ButtonField from "../../../../Components/ButtonField/ButtonField"
import InputField from "../../../../Components/InputField/InputField"
import TextAreaField from "../../../../Components/TextAreaField/TextAreaField"


export const TripDetails =()=>{
    const {formState: errors} = useFormContext();
    return (
        <div className="trip-details">
            <h4>Trip Details</h4>
            <InputField type={"text"} label={"Trip name"} name={"trip_name"} placeholder={""}/>
            <TextAreaField label={"Trip descripton"} name={"trip_description"} placeholder={""} className={""}/>
            <InputField type={"text"} label={"Trip budget"} name={"trip_budget"} placeholder={""}/>
            <InputField type={"date"} label={"Trip Date"} name={"trip_date"} placeholder={""}/>
        </div>
    )
}