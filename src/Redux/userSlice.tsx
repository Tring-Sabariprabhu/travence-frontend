import { createSlice } from "@reduxjs/toolkit";

interface UserState{
    user_id: string;
    name: string;
    email: string;
}
const initialState : UserState ={
  user_id: "",
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.name = action.payload.name;
      state.email = action.payload.email;
    }
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
