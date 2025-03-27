

import { useFormContext } from "react-hook-form";
import { ValidationInput } from "../../Schema/Validation/ValidateInput";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface InputFieldProps {
    type: string,
    label: string,
    name: string,
    placeholder?: string,
    disableState?: boolean

}
const InputField: React.FC<InputFieldProps> = ({ type, label, name, placeholder, disableState = false }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { register } = useFormContext();
    return (
        <div >
            <label htmlFor={name}>{label}</label>
            <input
                type={showPassword ? "text" : type}
                placeholder={placeholder}
                {...register(name, ValidationInput({ name, label }))}
                disabled={disableState}
                style={disableState ? { cursor: "not-allowed" } : {}}
            />
            {(name === "password" || name === "confirmpassword") &&
                <div onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </div>}
        </div>
    )
}
export default InputField;