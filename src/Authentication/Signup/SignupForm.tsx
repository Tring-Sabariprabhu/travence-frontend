import { FormProvider, useForm } from 'react-hook-form';

import './Signup.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import InputField from '../../Components/InputField/InputField';
import { useState } from 'react';
import { makeToast } from '../../Components/Toast/makeToast';
import ButtonField from '../../Components/ButtonField/ButtonField';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Signup_user } from '../../ApolloClient/Mutation/Auth';


function SignupForm() {

    const navigate = useNavigate();
    const [disableButtonState, setDisableButtonState] = useState<boolean>(false);

    const [signUpUser] = useMutation(Signup_user);
    
    const methods = useForm({
        defaultValues: {
            person_name: "",
            email: "",
            password: "",
            confirmpassword: ""
        }
    })
    const {
        handleSubmit, formState: { errors }
    } = methods;

    const onSubmit = async (formdata: { person_name: string; email: string; password: string; confirmpassword: string }) => {
        setDisableButtonState(true);
        formdata.person_name = formdata.person_name.trim();
        formdata.email = formdata.email.toLowerCase();
        await signUpUser({
            variables: { email: formdata.email, name: formdata.person_name, password: formdata.password },
            onCompleted: (data) => {
                makeToast({ message: "Registered Successfully", toastType: "success" });
                navigate('/signin');
            },
            onError: (error) => {
                makeToast({ message: `${error.message}`, toastType: "error" });
            }
        });
        setDisableButtonState(false);
    };
    return (
        <div className='signin-form-container signup-container'>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-header'>
                        <h2>Sign up</h2>
                    </div>
                    <div className='input-container'>
                        <InputField
                            label="Name"
                            type="text"
                            name={"person_name"}
                            placeholder={'Enter your name'} />
                        {errors?.person_name?.message && <p className='error'>{errors?.person_name?.message}</p>}
                    </div>
                    <div className='input-container'>
                        <InputField
                            label="Email"
                            type="text"
                            name={"email"}
                            placeholder={'Enter your email'} />
                        {errors?.email?.message && <p className='error'>{errors?.email?.message}</p>}
                    </div>
                    <div className='input-container'>
                        <InputField
                            label="Password"
                            type={"password"}
                            name={"password"}
                            placeholder={'Set your password'} />
                        {errors?.password?.message && <p className='error'>{errors?.password?.message}</p>}
                    </div>
                    <div className='input-container'>
                        <InputField
                            label="Confirm password"
                            type={"password"}
                            name={"confirmpassword"}
                            placeholder={'Confirm your password'} />
                        {errors?.confirmpassword?.message && <p className='error'>{errors?.confirmpassword?.message}</p>}
                    </div>

                    <ButtonField
                        type={"submit"}
                        text={"Sign up"}
                        className={"blue_button"}
                        disabledState={disableButtonState} />
                    <footer>
                        <p>Have an Account?</p>
                        <span><Link to="/signin">Sign in</Link></span>
                    </footer>
                </form>
            </FormProvider>
        </div>

    );
}
export default SignupForm;