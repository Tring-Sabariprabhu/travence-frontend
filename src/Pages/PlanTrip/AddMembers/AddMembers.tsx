import { useQuery } from "@apollo/client";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useState } from "react";
import { GroupMembersDetails } from "../../../ApolloClient/Queries/Groups";
import { useLocation } from "react-router-dom";
import { Group_Member_Props } from "../../Group/Main/Group";
import { useFormContext } from "react-hook-form";
import { ErrorText } from "../../../Components/ErrorText/ErrorText";

export const AddMembers = () => {
    const location = useLocation();
    const group_id = location?.state?.group_id;
    const member_id = location?.state?.member_id;
    const trip_id = location?.state?.trip_id;
    
    const {data: groupdata} = useQuery(GroupMembersDetails,
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
    const group_members = groupdata?.group?.group_members?.filter((member:Group_Member_Props)=> member.member_id !== member_id);
    const {setValue} = useFormContext();
    const [addMembers, setAddMembers] = useState<string[]>([]);
    const addMember = (event: SelectChangeEvent<typeof addMembers>) => {
       setAddMembers(event.target.value as string[]);
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
                            <MenuItem value={member?.member_id} key={index}>
                                {member?.user?.name}
                            </MenuItem>
                        ))
                    }
                </Select>
                {errors?.trip_members?.message 
                    && 
                <ErrorText message={errors?.trip_members?.message.toString()}/>}
            </div>
        </div>
    )
}