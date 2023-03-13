// store/reducers/userReducer.ts

import { UserActionTypes, UserState, SET_USER, CLEAR_USER } from "../types";

const initialState: UserState = {
  user: null,
};

const userReducer = (
  state = initialState,
  action: UserActionTypes
): UserState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default userReducer;
