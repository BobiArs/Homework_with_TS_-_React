import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Priority } from "./tasksSlice";

//Слайс для фільтрів
export type StatusFilter = "all" | "completed" | "active";

interface FiltersState {
  searchQuery: string;
  category: string; // 'all' або конкретна категорія
  priority: "all" | Priority;
  status: StatusFilter;
}

const initialState: FiltersState = {
  searchQuery: "",
  category: "all",
  priority: "all",
  status: "all",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<"all" | Priority>) => {
      state.priority = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.status = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearchQuery,
  setCategoryFilter,
  setPriorityFilter,
  setStatusFilter,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
