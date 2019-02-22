import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import NavModal from '../modal/nav_modal';
import { Link } from 'react-router-dom';
import { openNavModal, closeNavModal } from '../../actions/modal_actions';
import { requestAllNotebooks } from '../../actions/notebook_actions';

class NoteHeader extends Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
  }

  openModal(noteId) {
    this.props.openNavModal('note-header-nav', noteId);
  }

  render() {

    let noteNotebookId;
    let title;

    if (!this.props.currentNote) { return null; }
    // if (!(this.props.currentNote || (Object.values(this.props.notes).length > 0) || (Object.values(this.props.notebooks).length > 0) || this.props.match.params.notebookId)) { return null; } 
    
    noteNotebookId = this.props.defaultNotebook;
    title = 'Fix this';

    // if (Object.values(this.props.notebooks).length === 0) { return null; }
    // if (Object.values(this.props.notes).length === 0) {
    //   noteNotebookId = this.props.defaultNotebook;
    //   title = 'Default notebook title goes here'; 
    // }
    // if (!this.props.match.params.notebookId) {
    //   noteNotebookId = this.props.notes[this.props.currentNote].notebook_id;
    //   title = this.props.notes[this.props.currentNote].notebookTitle;
    // } else {
    //   noteNotebookId = parseInt(this.props.match.params.notebookId);
    //   title = this.props.notebooks[noteNotebookId].title;
    // }

    // if (!(noteNotebookId && title)) { return null; }

    return (
      <div className='note-header'>
        <div className='current-notebook'>
          <div className='current-notebook-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill="#000" fillRule="nonzero" d="M3 2v10h7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3zM2 1h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2V1zm2 1v10h1V2H4zm2 3v1h4V5H6z"></path></svg>
          </div>
          {/* <div className='current-notebook-title'><Link to={`/notebooks/${noteNotebookId}`}>{title}</Link></div> */}
          <div className='current-notebook-title'><Link to={`/notebooks/${noteNotebookId}`}>{title}</Link></div>
        </div>

        <div className='note-actions-menu'>
          <NavModal modalId={this.props.currentNote}/>
          <div className='note-actions-icon' onClick={() => this.openModal(this.props.currentNote)}><svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  
  const currentId = state.session.id;
  const currentUser = state.entities.users[currentId] || null;

  return ({
    currentNote: state.ui.currentNote,
    notes: state.entities.notes,
    notebooks: state.entities.notebooks,
    defaultNotebook: currentUser.default_notebook
  });
}

const mapDispatchToProps = dispatch => {
  return ({
    openNavModal: (navModal, navModalId) => dispatch(openNavModal(navModal, navModalId)),
    requestAllNotebooks: () => dispatch(requestAllNotebooks())
  });
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NoteHeader));
