
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { capitalizeName } from "../../Schema/StringFunctions/StringFuctions";

export const Home = () => {
  
    const user = useSelector((state: RootState) => state.user);

    return (
        <div className="home">
            <h1>Welcome to Travence <br /> "Hello! {capitalizeName({name: user.name})},  Let's plan unforgettable journeys together."</h1  >
        </div>
    )
}
