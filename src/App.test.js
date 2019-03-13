import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import App, { Search, Button } from './App';

describe('react App -> ', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render( <App / > , div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Search -> ', () => {

    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render( <Search>Hackernews Search</Search> , div);
      ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
      const component = renderer.create(<Search>Hackernews Search</Search>);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  
});

describe('Button -> ', () => {

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render( <Button>More articles...</Button> , div);
  ReactDOM.unmountComponentAtNode(div);
});

test('has a valid snapshot', () => {
  const component = renderer.create(<Button>More articles...</Button>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

});