import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/*
|-----------------------------------------------------------------
| Initial State
|-----------------------------------------------------------------
|
*/
interface IUser {
  about: any;
  city: any;
  dob: any;
  dob_day: any;
  dob_month: any;
  dob_year: any;
  email: any;
  email_verified: any;
  first_name: any;
  gender_identity: any;
  gender_interest: any;
  images: any;

  likes: any;

  matches: any;

  show_gender: any;

  signUpDate: any;

  url: any;

  user_id: any;

  _id: any;
}

export interface IUserState {
  user: null | IUser;
}

export const initialState: IUserState = {
  user: null,
};

/*
|-----------------------------------------------------------------
| Create Slice
|-----------------------------------------------------------------
|
*/

const userState = createSlice({
  name: "userState",
  initialState,
  reducers: {
    setUser(state: IUserState, action: PayloadAction<{ value: null | IUser }>) {
      state.user = action.payload.value;
    },
  },
});

/*
|-----------------------------------------------------------------
| Export actions & reducer
|-----------------------------------------------------------------
|
*/
export const userActions = userState.actions;
export { default as userSelectors } from "./user.selectors";

export default userState.reducer;
