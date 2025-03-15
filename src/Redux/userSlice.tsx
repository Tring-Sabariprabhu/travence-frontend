import { createSlice } from "@reduxjs/toolkit";

interface UserState{
    user_id: string;
    name: string;
    email: string;
    image: string,
}
const initialState : UserState ={
  user_id: "",
  name: "",
  email: "",
  image: "",
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
    }
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
