import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const createDeadlne=createAsyncThunk(
"createDeadlne",
async({id,data},thunkAPI)=>{
  try {
    const res=await axiosInstance.post(
      `/deadline/create-deadline/${id}`,
      data
    );
toast.success(res.data.message||"Deadline updated")
    return res.data.data?.project 
      // blob only
  } catch (error) {
    toast.error(error.response.data.message||"Failed to update or create deadline")
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const deadlineSlice = createSlice({
  name: "deadline",
  initialState: {
    deadlines: [],
    nearby: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createDeadlne.fulfilled, (state, action) => {
  const updatedProject = action.payload;

  if (updatedProject?._id) {
    state.deadlines = state.deadlines.map((p) =>
      p._id === updatedProject._id ? updatedProject : p
    );
  }
});
  },
});

export default deadlineSlice.reducer;
