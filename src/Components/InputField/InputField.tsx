

import { useFormContext } from "react-hook-form";
import { ValidationInput } from "../../Schema/Validation/ValidateInput";
import { watch } from "fs";
interface InputFieldProps{
    type: string,
    label: string,
    name: string,
    placeholder: string,
    
}
const InputField:React.FC<InputFieldProps>=({type ,label, name, placeholder})=>{

    const { register} = useFormContext(); 
    
    return(
        <div className="input-box-container">
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                {...register(name, ValidationInput({name, label}))}
            />
        </div>
    )
}
export default InputField;