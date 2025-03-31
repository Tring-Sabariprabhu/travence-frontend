
interface buttonFieldProps{
    type: "submit" | "reset" | "button" ,
    text: string ,
    className?: string
    onClick?: ()=>void
    disabledState?: boolean
}
const ButtonField: React.FC<buttonFieldProps>= ({ type, text, className, onClick, disabledState = false}) => {
    return (
        <button type={type} className={className} onClick={onClick} disabled={disabledState}>
            {text}
        </button>
    )
}
export default ButtonField;