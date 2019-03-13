import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

   
const Table = ({ list , onDismiss })  => 
<div className="row my-4">
  <div className="col-sm-12 pb-2 mb-4 border-bottom">No. of articles: <span className="badge badge-info">{list.length}</span> </div>
  {list.map((item, index ) =>
    <div key={item.objectID} className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
      <div className="card">
        <div className="card-header"><small className="badge badge-primary pull-left mr-2 mt-1">{ index+1 }</small> <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></div>
        <div className="card-body">
          <p><small className="text-info">Author:</small> { item.author}<br />
          <small className="text-info">Comments:</small> {item.num_comments} | <small className="text-info">Points:</small> {item.points} |<br />
          <small className="text-info">Relevancy:</small> {item.relevancy_score}</p>
        </div>
        <div className="card-footer px-4">
          <Button onClick={() => onDismiss(item.objectID)}  className="btn btn-sm btn-warning">Remove</Button>
        </div>
      </div>
    </div>
)}
</div>

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

export default Table;