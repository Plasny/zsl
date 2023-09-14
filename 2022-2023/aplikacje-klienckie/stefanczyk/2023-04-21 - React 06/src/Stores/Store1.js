import { configureStore } from '@reduxjs/toolkit';
// import { createSlice } from '@reduxjs/toolkit';
import counterReducer from '../Slices/Slice1';

export default configureStore({
    reducer: {
        // testValue: createSlice({
        //     name: 'value description',
        //     initialState: {
        //         value: 1234,
        //     }
        // }).reducer
        counter: counterReducer
    },
});
