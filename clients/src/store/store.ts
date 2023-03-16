import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";

// -- import user reducer
import userReducer from "./reducers/user/user.reducer";
import notificationReducer from "./reducers/notification/notification.reducer";

// -- export user actions & selectors
export { userActions, userSelectors } from "./reducers/user/user.reducer";

const rootReducer = combineReducers({
  /* PLOP_INJECT_COMBINE */
  user: userReducer,
  notifications: notificationReducer,
});

/*
|-----------------------------------------------------------------
| Create store
|-----------------------------------------------------------------
|
*/
const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default store;
