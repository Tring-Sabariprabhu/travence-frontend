import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import './ArrowBack.scss';
export const ArrowBackIcon = () => {
    const navigate = useNavigate();
    return (

        <ArrowBack onClick={() => navigate(-1)} sx={{ cursor: "pointer" }} />

    )
}