import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isCreateStudentModalOpen: false,
    isCreateTeacherModalOpen: false,
  },
  reducers: {
    toggleStudentModal: (state) => {
      state.isCreateStudentModalOpen = !state.isCreateStudentModalOpen;
    },
    toggleTeacherModal: (state) => {
      state.isCreateTeacherModalOpen = !state.isCreateTeacherModalOpen;
    },
  },
});
export const { toggleStudentModal, toggleTeacherModal } = popupSlice.actions;
export default popupSlice.reducer;
