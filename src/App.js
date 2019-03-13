import React, { Component } from 'react';
import axios from 'axios';

import Button from './components/Button/Button';
import Loading from './components/Loading/Loading';
import NavBar from './components/NavBar/NavBar';
import Search from './components/Search/Search';
import Table from './components/Table/Table';

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
      <div>
        <NavBar />
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
      </div>
    );
  }
}
 
export default App;

export { Button, Search, Table };