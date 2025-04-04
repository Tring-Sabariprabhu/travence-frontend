import { useQuery } from "@apollo/client";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useState } from "react";
import { GroupData } from "../../../../ApolloClient/Queries/Groups";
import { useLocation } from "react-router-dom";
import { Group_Member_Props } from "../../Main/Group";
import { useFormContext } from "react-hook-form";

export const AddMembers = () => {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const {data: groupdata} = useQuery(GroupData,
        {
            variables: {
                input: {
                    group_id: group_id
                }
            },
            skip: !group_id,
            fetchPolicy: "network-only"
        }
    )
    const group_members = groupdata?.group?.group_members;
    const {setValue} = useFormContext();
    const [addMembers, setAddMembers] = useState<string[]>([]);
    const addMember = (event: SelectChangeEvent<typeof addMembers>) => {
        // event?.target?.
        // const {target: {value}} = event;
        // if(addMembers.includes(event?.target?.value as string)){
        //     addMembers?.findIndex(value);
        // }else{
            setAddMembers(event.target.value as string[]);
        // }
        setValue("trip_members", event?.target?.value as string[]);
      };
    const {formState: {errors}} = useFormContext();
    return (
        <div className="invite-members">
            <h3>Add Trip Members</h3>
            <div className="container">
                <Select className="drop-down"
                    value={addMembers}
                    multiple
                    onChange={addMember}
                    >
                    {
                        group_members?.length > 0 
                        &&
                        group_members?.map((member: Group_Member_Props, index: number)=> (
                            <MenuItem value={member?.member_id}>
                                {member?.user?.name}
                            </MenuItem>
                        ))
                    }
                </Select>
                {errors?.trip_members?.message && <p className="error">{errors?.trip_members?.message?.toString()}</p>}
            </div>
        </div>
    )
}