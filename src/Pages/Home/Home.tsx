
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { capitalizeName } from "../../Schema/StringFunctions/StringFuctions";
import PersonWalingImage from '../../Assets/images/PersonWalking.gif';
import './Home.scss'

export const Home = () => {
  
    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="home">
            <h1>Welcome to Travence <br /> "Hello! <span>{capitalizeName({name: user.name})}</span> ,  Let's plan unforgettable journeys together."</h1  >
            <img src={PersonWalingImage} alt="" />
        </div>
    )
}
