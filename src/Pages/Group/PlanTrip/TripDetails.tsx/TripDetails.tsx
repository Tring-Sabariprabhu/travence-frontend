import { useFormContext } from "react-hook-form"
import InputField from "../../../../Components/InputField/InputField";
import TextAreaField from "../../../../Components/TextAreaField/TextAreaField";



export const TripDetails = () => {
    // const { formState: errors } = useFormContext();
    return (
        <div className="trip-details">
            <h3>Trip Details</h3>
            <div className="container">
                <div className="input-container">
                    <InputField type={"text"} label={"Trip name"} name={"trip_name"} placeholder={""} />
                </div>
                <div className="input-container">
                    <TextAreaField label={"Trip descripton"} name={"trip_description"} placeholder={""} className={""} />
                </div>
                <div className="input-container">
                    <InputField type={"date"} label={"Trip Date"} name={"trip_date"} placeholder={""} />
                </div>
            </div>
        </div>
    )
}