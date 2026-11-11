import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import type { SabatierMaterialOut } from "../api/Api";

interface MaterialDraftState {
  draftMaterial: SabatierMaterialOut | null;
  loading: boolean;
  error: string | null;
}

const initialState: MaterialDraftState = {
  draftMaterial: null,
  loading: false,
  error: null,
};

export const getSabatierMaterialDraft = createAsyncThunk<SabatierMaterialOut | null>(
  "materialDraft/getSabatierMaterialDraft",
  async () => {
    try {
      const response = await api.sabatierMaterials.getSabatierMaterialDraft();
      return response.data;
    } catch {
      return null;
    }
  },
);

export const createSabatierMaterial = createAsyncThunk<
  SabatierMaterialOut,
  { materialName: string; materialImage: File | null; materialVideo: File | null },
  { rejectValue: string }
>(
  "materialDraft/createSabatierMaterial",
  async ({ materialName, materialImage, materialVideo }, { rejectWithValue }) => {
    try {
      const response = await api.sabatierMaterials.createSabatierMaterial({
        material_name: materialName,
        ...(materialImage === null ? {} : { material_image: materialImage }),
        ...(materialVideo === null ? {} : { material_video: materialVideo }),
      });
      return response.data;
    } catch {
      return rejectWithValue("Черновик не создан: нужна аутентификация");
    }
  },
);

export const publishSabatierMaterial = createAsyncThunk<
  SabatierMaterialOut,
  {
    materialId: number;
    materialDescription: string;
    minReactionValue: number;
    molarMass: number;
  },
  { rejectValue: string }
>(
  "materialDraft/publishSabatierMaterial",
  async (
    { materialId, materialDescription, minReactionValue, molarMass },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.sabatierMaterials.publishSabatierMaterial(materialId, {
        material_description: materialDescription,
        min_reaction_value: minReactionValue,
        molar_mass: molarMass,
      });
      return response.data;
    } catch {
      return rejectWithValue("Материал не опубликован: проверьте поля черновика");
    }
  },
);

export const deleteSabatierMaterialDraft = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("materialDraft/deleteSabatierMaterialDraft", async (materialId, { rejectWithValue }) => {
  try {
    await api.sabatierMaterials.deleteSabatierMaterial(materialId);
  } catch {
    return rejectWithValue("Черновик не удалён");
  }
});

const materialDraftSlice = createSlice({
  name: "materialDraft",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSabatierMaterialDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSabatierMaterialDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.draftMaterial = action.payload;
      })

      .addCase(createSabatierMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSabatierMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.draftMaterial = action.payload;
      })
      .addCase(createSabatierMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(publishSabatierMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishSabatierMaterial.fulfilled, (state) => {
        state.loading = false;
        state.draftMaterial = null;
      })
      .addCase(publishSabatierMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })

      .addCase(deleteSabatierMaterialDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSabatierMaterialDraft.fulfilled, (state) => {
        state.loading = false;
        state.draftMaterial = null;
      })
      .addCase(deleteSabatierMaterialDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

export default materialDraftSlice.reducer;
