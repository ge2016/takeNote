export const fetchAllTags = () => {
  return $.ajax({
    method: 'get',
    url: `/api/tags`
  });
}

export const fetchSingleTag = (id) => {
  return $.ajax({
    method: 'get',
    url: `/api/notes/${id}`
  });
}

export const createTag = (tag) => {
  return $.ajax({
    method: 'post',
    url: '/api/tags',
    data: { tag }
  });
}

export const deleteTag = (id) => {
  return $.ajax({
    method: 'delete',
    url: `/api/tags/${id}`
  });
}

export const updateTag = (tag) => {
  return $.ajax({
    method: 'patch',
    url: `/api/tags/${tag.id}`,
    data: { tag }
  });
}