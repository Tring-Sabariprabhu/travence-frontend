import { useFormContext } from "react-hook-form"
import InputField from "../../../Components/FormFields/InputField/InputField";
import TextAreaField from "../../../Components/FormFields/TextareaField/TextareaField";
import { ErrorText } from "../../../Components/ErrorText/ErrorText";

export const TripDetails = () => {

    const {formState: {errors}} = useFormContext();
    
    return (
        <div className="trip-details">
            <h3>Trip Details</h3>
            <div className="container">
                <div className="input-container">
                    <InputField type={"text"}
                        label={"Trip name"}
                        name={"trip_name"}
                        placeholder={"Trip name"} 
                        required={true}/>
                    {errors?.trip_name?.message 
                        && 
                    <ErrorText message={errors?.trip_name?.message.toString()}/>}
                </div>
                <div className="input-container">
                    <TextAreaField
                        label={"Trip descripton"}
                        name={"trip_description"}
                        placeholder={"Trip description"}
                        className={""}
                        required={true} />
                    {errors?.trip_description?.message 
                        && 
                    <ErrorText message={errors?.trip_description?.message.toString()}/>}
                </div>
                <div className="input-container">
                    <InputField
                        type={"date"}
                        label={"Trip Start date"}
                        name={"trip_start_date"} 
                        required={true}/>
                    {errors?.trip_start_date?.message 
                        && 
                    <ErrorText message={errors?.trip_start_date?.message.toString()}/>}
                </div>
                <div className="input-container">
                    <InputField type={"text"}
                        label={"Trip days count"}
                        name={"trip_days_count"}
                        placeholder={"Trip days count"}
                        required={true} />
                    {errors?.trip_days_count?.message 
                        && 
                    <ErrorText message={errors?.trip_days_count?.message.toString()}/>}
                </div>
            </div>
        </div>
    )
}