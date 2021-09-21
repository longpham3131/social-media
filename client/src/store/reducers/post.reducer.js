import {
  CREATE_POST_SUCCESS,
  CREATE_POST_FAIL,
  EDIT_POST_SUCCESS,
  EDIT_POST_FAIL,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAIL,
  GET_POST_LIST,
} from "store/constants/post.constant";

const initialState = {
  postList: {},
  createPost: {},
  editPost: {},
  deletePost: {},
};

export const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_POST_LIST:
      return { ...state, postList: payload };
    //CREATE
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        createPost: payload,
        postList: {
          ...state.postList,
          data: [payload.data.data, ...state.postList.data],
        },
      };
    case CREATE_POST_FAIL:
      return {
        ...state,
        createPost: payload,
      };
    //EDIT
    case EDIT_POST_SUCCESS:
      return {
        ...state,
        createPost: payload,
        postList: {
          ...state.postList,
          data: [payload.data.data, ...state.postList.data],
        },
      };
    case EDIT_POST_FAIL:
      return {
        ...state,
        editPost: payload,
      };
    //DELETE
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        deletePost: payload,
        postList: {
          ...state.postList,
          data: state.postList.data.filter(
            (post) => post._id !== payload.data.postId
          ),
        },
      };
    case DELETE_POST_FAIL:
      return {
        ...state,
        deletePost: payload,
      };
    default:
      return state;
  }
};
