import Lottie from "lottie-react";
import LoaderAnimation from '../../Assets/images/Loader/Animation - 1742875359926.json';
import './Loader.scss';
export const Loader = ()=>{
    return (
    <div className="loader-container">
        <Lottie animationData={LoaderAnimation} className="loader"/>
    </div>)
}