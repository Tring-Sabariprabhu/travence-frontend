import { useFormContext } from "react-hook-form";

interface TextAreaFieldProps {
    label?: string,
    name: string,
    placeholder?: string,
    className?: string,
    required?: boolean
}
const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, name, placeholder, required=false }) => {
    const { register } = useFormContext();
    return (
        <div >
            {
                label
                &&
                <label htmlFor={name}>
                {label}
                {required && <span className="input-required">*</span>}
            </label>
            }
            
            <textarea
                placeholder={placeholder}
                {...register(name)}
            />
        </div>
    )
}
export default TextAreaField;