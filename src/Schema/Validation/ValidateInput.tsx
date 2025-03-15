

import { useFormContext } from "react-hook-form";

interface RequiredCheckProps {
    name: string
    label: string
}

export const ValidationInput = ({ name , label}: RequiredCheckProps) => {

    const { watch, getValues } = useFormContext();
    
    const emptySpaceCheck=()=>{
        return getValues(name).trim().length > 0 || `${label} Shouldn't  be Empty`;
    }
    const maxLengthCheck =(length:number)=> {
        return { value: length, message: `${label} Should contain at most ${length} Characters` };
    };
    const minLengthCheck =(length:number)=> {
        return { value: length, message: `${label} Should contain at least ${length} Characters` };
    };
    switch (name) {
        case "person_name":
            return {
                required: `Name is Required`,
                maxLength: maxLengthCheck(20),
                pattern: {
                    value: /^[A-Za-z\s]*$/,
                    message: "Name should contain only alphabets",
                },
                validate: {
                    emptyCheck: ()=>emptySpaceCheck()
                },
                

            };
        case "group_name":
            return {
                required: `Group name is Required`,
                maxLength: maxLengthCheck(25),
                validate: {
                    emptyCheck: ()=>emptySpaceCheck()
                }
            }
        case "group_description":
            return {
                required: `Group description is Required`,
                maxLength: maxLengthCheck(100),
                validate: {
                    emptyCheck: ()=>emptySpaceCheck()
                }
            }
        case "email":
            return {
                required: `Email is Required`,
                pattern: {
                    value: /^[^\s@]+@[^0-9\s@]+\.[^\s@]+$/,
                    message: "Enter Valid email address",
                },
              
            };
        case "password":
            return {
                required: `Password is Required`,
                // minLength: minLengthCheck(8),
                maxLength: maxLengthCheck(20),
                pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$&*_])(?=.*[0-9])(?=.*[a-z])/,
                    message: "Password Should contain at least one Uppercase, Lowercase letters, and a Special Symbol, a number"
                },
              
            };
        case "confirmpassword":
            return {
                required: `Confirm Password is Required`,
                validate: () => getValues("password") === watch("confirmpassword") || "Password do not match",
            };

        default:
            return {};
    }
};
