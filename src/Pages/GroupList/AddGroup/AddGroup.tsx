import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { makeToast } from "../../../Components/Toast/makeToast";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import InputField from "../../../Components/InputField/InputField";
import ButtonField from "../../../Components/ButtonField/ButtonField";
import CustomDialog from "../../../Components/CustomDialog/CustomDialog";
import "./AddGroup.scss";
import TextAreaField from "../../../Components/TextAreaField/TextAreaField";
import { CreateGroup, UpdateGroup } from "../../../ApolloClient/Mutation/Groups";
import { ErrorText } from "../../../Components/ErrorText/ErrorText";
import { Group_Details } from "../../../ApolloClient/Queries/Groups";

type AddGroupProps = {
    group_id?: string
    group_name?: string
    group_description?: string
    open: boolean;
    onClose: () => void;
    onUpdated: () => void;
};

const AddGroup: React.FC<AddGroupProps> = ({ open, onClose, onUpdated, group_name = "", group_description = "", group_id }) => {

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

    const {refetch: refetchGroupData} = useQuery(Group_Details,
        {
            variables: {
                input: {
                    group_id: group_id
                }
            },
            skip: !group_id,
            onCompleted: (data) => {
                const { group } = data;
                setValue("group_name", group?.group_name);
                setValue("group_description", group?.group_description);
            },
        }
    );

    const onSubmit = async (formdata: { group_name: string; group_description: string }) => {
        setDisableButtonState(true);
        formdata.group_name = formdata.group_name.trim();
        formdata.group_description = formdata.group_description.trim();
        if (group_id) {
            await updateGroup({
                variables: {
                    input: {
                        group_id: group_id,
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

        } else {
            await createGroup({
                variables: { input: { created_by: user?.user_id, group_name: formdata?.group_name, group_description: formdata?.group_description } },
                onCompleted: (data) => {
                    makeToast({ message: data?.createGroup, toastType: "success" });
                    onUpdated();
                },
                onError: (error) => {
                    makeToast({ message: error.message, toastType: "error" });
                }
            })
        }
        handleClose();
        setDisableButtonState(false);
    };
    const handleClose = () => {
        refetchGroupData();
        onClose();
        setValue("group_description","");
        setValue("group_name","");
        clearErrors();
    }
    return (
        <CustomDialog open={open} onClose={handleClose} dialog_title={group_id ? "Edit Group details" : "Create Group"}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="addgroup-form">
                    <div className="input-container">
                        <InputField type="text"
                            label={"Group Name"}
                            name="group_name"
                            placeholder="Enter Group name"
                            required={true} />
                        {errors?.group_name?.message 
                            && 
                        <ErrorText message={errors?.group_name?.message}/>}
                    </div>
                    <div className="input-container">
                        <TextAreaField
                            label={"Group Description"}
                            name={"group_description"}
                            placeholder={"Enter Group description"}
                            required={true} />
                        {errors?.group_description?.message 
                            && 
                        <ErrorText message={errors?.group_description?.message}/>}
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
