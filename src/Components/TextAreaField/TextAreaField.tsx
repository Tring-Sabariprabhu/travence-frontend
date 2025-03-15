
// import { UseFormRegister } from "react-hook-form"
import { useFormContext } from "react-hook-form";
import { ValidationInput } from "../../Schema/Validation/ValidateInput";
interface TextAreaFieldProps{
    label: string,
    name: string,
    placeholder: string,
    className: string,
    
}
const TextAreaField:React.FC<TextAreaFieldProps>=({label, name, placeholder})=>{
    const { register } = useFormContext(); 
    return(
        <div className="textarea-container">
            <label htmlFor={name}>{label}</label>
            <textarea
                placeholder={placeholder}
                {...register(name, ValidationInput({name, label}))}  
            />
        </div>
    )
}
export default TextAreaField;