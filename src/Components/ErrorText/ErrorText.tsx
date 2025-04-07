interface ErrorTextProps {
    message: string
}
export const ErrorText = ({message}: ErrorTextProps)=>{
    return(
        <p className="error">{message}</p>
    )
}