import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import chemistUserReducer from "./slices/chemistUserSlice";
import materialDraftReducer from "./slices/materialDraftSlice";
import sabatierMaterialsReducer from "./slices/sabatierMaterialsSlice";

export const store = configureStore({
  reducer: combineReducers({
    sabatierMaterials: sabatierMaterialsReducer,
    materialDraft: materialDraftReducer,
    chemistUser: chemistUserReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export function selectRequestInProgress(state: RootState): boolean {
  return (
    state.sabatierMaterials.loading ||
    state.materialDraft.loading ||
    state.chemistUser.loading
  );
}

export default store;
