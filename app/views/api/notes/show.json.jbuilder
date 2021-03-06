json.notes do
  json.set! @note.id do
    json.extract! @note, :id, :title, :content, :plain_text, :updated_at, :notebook_id, :created_at, :user_id
    json.updated_at @note.updated_at.strftime "%b %d %l:%M:%S %P"
    json.tagIds @note.taggings.pluck(:tag_id)
    json.sharedUserIds @note.shares.pluck(:user_id)
    json.sharedUserEmails @note.shared_users.pluck(:email)
    json.notebookTitle @note.notebook.title
  end
end


# json.tags do
#   @note.tags.each do |tag|
#     json.set! tag.id do
#       json.extract! tag, :id, :label
#     end
#   end
# end

# json.notebook do
#   json.set! @notebook.id do
#     json.extract! @notebook, :id, :title, :user_id, :updated_at, :created_at
#     json.noteIds @notebook.notes.pluck(:id)
#     json.updated_at @notebook.updated_at.strftime "%b %d %l:%M:%S %P"
#   end
# end

# json.notebooks do
#   json.set! @notebook.id do
#     json.extract! @notebook, :id, :title, :user_id, :updated_at
#     json.noteIds @notebook.notes.pluck(:id)
#   end
# end
