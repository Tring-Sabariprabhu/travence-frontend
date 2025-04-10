import { Delete } from "@mui/icons-material";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import { ErrorText } from "../../../Components/ErrorText/ErrorText";
import TextAreaField from "../../../Components/FormFields/TextareaField/TextareaField";
import { useFieldArray, useFormContext } from "react-hook-form";

export const CheckLists = () => {
    
    const { control, formState: {errors}} = useFormContext();
        const { fields, append, remove} = useFieldArray({
            control,
            name: "trip_checklists"
        });
    return (
        <div className="trip-checklists">
            <h3>CheckLists</h3>
            <div className="container">
                {
                    fields?.map((item, index) => (
                        <div className="item" key={index}>
                            <TextAreaField
                                label={""}
                                name={`trip_checklists[${index}]`}
                                placeholder="About Item" />
                            <ButtonField type={"button"}
                                icon={<Delete/>}
                                className={"red_button"}
                                onClick={() => remove(index)} />
                        </div>
                    ))
                }
                <ButtonField type={"button"}
                    text={"Add Checklist item"}
                    className={"blue_button"}
                    onClick={()=>append("Item")} />
                {errors?.trip_checklists?.message 
                    && 
                <ErrorText message={errors?.trip_checklists?.message.toString()}/>}
            </div>
        </div>
    )
}