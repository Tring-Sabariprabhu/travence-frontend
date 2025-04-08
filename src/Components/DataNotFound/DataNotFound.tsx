import './DataNotFound.scss';
import noData from '../../Assets/images/No Data/Animation - 1743404540137.json';
import Lottie from 'lottie-react';

export const DataNotFound = ()=>{
    return(
        <div className="data-not-found-container">
            <Lottie animationData={noData}className='animation'/>
            
        </div>
    )
}