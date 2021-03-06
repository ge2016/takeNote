import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NotebookDetailNote from './notebook_detail_note';
import AllNotesTagLabel from './all_notes_tag_label';
import NavModal from '../modal/nav_modal';

class NotesList extends Component {
  constructor(props) {
    super(props);
    this.handleNoteClick = this.handleNoteClick.bind(this);
    this.closeTag = this.closeTag.bind(this);
  }

  componentDidMount() {
    if (this.props.notebookId) {
      // this.props.requestSingleNotebook(this.props.notebookId);
      // this.props.requestAllNotebooks();
    } else if (this.props.tagId) {
      this.props.requestSingleTag(this.props.tagId);
    } else if (this.props.match.path === '/notes/all') {
      this.props.requestAllNotes();
    } else if (this.props.match.path === '/shared_notes') {
      this.props.requestAllSharedNotes();
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.currentNote) {
      if (this.props.notes) {
        if ((this.props.notes.length > 0) && (prevProps.currentNote !== this.props.notes[0].id)) {
          this.props.setCurrentNote(this.props.notes[0].id);
        }
      }
    }

    const visibileNoteIds = [];

    if (this.props.notes && (this.props.notes.length > 0)) {
      this.props.notes.forEach(note => {
        visibileNoteIds.push(note.id);
      });

      if (!visibileNoteIds.includes(this.props.currentNote)) {
        this.props.setCurrentNote(this.props.notes[0].id);
      }
    }
  }
  
  componentWillUnmount() {
    this.props.setCurrentNote(null);
    if (this.props.match.path === '/search') {
      this.props.setSearchTerm(null);
      this.props.setSearchResults(null);
    }
  }

  handleNoteClick(note) {
    return () => {
      this.props.setCurrentNote(note.id);
    }
  }

  closeTag() {
    this.props.history.push('/notes/all');
  }

  render() {
    if (!(this.props.notes || this.props.notebook)) { return null }
    
    let pageTitle;
    let noteCount;
    
    // Set variables for tag label if viewing a tag
    let tagLabel = null;
    let tagId = this.props.tagId;
    
    if (this.props.match.path === '/tags/:tagId') {
      tagLabel = (tagId && this.props.tag) ? <AllNotesTagLabel label={this.props.tag.label} closeTag={() => this.closeTag()}/> : null;
    }

    // Set variables for notebook if viewing a notebook
    let notebookId = this.props.notebookId;
    if (notebookId && this.props.notebook) {
      pageTitle = this.props.notebook.title;
    } else if (this.props.match.path === '/search') {
      pageTitle = this.props.searchTerm;
    } else {
      pageTitle = 'All Notes';
    }
    
    noteCount = this.props.notes.length;

    const noteItems = ((this.props.notes.length > 0) && this.props.notes !== []) ? this.props.notes.map((note) => {
      return (
        <NotebookDetailNote key={note.id} note={note} handleNoteClick={this.handleNoteClick} />
      );
    }) : <div className='empty-notes-message'>
      <div className='empty-notes-subheader'>Create your first note!</div>
      <div className='empty-notes-text'>Click the + New Note button in the sidebar to get started.</div>
      </div>;

    return (
      <div className='notebook-detail-notes'>
        <div className='notebook-detail-notebook-title'>{pageTitle}</div>
        <div className='notes-subheader'>
          <div className='notebook-detail-notes-count'>{noteCount} notes</div>
          <div className='notes-sort-button'>
            <NavModal modalId={null} />
            <div className='notes-sort-button-icon' onClick={() => this.props.openNavModal('notes-sort', null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 16.793l-2.146-2.147-.708.708L8.5 18.707l3.354-3.353-.708-.708L9 16.793V5H8v11.793zM12 5h9v1h-9V5zm0 3h7v1h-7V8zm0 3h5v1h-5v-1z"></path></svg>
            </div>
          </div>
        </div>

        <div className='view-tag-label'>
          {tagLabel}
        </div>
        
        <ul className='notebook-detail-notes-list'>
          {noteItems}
        </ul>
      </div>
    );
  }
}

export default withRouter(NotesList);