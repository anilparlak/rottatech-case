import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (_, { getState, requestId }) => {
    const { postsRequestId, postsLoading } = getState().posts;
    if (!postsLoading || requestId !== postsRequestId) {
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/posts`);
      return response?.data;
    } catch (error) {
      console.log("error");
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (req, { getState, requestId }) => {
    const { addPostRequestId, addPostLoading } = getState().posts;
    console.log("req",req)
    if (!addPostLoading || requestId !== addPostRequestId) {
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/posts`, {
        ...req
      },
      {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
      );
      return response?.data;
    } catch (error) {
      console.log("error");
    }
  }
);

const initialState = {
  // getPosts
  posts: [],
  postsLoading: false,
  postsError: false,
  postsRequestId: undefined,

  // addPost
  addPost: null,
  addPostLoading: false,
  addPostError: false,
  addPostRequestId: undefined
};

const slice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => (
        post?.id !== action?.payload
      ))
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state, action) => {
        if (!state.postsLoading) {
          state.postsLoading = true;
          state.postsError = false;
          state.postsRequestId = action?.meta?.requestId;
        }
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        const { requestId } = action?.meta;
        state.postsError = false;
        if (state.postsRequestId === requestId && !!state.postsLoading) {
          state.postsLoading = false;
          state.posts = action?.payload;
        }
      })
      .addCase(getPosts.rejected, (state) => {
        state.postsLoading = false;
        state.postsError = true;
        state.posts = null;
      })

      .addCase(createPost.pending, (state, action) => {
        if (!state.addPostLoading) {
          state.addPostLoading = true;
          state.addPostError = false;
          state.addPostRequestId = action?.meta?.requestId;
        }
      })
      .addCase(createPost.fulfilled, (state, action) => {
        const { requestId } = action?.meta;
        state.addPostError = false;
        if (state.addPostRequestId === requestId && !!state.addPostLoading) {
          state.addPostLoading = false;
          state.posts.unshift(action?.payload);
        }
      })
      .addCase(createPost.rejected, (state) => {
        state.addPostLoading = false;
        state.addPostError = true;
        state.addPost = null;
      })
  },
});

export default slice.reducer;
export const {deletePost} = slice.actions;
