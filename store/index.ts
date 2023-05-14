import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistReducer } from "redux-persist";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import storage from "./storage";
const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "spotify"],
};

const persisterReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisterReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

export const wrapper = createWrapper(() => store, { debug: true });
