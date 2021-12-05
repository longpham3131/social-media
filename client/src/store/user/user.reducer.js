import {
  GET_USER_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  GET_MY_PROFILE,
  FRIEND_REQUEST_SUCCESS,
  GET_FRIEND_REQUEST_SUCCESS,
  UNFRIEND_SUCCESS,
  GET_IMAGE_USE_SUCCESS
} from "./user.constant";

const initialState = {
  profile: {},
  myProfile: {},
  friendsRequest: [],
  imagesUser: [],
};
export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_PROFILE:
      return { ...state, profile: payload.data };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: payload.data };
    case GET_MY_PROFILE:
      return {
        ...state,
        myProfile: payload.data,
        friendsRequest: payload.data.friendsRequest,
      };
    case FRIEND_REQUEST_SUCCESS:
      let newFriendsRequest = { ...state.profile };
      if (payload.type == 0) {
        newFriendsRequest.friendsRequest = state.profile.friendsRequest.filter(
          (e) => e.user._id != payload.user._id
        );
      }
      if (payload.type == 1)
        newFriendsRequest.friendsRequest = [
          ...state.profile.friendsRequest,
          payload,
        ];
      return { ...state, profile: newFriendsRequest };
    case GET_FRIEND_REQUEST_SUCCESS:
      return { ...state, friendsRequest: payload.data };
    case UNFRIEND_SUCCESS:
      let newProfile = { ...state.profile };
      newProfile.friends = newProfile.friends.filter(
        (e) => e.user._id !== state.myProfile._id
      );
      return { ...state, profile: newProfile };
    case GET_IMAGE_USE_SUCCESS:
      return { ...state, imagesUser: payload.data };
    default:
      return state;
  }
};
