import React from 'react';
import NavModal from '../modal/nav_modal';
import { Link } from 'react-router-dom';

const TagItem = (props) => {

  let tagLabel;
  let printLetter;

  if (!props.tag) {
    return null;
  } else {

    if (props.tag.label.length > 12) {
      tagLabel = props.tag.label.substring(0, 12) + ' ...';
    } else {
      tagLabel = props.tag.label;
    }

    if (props.idx === 0) {
      printLetter = <div>{props.tag.label.substring(0,1)}</div>;
    }
    
    return (
      <>
        {printLetter}
        <div className={`tag-item-button tag${props.tag.id}`}>
          <div className='tag-item-button-label'>
            <Link to={`/tags/${props.tag.id}`}>{tagLabel}</Link>
          </div>
          <div className='tag-item-button-arrow' onClick={() => props.openNavModal(props.tag.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" className="arrow-facing-down"><path fill="none" d="M7 2L4 5 1 2"></path></svg>
          </div>
        </div>
          <NavModal modalId={props.tag.id} />
      </>
    );
  }
}

export default TagItem;