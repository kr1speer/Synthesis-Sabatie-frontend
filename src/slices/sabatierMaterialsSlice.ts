import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import type { SabatierMaterialOut } from "../api/Api";
import {
  feedMaterialMock,
  filterMaterialsMock,
  maxReactionValueMock,
  nextFeedMaterialMock,
} from "../modules/mock";
import type { RootState } from "../store";

interface SabatierMaterialsState {
  materials: SabatierMaterialOut[];
  feedMaterial: SabatierMaterialOut | null;
  minReactionValue: number;
  appliedReactionValue: number;
  loading: boolean;
  usingMock: boolean;
  error: string | null;
}

const initialState: SabatierMaterialsState = {
  materials: [],
  feedMaterial: null,
  minReactionValue: 0,
  appliedReactionValue: 0,
  loading: false,
  usingMock: false,
  error: null,
};

function guestMaterialsFallback(
  state: RootState,
  minReactionValue: number,
): SabatierMaterialOut[] | null {
  if (state.chemistUser.isAuthenticated) {
    return null;
  }
  return filterMaterialsMock(minReactionValue);
}

export const getSabatierMaterials = createAsyncThunk<
  SabatierMaterialOut[],
  void,
  { state: RootState; rejectValue: SabatierMaterialOut[] | null }
>("sabatierMaterials/getSabatierMaterials", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const minReactionValue = state.sabatierMaterials.appliedReactionValue;

  try {
    const response = await api.sabatierMaterials.getSabatierMaterials({
      min_reaction_value: minReactionValue,
    });
    return response.data;
  } catch {
    return rejectWithValue(guestMaterialsFallback(state, minReactionValue));
  }
});

export const getSabatierMaterialFeed = createAsyncThunk<
  SabatierMaterialOut,
  { materialId?: number; next?: boolean },
  { state: RootState; rejectValue: SabatierMaterialOut | null }
>(
  "sabatierMaterials/getSabatierMaterialFeed",
  async ({ materialId, next = false }, { getState, rejectWithValue }) => {
    try {
      const response = await api.sabatierMaterials.getSabatierMaterialFeed({
        material_id: materialId,
        next,
      });
      return response.data;
    } catch {
      if (getState().chemistUser.isAuthenticated) {
        return rejectWithValue(null);
      }
      if (next && materialId !== undefined) {
        return rejectWithValue(nextFeedMaterialMock(materialId));
      }
      return rejectWithValue(feedMaterialMock(materialId));
    }
  },
);

export const likeSabatierMaterial = createAsyncThunk<
  SabatierMaterialOut,
  { materialId: number; liked: number },
  { rejectValue: string }
>(
  "sabatierMaterials/likeSabatierMaterial",
  async ({ materialId, liked }, { rejectWithValue }) => {
    try {
      const response = await api.sabatierMaterials.likeSabatierMaterial(materialId, {
        liked,
      });
      return response.data;
    } catch {
      return rejectWithValue("Лайк не поставлен: нужна аутентификация");
    }
  },
);

export const deleteSabatierMaterial = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("sabatierMaterials/deleteSabatierMaterial", async (materialId, { rejectWithValue }) => {
  try {
    await api.sabatierMaterials.deleteSabatierMaterial(materialId);
    return materialId;
  } catch {
    return rejectWithValue("Материал не удалён: он чужой или сервис недоступен");
  }
});

function replaceMaterial(
  state: SabatierMaterialsState,
  material: SabatierMaterialOut,
): void {
  state.materials = state.materials.map((item) =>
    item.id === material.id ? material : item,
  );
  if (state.feedMaterial?.id === material.id) {
    state.feedMaterial = material;
  }
}

const sabatierMaterialsSlice = createSlice({
  name: "sabatierMaterials",
  initialState,
  reducers: {
    minReactionValueChanged(state, action: PayloadAction<number>) {
      state.minReactionValue = action.payload;
    },

    materialFilterApplied(state) {
      state.appliedReactionValue = state.minReactionValue;
    },

    materialFilterReset(state) {
      state.minReactionValue = 0;
      state.appliedReactionValue = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSabatierMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSabatierMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.usingMock = false;
        state.materials = action.payload;
      })
      .addCase(getSabatierMaterials.rejected, (state, action) => {
        state.loading = false;
        state.usingMock = action.payload !== null;
        state.materials = action.payload ?? [];
        state.error = action.payload === null ? "Веб-сервис недоступен" : null;
      })

      .addCase(getSabatierMaterialFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSabatierMaterialFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.usingMock = false;
        state.feedMaterial = action.payload;
      })
      .addCase(getSabatierMaterialFeed.rejected, (state, action) => {
        state.loading = false;
        state.usingMock = action.payload != null;
        state.feedMaterial = action.payload ?? null;
        state.error = action.payload == null ? "Веб-сервис недоступен" : null;
      })

      .addCase(likeSabatierMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeSabatierMaterial.fulfilled, (state, action) => {
        state.loading = false;
        replaceMaterial(state, action.payload);
      })
      .addCase(likeSabatierMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(deleteSabatierMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSabatierMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = state.materials.filter(
          (material) => material.id !== action.payload,
        );
        if (state.feedMaterial?.id === action.payload) {
          state.feedMaterial = null;
        }
      })
      .addCase(deleteSabatierMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

export function selectMaxReactionValue(state: RootState): number {
  return state.sabatierMaterials.materials.reduce(
    (max, material) => Math.max(max, material.min_reaction_value ?? 0),
    maxReactionValueMock(),
  );
}

export const { minReactionValueChanged, materialFilterApplied, materialFilterReset } =
  sabatierMaterialsSlice.actions;

export default sabatierMaterialsSlice.reducer;
