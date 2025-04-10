import { createSlice } from "@reduxjs/toolkit";

interface UserState{
    user_id: string;
    name: string;
    email: string;
    image: string,
    password: string,
    group_id: string,
    current_group_member_id: string
    trip_id: string
    current_trip_member_id: string
}
const initialState : UserState ={
  user_id: "",
  name: "",
  email: "",
  image: "",
  password: "",
  group_id: "",
  current_group_member_id: "",
  trip_id: "",
  current_trip_member_id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.image = action.payload.image;
      state.password = action.payload.password;
      state.group_id = action.payload.group_id;
      state.current_group_member_id = action.payload.current_group_member_id;
      state.trip_id = action.payload.trip_id;
      state.current_trip_member_id = action.payload.current_trip_member_id
    }
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
