import { FormProvider, useForm } from "react-hook-form";
import "./SigninForm.scss";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../Components/InputField/InputField";
import { makeToast } from "../../Components/Toast/makeToast";
import { useState } from "react";
import ButtonField from "../../Components/ButtonField/ButtonField";
import { useMutation } from "@apollo/client";
import { Signin_user } from "../../ApolloClient/Mutation/Auth";
import { ErrorText } from "../../Components/ErrorText/ErrorText";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';


export default function SigninForm() {

  const navigate = useNavigate();
  const [disableButtonState, setDisableButtonState] = useState<boolean>(false);

  const [signInUser] = useMutation(Signin_user, { fetchPolicy: "network-only" });

  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const {
    handleSubmit, formState: { errors }
  } = methods;


  const onSubmit = async (formdata: { email: string; password: string }) => {
    setDisableButtonState(true);
    formdata.email = formdata.email.toLowerCase();
    await signInUser({
      variables: { input: {email: formdata.email, password: formdata.password }},
      onCompleted: async (data) => {
        makeToast({ message: "Logged In Successfully", toastType: "success" });
        localStorage.setItem("token", data?.signin?.token);
        navigate('/');
      },
      onError: (error) => {
        makeToast({ message: `${error.message}`, toastType: "error" });
      }
    })
    setDisableButtonState(false);
  };

  return (
    <div className="signin-form-container">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-header">
            <h2>Sign in</h2>

          </div>
          <div className="input-container">
            <InputField
              label="Email"
              type="text"
              name={"email"}
              placeholder={"Enter your email"} 
              required={true}/>
            {errors?.email?.message && <ErrorText message={errors?.email?.message}/>}
          </div>
          <div className="input-container">
            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password" 
              required={true}/>
            {errors?.password?.message && <ErrorText message={errors?.password?.message}/>}
          </div>
          <ButtonField
            type={"submit"}
            text={"Sign in"}
            className={"blue_button"}
            disabledState={disableButtonState} />
          <footer>
            <p>Don't have an Account?</p>
            <Link to='/signup'>Sign up</Link>
          </footer>
        </form>
      </FormProvider>
    </div >
  );
}


