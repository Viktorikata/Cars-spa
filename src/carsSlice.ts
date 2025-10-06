import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { api } from "./api";
import type { Car, SortKey, SortOrder } from "./types";
import type { RootState } from "./store";


type CarsState = {
  items: Car[];
  loading: boolean;
  error: string | null;
  sortKey: SortKey;
  sortOrder: SortOrder;
  editingId: number | null; 
};

const initialState: CarsState = {
  items: [],
  loading: false,
  error: null,
  sortKey: null,
  sortOrder: "asc",
  editingId: null,
};

export const fetchCars = createAsyncThunk<Car[]>("cars/fetch", async () => {
  const { data } = await api.get<Car[]>("/cars");
  return data;
});

export const createCar = createAsyncThunk(
  "cars/create",
  async (car: Omit<Car, "id">, { getState }) => {
    const state = getState() as RootState;

    const maxId = Math.max(...state.cars.items.map(c => Number(c.id) || 0));

    const newCar = { ...car, id: maxId + 1 };

    const { data } = await api.post("/cars", newCar);
    return data;
  }
);

export const updateCar = createAsyncThunk<Car, Car>(
  "cars/update",
  async (car) => {
    const { data } = await api.put<Car>(`/cars/${car.id}`, car);
    return data;
  }
);

export const deleteCar = createAsyncThunk<number, number>(
  "cars/delete",
  async (id) => {
    await api.delete(`/cars/${id}`);
    return id;
  }
);

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<SortKey>) {
      const key = action.payload;
      if (state.sortKey === key) {
        state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = key;
        state.sortOrder = "asc";
      }
    },
    setEditingId(state, action: PayloadAction<number | null>) {
      state.editingId = action.payload;
    },
    applyInlineEdit(
      state,
      action: PayloadAction<{ id: number; name?: string; price?: number }>
    ) {
      const { id, name, price } = action.payload;
      const idx = state.items.findIndex((c) => c.id === id);
      if (idx >= 0) {
        if (typeof name !== "undefined") state.items[idx].name = name;
        if (typeof price !== "undefined") state.items[idx].price = price;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchCars.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to fetch";
      })
      .addCase(createCar.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })
      .addCase(updateCar.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex((c) => c.id === payload.id);
        if (idx >= 0) state.items[idx] = payload;
      })
      .addCase(deleteCar.fulfilled, (state, { payload: id }) => {
        state.items = state.items.filter((c) => c.id !== id);
      });
  },
});

export const { setSort, setEditingId, applyInlineEdit } = carsSlice.actions;
export default carsSlice.reducer;
