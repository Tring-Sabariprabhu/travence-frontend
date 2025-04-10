import { useQuery } from "@apollo/client";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useState } from "react";
import { GroupMembersDetails } from "../../../ApolloClient/Queries/Groups";
import { useLocation } from "react-router-dom";
import { Group_Member_Props } from "../../Group/Main/Group";
import { useFormContext } from "react-hook-form";
import { ErrorText } from "../../../Components/ErrorText/ErrorText";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { GroupMembersForTrip } from "../../../ApolloClient/Queries/Trips";

interface GroupMembersForTrip{
    name: string
    member_id: string
}
export const AddMembers = () => {
    const user = useSelector((state: RootState)=> state?.user);
    const location = useLocation();
    const trip_id = location?.state?.trip_id;
    const input = (trip_id ? {trip_id: trip_id} : {group_id: user?.group_id});
    
    const {data: groupdata} = useQuery(GroupMembersForTrip,
        {
            variables: {
                input: input
            },
            skip: !user?.group_id,
            fetchPolicy: "network-only"
        }
    )
    const group_members = groupdata?.groupMembersForTrip?.filter((member: GroupMembersForTrip)=> member.member_id !== user?.current_group_member_id);
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
                        group_members?.map((member: GroupMembersForTrip, index: number)=> (
                            <MenuItem value={member?.member_id} key={index}>
                                {member?.name}
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