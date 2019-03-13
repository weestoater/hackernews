import React from 'react';

const Search = ({ 
    value, 
    onChange, 
    onSubmit, 
    children }) => {
      let input;
      return (
        <div className="row mt-4">
          <div className="col-sm-3">
            <h1>{children}</h1>
            </div>
            <div className="col-sm-9">
            <form className="form-inline my-4" onSubmit={onSubmit}>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="searchtext">Find articles on</label>
                </div>
                <input type="text" className="form-control" onChange={onChange} value={value}  placeholder="Enter search here" aria-label="searchTerm" id="searchtext" />
                <div className="input-group-append"><button type="submit" className="btn btn-success">FIND</button></div>
              </div>
            </form>
          </div>
        </div>
      );
  }

  export default Search;