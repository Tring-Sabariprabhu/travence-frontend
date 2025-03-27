import { useNavigate } from 'react-router-dom';
import ButtonField from '../../Components/ButtonField/ButtonField';
import './PageNotFound.scss';

export const PageNotFound=()=>{
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    return (
        <div className="page-not-found">
            <div className='Buttons'>
                <ButtonField type={'button'} 
                    className={"blue_button"}
                    text={token ?  "Go to Dashboard" : "Go to Login Page"} 
                    onClick={token ? ()=>navigate('/') : ()=>navigate('/signin')}/>
            </div>
        </div>
    )
}