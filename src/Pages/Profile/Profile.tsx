import { FormProvider, useForm } from 'react-hook-form';
import { Header } from '../../Components/Header/header';
import InputField from '../../Components/InputField/InputField';
import './Profile.scss';
import ButtonField from '../../Components/ButtonField/ButtonField';
import defaultImage from '../../Assets/images/default1.jpg'
import { ChangeCircleOutlined } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { decryptPassword, encryptPassword } from '../../Schema/Crypto/crypto';
import { useLazyQuery, useMutation } from '@apollo/client';
import { UpdateUserDetails } from '../../ApolloClient/Mutation/Users';
import { makeToast } from '../../Components/Toast/makeToast';
import { GetCurrentUser } from '../../ApolloClient/Queries/Users';
import { setUser } from '../../Redux/userSlice';
import { Confirmation } from '../../Components/Confirmation/Confirmation';
import { useNavigate } from 'react-router-dom';

type profileData = {
    person_name: string,
    email: string,
    password: string | undefined
}
const Profile = () => {

    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [imageSelected, setImageSelected] = useState<string>();

    const [updateUserDetails] = useMutation(UpdateUserDetails);
    const [updateConfirmState, setUpdateConfirmState] = useState<boolean>(false);
    const [updateDisableState, setUpdateDisableState] = useState<boolean>(false);

    const token = localStorage?.getItem("token");
    const [getUserDetails] = useLazyQuery(GetCurrentUser,
        {
            variables: {
                token: token
            },
            fetchPolicy: "network-only",
            onCompleted: (data) => {
                const { getCurrentUser: updated } = data;
                dispatch(setUser({ user_id: updated?.user_id, name: updated?.name, email: updated?.email, password: updated?.password }));
                if (watch("password") !== decryptedPassword) {
                    localStorage.removeItem("token");
                    navigate('/signin');
                } else {
                    navigate('/');
                }
            },
            onError: (err) => {
                makeToast({ message: err.message, toastType: "error" });
            }
        });
    const [decryptedPassword, setDecryptedPassword] = useState<string>();

    useEffect(() => {
        if (user?.name)
            setValue("person_name", user?.name);
        if (user?.email)
            setValue("email", user?.email);
        if (user?.password) {
            setDecryptedPassword(decryptPassword(user?.password));
            setValue("password", decryptPassword(user?.password));
        }
        setImageSelected(user?.image);

    }, [user]);


    const methods = useForm<profileData>({
        defaultValues: {
            person_name: ""
        }
    });
    const { formState: { errors }, watch, setValue, handleSubmit } = methods;



    const update = async () => {
        setUpdateConfirmState(false);
        setUpdateDisableState(true);
        const name = watch("person_name");
        const encryptedPassword = encryptPassword(watch("password") as string);
        await updateUserDetails({
            variables:
            {
                input: {
                    user_id: user?.user_id,
                    name: name,
                    password: encryptedPassword,
                }
            },
            onCompleted: (data) => {
                makeToast({ message: data?.updateUser, toastType: "success" });
                getUserDetails();
            },
            onError: (err) => {
                makeToast({ message: err?.message, toastType: "error" });
            }
        });
        setUpdateDisableState(false);
    }

    const onSubmit = async (formdata: profileData) => {
        if (imageSelected !== user?.image || formdata?.person_name !== user?.name || formdata?.password !== decryptedPassword) {
            setUpdateDisableState(true);
            if (formdata?.password !== decryptedPassword) {
                setUpdateConfirmState(true);
            } else {
                update();
            }
        } else {
            makeToast({ message: "Make Changes and Save", toastType: "info" });
        }

    }
    const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg"];
        if (event?.target?.files) {
            const imageURL = (event?.target?.files[0]?.name);
            const imageExtension = imageURL?.slice(imageURL?.indexOf("."));
            if (allowedExtensions?.includes(imageExtension)) {
                setImageSelected(URL?.createObjectURL(event?.target?.files[0]));
            } else {
                makeToast({ message: "Upload Valid Image with extensions .jpg, .jpeg, .png, .svg", toastType: "warning", closeTime: 2000 });
            }
        }
    }
    return (
        <div className="profile-page">
            <div className='body-container'>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='user-image'>
                            <img src={imageSelected ? imageSelected : defaultImage} alt="" />
                            <ChangeCircleOutlined className='icon' onClick={() => document?.getElementById('image-input')?.click()} />
                            <input
                                type="file"
                                id='image-input'
                                onChange={handleImageSelected}
                                accept="image/*"
                                style={{ display: "none" }}
                            />
                        </div>
                        <div className='input-container'>
                            <InputField type={'text'} label={'Name'} name={'person_name'} />
                            {errors?.person_name?.message && <p className='error'>{errors?.person_name?.message}</p>}
                        </div>
                        <div className='input-container'>
                            <InputField type={'text'} label={'Email'} name={'email'} disableState={true} />
                        </div>
                        <div className='input-container'>
                            <InputField type={'password'} label={'Password'} name={'password'} />
                            {errors?.password?.message && <p className='error'>{errors?.password?.message}</p>}
                        </div>
                        <ButtonField type={'submit'}
                            text={'Save Changes'}
                            className={'blue_button'}
                            disabledState={updateDisableState} />
                    </form>
                </FormProvider>
            </div>
            <Confirmation
                open={updateConfirmState}
                onClose={() => setUpdateConfirmState(false)}
                title={'Do you want to Save password?'}
                closeButtonText={'Cancel'}
                confirmButtonText={'Confirm'}
                onSuccess={update} />
        </div>
    )
}
export default Profile;