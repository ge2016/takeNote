import * as TagAPIUtil from '../util/tag_api_util';

export const RECEIVE_ALL_TAGS = 'RECEIVE_ALL_TAGS';
export const RECEIVE_SINGLE_TAG = 'RECEIVE_SINGLE_TAG';
export const REMOVE_TAG = 'REMOVE_TAG';
export const RECEIVE_TAG_ERRORS = 'RECEIVE_TAG_ERRORS';

export const receiveAllTags = (payload) => {
  return ({
    type: RECEIVE_ALL_TAGS,
    payload
  })
}

export const requestAllTags = () => {
  return (dispatch) => {
    return TagAPIUtil.fetchAllTags().then((tags) => {
      return dispatch(receiveAllTags(tags));
    },
      (err) => {
        return dispatch(receiveTagErrors(err.responseJSON));
    });
  }
}

export const receiveSingleTag = payload => {
  return ({
    type: RECEIVE_SINGLE_TAG,
    payload
  });
}

export const requestSingleTag = (tagId) => {
  return (dispatch) => {
    return TagAPIUtil.fetchSingleTag(tagId).then((payload) => {
      return dispatch(receiveSingleTag(payload));
    },
      (err) => {
        return dispatch(receiveTagErrors(err.responseJSON));
      });
  }
}

export const createTag = (tag) => {
  return (dispatch) => {
    return TagAPIUtil.createTag(tag).then((tag) => {
      return dispatch(receiveSingleTag(tag));
    },
      (err) => {
        return dispatch(receiveTagErrors(err.responseJSON));
      });
  }
}

export const updateTag = (tag) => {
  return (dispatch) => {
    return TagAPIUtil.updateTag(tag).then((tag) => {
      return dispatch(receiveSingleTag(tag));
    },
      (err) => {
        return dispatch(receiveTagErrors(err.responseJSON));
      });
  }
}

export const deleteTag = (tagId) => {
  return (dispatch) => {
    return TagAPIUtil.deleteTag(tagId).then(() => {
      return dispatch(removeTag(tagId));
    },
      (err) => {
        return dispatch(receiveTagErrors(err.responseJSON));
      });
  }
}

export const receiveTagErrors = (errors) => {
  return ({
    type: RECEIVE_TAG_ERRORS,
    errors
  });
}

export const removeTag = (tagId) => {
  return ({
    type: REMOVE_TAG,
    tagId
  });
}

// export const requestTaggings = (tagId) => {
//   return (dispatch) => {
//     return TagAPIUtil.fetchTaggings(tagId).then((tags) => {
//       return dispatch(receiveAllTags(tags));
//     },
//       (err) => {
//         return dispatch(receiveTagErrors(err.responseJSON));
//       });
//   }
// }