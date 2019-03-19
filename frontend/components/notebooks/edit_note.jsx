import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import { connect } from 'react-redux';
import { setCurrentNote, updateNote, createNote, requestSingleNote, receiveUpdatedNote } from '../../actions/note_actions';
import NewTagging from './new_tagging';
import NoteHeader from './note_header';
import LoadingIcon from '../notebooks/all_notes_tag_label';

class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteId: null,
      title: '',
      content: '',
      plain_text: '',
      theme: 'snow',
      toolbarVisibility: 'hidden',
      noteDelta: null,
      noteDeltaChanges: [],
      typing: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.showToolbar = this.showToolbar.bind(this);
    this.saveNote = this.saveNote.bind(this);
    this.clearSubscriptions = this.clearSubscriptions.bind(this);
  }

  showToolbar() {
    if (this.state.toolbarVisibility == 'hidden') {
      this.setState({ toolbarVisibility: 'visible' }); 
    } else {
      this.setState({ toolbarVisibility: 'hidden' });
    }
  }

  clearSubscriptions() {
    App.cable.subscriptions.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.notes) {
      if (!prevProps.notes || (prevProps.notes.id !== this.props.notes.id) || (this.state.noteId !== this.props.currentNote)) {
        this.props.requestSingleNote(this.props.currentNote).then(() => {
          this.setState({
            noteId: this.props.notes.id,
            title: this.props.notes.title,
            content: this.props.notes.content,
            plain_text: this.props.notes.plain_text
          });
        });
        
        if (this.props.currentNote) {
          if (!prevProps.currentNote || (prevProps.currentNote !== this.props.currentNote)) {
            this.clearSubscriptions();
            App.cable.subscriptions.create(
              { channel: "MessagesChannel", room: this.props.currentNote.toString() },
              {
                received: data => {
                  switch (data.type) {
                    case 'content':
                      this.setState({
                        // content: data['note'].content,
                        plain_text: data['note'].plain_text
                      });
                      break;
                    case 'title':
                      this.setState({
                        title: data['note'].title
                      });
                      break;
                  }
                    this.setState({
                      typing: data['sent_by']
                    });
                    setTimeout(() => {
                      this.setState({
                        typing: null
                      });
                    }, 1000);
                  
                  data['note']['updated_at'] = data['updated_at'];
                  data['note']['created_at'] = data['created_at'];
                  data['note']['notebookTitle'] = data['notebookTitle'];
                  this.props.receiveUpdatedNote({notes: { [data['noteId']]: data['note'] } });
                },
                updateContent: function (data) {
                  return this.perform("update_content", data);
                },
                updateTitle: function (data) {
                  return this.perform("update_title", data);
                }
              }
            );
            
          }
        }

      }
    }
  }

  componentWillUnmount() {
    this.props.setCurrentNote(null);
    this.clearSubscriptions();
  }

  handleChange(field) {
    return (e) => {
      return this.setState({ [field]: e.currentTarget.value });
    }
  }

  handleTitleChange() {
    return (e) => {
      this.setState({
        title: e.currentTarget.value
      });
      App.cable.subscriptions.subscriptions[0].updateTitle({ userId: this.props.currentId, noteId: this.props.currentNote, title: e.currentTarget.value });
    }
  }

  handleEditorChange(html, delta, source, editor) {
    if (source === 'user') {
      let noteDeltaChanges = this.state.noteDeltaChanges;
      noteDeltaChanges.push(this.editor.lastDeltaChangeSet);
      this.editor.editor.setContents(delta);

      this.setState({
        content: html,
        plain_text: editor.getText().trim(),
        noteDelta: editor.getContents(),
        noteDeltaChanges: noteDeltaChanges
      });
      App.cable.subscriptions.subscriptions[0].updateContent({ userId: this.props.currentId, noteId: this.props.currentNote, content: html, plain_text: this.state.plain_text });
    } else { 
      return null;
    }
  }

  saveNote() {
    const note = Object.assign({}, { id: this.props.currentNote, title: this.state.title, content: this.state.content, plain_text: this.state.plain_text });
    this.props.updateNote(note);
  }

  handleSubmit(e) {
    e.preventDefault();
    const note = Object.assign({}, { id: this.props.currentNote, title: this.state.title, content: this.state.content, plain_text: this.state.plain_text });
    this.props.updateNote(note);
  }

  render() {
    if ((!this.props.notes) || (Object.values(this.props.notes).length === 0)) {
      return (
        <div className='note-edit'></div>
      );
    }

    let saveButtonDisabled = true;
    
    if (this.props.currentNote) {
      saveButtonDisabled = false;
    }

    let toolbar;

    if (this.state.toolbarVisibility === 'hidden') {
      toolbar = [];
    } else {
      toolbar = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
  
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
  
        [{ 'size': [] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image', 'video', 'formula'],
  
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
  
        ['clean']                                         // remove formatting button
      ];
    }
    
    const loadingIcon = this.props.loading ? <LoadingIcon /> : null;

    const whoIsTyping = this.state.typing ? 
      <div className='current-user-typing-container'>
        <div className='current-user-typing-content'>
          {`${this.state.typing} is typing...`}
        </div>
      </div>
    : null;

    return (
      <div className='note-edit'>
      {whoIsTyping}

      {loadingIcon}

      <NoteHeader note={this.props.notes}/>

        <div className='note-edit-container'>
          <div className='note-form' onMouseEnter={(e) => this.showToolbar(e)} onMouseLeave={() => this.showToolbar()}>
            <form className='note-edit-form' onSubmit={(e) => this.handleSubmit(e)}>
              <div className='edit-submit-button'>
                {/* <input className='form-button' type='submit' value='Save' disabled={saveButtonDisabled}/> */}
              </div>
              <input className='edit-form-title-input' required id='noteTitle' placeholder='Title' type='text' value={this.state.title} onChange={this.handleTitleChange()} />
            </form>
          <div className='app'>
            <div className='quill-container'>
              <ReactQuill value={this.state.content}
                onChange={this.handleEditorChange}
                // onFocus={this.showToolbar}
                theme={this.state.theme}
                modules={{ toolbar }}
                placeholder={'New note...'}
                ref={ editor => { this.editor = editor; }} />
            </div>
            </div>
          </div>
        </div>
        
        <div className='note-taggings'>
          <NewTagging />
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => {
  const currentId = state.session.id;
  const currentUser = state.entities.users[currentId] || null;

  return ({
    notes: state.entities.notes[state.ui.currentNote],
    defaultNotebook: currentUser.default_notebook,
    currentNote: state.ui.currentNote,
    loading: state.ui.loading,
    currentId
  });
}

const mapDispatchToProps = dispatch => {
  return ({
    requestSingleNote: noteId => dispatch(requestSingleNote(noteId)),
    setCurrentNote: noteId => dispatch(setCurrentNote(noteId)),
    updateNote: note => dispatch(updateNote(note)),
    createNote: note => dispatch(createNote(note)),
    receiveUpdatedNote: note => dispatch(receiveUpdatedNote(note))
  });
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditNote));