import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { makeToast } from "../../../../Components/Toast/makeToast";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import InputField from "../../../../Components/InputField/InputField";
import ButtonField from "../../../../Components/ButtonField/ButtonField";
import CustomDialog from "../../../../Components/CustomDialog/CustomDialog";
import "./AddGroup.scss";
import TextAreaField from "../../../../Components/TextAreaField/TextAreaField";
import { CreateGroup, UpdateGroup } from "../../../../ApolloClient/Mutation/Groups";

type AddGroupProps = {
    admin_id?: string
    group_id?: string
    group_name?: string
    group_description?: string
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
};

const AddGroup: React.FC<AddGroupProps> = ({ open, onClose, onUpdated, group_name = "", group_description = "", group_id, admin_id}) => {

    const user = useSelector((state: RootState) => state.user);
    const [disableButtonState, setDisableButtonState] = useState<boolean>(false);

    const [createGroup] = useMutation(CreateGroup);
    const [updateGroup] = useMutation(UpdateGroup);

    const methods = useForm({
        defaultValues: {
            group_name: group_name,
            group_description: group_description,
        },
    });

    const { handleSubmit, setValue, formState: { errors }, clearErrors } = methods;

    useEffect(() => {
        setValue("group_name", group_name);
        setValue("group_description", group_description);
    }, [open]);



    const onSubmit = async (formdata: { group_name: string; group_description: string }) => {
        setDisableButtonState(true);
        formdata.group_name = formdata.group_name.trim();
        formdata.group_description = formdata.group_description.trim();
        if (group_id) {
            if (formdata.group_name !== group_name || formdata.group_description !== group_description) {
                await updateGroup({
                    variables: { 
                        input: {
                            admin_id: admin_id,
                            group_name: formdata?.group_name,
                            group_description: formdata?.group_description
                        }
                    },
                    onCompleted: (data) => {
                        makeToast({ message: data?.updateGroup, toastType: "success" });
                        onUpdated();
                    },
                    onError: (error) => {
                        makeToast({ message: error.message, toastType: "error" });
                    }
                })
                onClose();
            } else {
                makeToast({ message: "Make Changes and Save", toastType: "info" });
            }
        } else {
            await createGroup({
                variables: { input: { created_by: user?.user_id, group_name: formdata?.group_name, group_description: formdata?.group_description }},
                onCompleted: (data) => {
                    makeToast({ message: data?.createGroup, toastType: "success" });
                    onUpdated();
                },
                onError: (error) => {
                    makeToast({ message: error.message, toastType: "error" });
                }
            })
            onClose();
        }
        setDisableButtonState(false);
    };
    const handleClose = () => {
        onClose();
        clearErrors();
    }
    return (
        <CustomDialog open={open} onClose={handleClose} dialog_title={group_id ? "Edit Group details" : "Create Group"}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="addgroup-form">
                    <div className="input-container">
                        <InputField type="text" label="Group Name" name="group_name" placeholder="Enter Group name" />
                        {errors?.group_name?.message && <p className="error">{errors?.group_name?.message}</p>}
                    </div>
                    <div className="input-container">
                        <TextAreaField label={"Group Description"} name={"group_description"} placeholder={"Enter Group description"} className={""} />
                        {errors?.group_description?.message && <p className="error">{errors?.group_description?.message}</p>}
                    </div>
                    <div className="button-container">
                        <ButtonField
                            type="submit"
                            text={group_id ? "Save Changes" : "Create"}
                            className="blue_button"
                            disabledState={disableButtonState} />
                    </div>
                </form>
            </FormProvider>
        </CustomDialog>
    );
};

export default AddGroup;
