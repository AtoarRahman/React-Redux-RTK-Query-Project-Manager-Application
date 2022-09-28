const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    search: "",
};

const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        searched: (state, action) => {
            state.search = action.payload;
        },
        searchRemoved: (state, action) => {
            state.search = "";
        }
    },
});

export default filterSlice.reducer;
export const { searched, searchRemoved } = filterSlice.actions;