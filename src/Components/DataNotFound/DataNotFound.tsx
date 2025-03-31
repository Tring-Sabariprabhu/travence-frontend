import './DataNotFound.scss';
import noData from '../../Assets/images/No Data/Animation - 1743404540137.json';
import Lottie from 'lottie-react';
interface DataNotFoundProps{
    message: string
}
export const DataNotFound = ({message} : DataNotFoundProps)=>{
    return(
        <div className="data-not-found-container">
            <Lottie animationData={noData}className='animation'/>
            <h3>
                {/* {message} Not found */}
            </h3>
        </div>
    )
}