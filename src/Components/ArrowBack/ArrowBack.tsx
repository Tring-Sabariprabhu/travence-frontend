import { ArrowBack } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
export const ArrowBackIcon = () => {
    const navigate = useNavigate();
    return (

        <ArrowBack onClick={() => navigate(-1)} sx={{ cursor: "pointer" }} />

    )
}