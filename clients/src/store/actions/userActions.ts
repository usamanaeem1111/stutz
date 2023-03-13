// store/actions/userActions.ts

import { SET_USER, CLEAR_USER, SetUserAction, ClearUserAction } from "../types";

export const setUser = (user: any): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

export const clearUser = (): ClearUserAction => ({
  type: CLEAR_USER,
});
