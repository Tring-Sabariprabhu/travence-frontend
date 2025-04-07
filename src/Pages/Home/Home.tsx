
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import './Home.scss'
import PersonWalkingAnimation from '../../Assets/images/DashboadAnimation/Animation - 1742464861324.json';
import Lottie from "lottie-react";
export const Home = () => {
  
    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="home">
            <h1>Welcome to Travence <br /> Hello! <span className="user-name">{user.name}</span> ,  Let's plan unforgettable journeys together.</h1  >
            <Lottie animationData={PersonWalkingAnimation} className="personwalking"/>
        </div>
    )
}
