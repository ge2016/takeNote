import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class LeftNavNotebooks extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.requestAllNotebooks();
  }

  render() {
    if (!this.props.showNotebooks) { return null; }

    const notebooks = this.props.notebooks ? Object.keys(this.props.notebooks).map(notebookId => this.props.notebooks[notebookId]) : null;

    const notebookItems = notebooks ? notebooks.map((notebook, idx) => {
      return (
        <div className='left-nav-notebooks-item' key={idx} onClick={() => this.props.history.push(`/notebooks/${notebook.id}`)}>
          <div className='left-nav-notebooks-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" className='notebooks-expanded-icon-svg'><path id="71a" d="M3 2v10h7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3zM2 1h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2V1zm2 1v10h1V2H4zm2 3v1h4V5H6z"></path></svg>
          </div>
          <div className='left-nav-notebooks-title'>{notebook.title}</div>
        </div>
      )
    }) : null;

    return (
      <div className='notebooks-expanded'>
        {notebookItems}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return ({
    notebooks: state.entities.notebooks,
    showNotebooks: ownProps.showNotebooks
  });
}

const mapDispatchToProps = dispatch => {
  return ({
    requestAllNotebooks: () => dispatch(requestAllNotebooks()),
  });
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftNavNotebooks));