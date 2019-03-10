import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'react';

const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

// function isSearched(searchTerm) {
//   return function (item) {
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
        .then(response => response.json())
        .then(result => this.setSearchTopStories(result))
        .catch(error => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  onDismiss(id) {
    console.log('ID = ', id);
    const isNotId = item => item.objectID !== id;
    const updatedHits= this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: Object.assign({}, this.state.result, { hits: updatedHits })
    }); 
  }

  render() {
    
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;

    if (!result) { return null;}

    return (
      <div className="container-fluid">
        <Search  value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Hackernews API</Search>
        { result && <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss} /> }
        <div className="blah my-4">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page +1)} className="btn btn-info">More articles...</Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => {
  return (
    <div className="row mt-4">

        <div className="col-sm-12">
          
          <h1>{children}</h1>

          <form className="form-inline my-4" onSubmit={onSubmit}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label className="input-group-text" for="searchtext">Search for articles about</label>
              </div>
              <input type="text" className="form-control" onChange={onChange} value={value} 
                placeholder="Enter filter text here" aria-label="searchTerm" id="searchtext" />
              <div className="input-group-append">
                <button type="submit" className="btn btn-success">FIND</button>
              </div>
            </div>
          </form>

        </div>
      </div>
  );
}
 

const Table = ({ list , onDismiss })  => {
  return (
    <div className="row mt-4">
      {list.map(item =>
        <div key={item.objectID} className="col-sm-3 mb-3">
          <div className="card">
            <div className="card-header"><a href={item.url}>{item.title}</a></div>
            <div className="card-body">
              <p><small className="text-info">Author:</small> { item.author}<br /><small className="text-info">Comments:</small> {item.num_comments} | <small className="text-info">Points:</small> {item.points}</p>
            </div>
            <div className="card-footer px-4">
              <Button onClick={() => onDismiss(item.objectID)}  className="btn btn-sm btn-warning">Remove</Button>
            </div>
          </div>
        </div>
    )}
    </div>
  );
}

const Button =({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={className} type='button'>{children}</button>
  );
}

export default App;