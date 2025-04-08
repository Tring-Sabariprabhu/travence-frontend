import { ReactElement } from "react"

interface buttonFieldProps{
    type: "submit" | "reset" | "button" ,
    text?: string ,
    className?: string
    onClick?: ()=>void
    disabledState?: boolean
    icon?: ReactElement
}
const ButtonField: React.FC<buttonFieldProps>= ({ type, text, className, onClick, disabledState = false, icon}) => {
    return (
        <button type={type} className={className} onClick={onClick} disabled={disabledState}>
            {icon ? icon : text} 
        </button>
    )
}
export default ButtonField;