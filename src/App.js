import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const DEFAULT_QUERY = 'react';
const DEFAULT_HPP = '8';

const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  
  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits =[
      ...oldHits,
      ...hits
    ];

    this.setState({ 
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page} 
      },
      isLoading: false
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
      this.setState({ isLoading: true });
      axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(result => this._isMounted && this.setSearchTopStories(result.data))
        .catch(error => this._isMounted && this.setState({ error}));
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits= hits.filter(isNotId);

    this.setState({ 
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    }); 
  }

  render() {
    
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    const page =  ( results && results[searchKey] && results[searchKey].page) || 0;
    const list = ( results && results[searchKey] && results[searchKey].hits ) || [];

    return (
      <div className="container-fluid">
        <Search  value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Hackernews Search</Search>
        { error 
        ? <div className="alert alert-danger">Something has gone wrong.  ({error.message})</div>
        :  <div>
        { isLoading 
          ? <Loading /> 
          : <div>
            <Button onClick={() => this.fetchSearchTopStories(searchKey, page +1)} className="btn btn-info my-4">More articles...</Button> 
            <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} /> 
            <Button onClick={() => this.fetchSearchTopStories(searchKey, page +1)} className="btn btn-info my-4">More articles...</Button>
            </div>
        }
           </div>
        }
      </div>
    );
  }
}

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
 
const Table = ({ list , onDismiss })  => 
    <div className="row my-4">
      <div className="col-sm-12 pb-2 mb-4 border-bottom">No. of articles: <span className="badge badge-info">{list.length}</span> </div>
      {list.map((item, index ) =>
        <div key={item.objectID} className="col-sm-3 mb-3">
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
  
const Button =({ 
  onClick, 
  className, 
  children }) => 
    <button onClick={onClick} className={className} type='button'>{children}</button>

Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Loading = () => 
<div className="text-center alert alert-success py-4 text-success m-2">
  <div className="spinner-border" role="status">
    <span className="sr-only">Loading...</span>
  </div>
  <br /><h3 className="text-success">Loading...</h3>
</div>
  
export default App;

export { Button, Search, Table };