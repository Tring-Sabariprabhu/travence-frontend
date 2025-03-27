import './DataNotFound.scss';
interface DataNotFoundProps{
    message: string
}
export const DataNotFound = ({message} : DataNotFoundProps)=>{
    return(
        <div className="data-not-found-container">
            <h3>
                {message}
            </h3>
        </div>
    )
}