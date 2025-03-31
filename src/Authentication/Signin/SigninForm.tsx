import { FormProvider, useForm } from "react-hook-form";
import "./SigninForm.scss";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../Components/InputField/InputField";
import { makeToast } from "../../Components/Toast/makeToast";
import { useState } from "react";
import ButtonField from "../../Components/ButtonField/ButtonField";
import { useMutation } from "@apollo/client";
import { Signin_user } from "../../ApolloClient/Mutation/Auth";


export default function SigninForm() {

  const navigate = useNavigate();
  const [disableButtonState, setDisableButtonState] = useState<boolean>(false);
  //Set disable to button until wait for API

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
              placeholder={"Enter your email"} />
            {errors?.email?.message && <p className="error">{errors?.email?.message}</p>}
          </div>
          <div className="input-container">
            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password" />
            {errors?.password?.message && <p className="error">{errors?.password?.message}</p>}
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


