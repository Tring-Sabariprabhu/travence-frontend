import { FormProvider, useForm } from "react-hook-form";
import "./SigninForm.scss";
import { Link, useNavigate } from "react-router-dom";

import InputField from "../../Components/InputField/InputField";
import { makeToast } from "../../Components/Toast/makeToast";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import ButtonField from "../../Components/ButtonField/ButtonField";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Signin_user } from "../../ApolloClient/Mutation/Auth";
import { UserDetails } from "../../ApolloClient/Queries/Users";
import { useDispatch } from "react-redux";


export default function SigninForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signInUser] = useMutation(Signin_user);
  
  const [getUserdetails] = useLazyQuery(UserDetails);
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const {
    handleSubmit,
  } = methods;


  const onSubmit = async (formdata: { email: string; password: string }) => {
    formdata.email = formdata.email.toLowerCase();
    await signInUser({variables: {email: formdata.email, password: formdata.password},
            onCompleted: async (data)=>{
              makeToast({message: "Logged In Successfully", toastType: "success"});
              localStorage.setItem("token", data?.signin?.token )
              navigate('/');
            },
            onError: (error)=>{
              makeToast({message: `${error.message}`, toastType: "error"});
            }})
  };

  return (
    <div className="signin-form-container">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-header">
            <h2>Sign in</h2>
            <p className="logo"></p>
          </div>
          <div className="input-container">
            <InputField label="Email" type="text" name={"email"}
              placeholder={"Enter your email"} />
            <InputField label="Password" type={showPassword ? "text" : "password"} name="password"
              placeholder="Enter your password" />
            <div onClick={() => setShowPassword(!showPassword)} className="toggle-password">
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </div>
          </div>
          <ButtonField type={"submit"} text={"Sign in"} className={"blue_button"} />
          <footer>
            <p>Don't have an Account?</p>
            <span><Link to='/signup'>Register</Link></span>
          </footer>
        </form>
      </FormProvider>
    </div>
  );
}


