import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../../store";

const selectUserState = (state: RootState) => state.user;

const selectUser = createSelector(selectUserState, (user) => user.user);

const isAuth = createSelector(selectUserState, (user) => !!user.user);

const Users = {
  selectUserState,
  selectUser,
  isAuth,
}
export default Users;
