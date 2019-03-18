import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme,  { shallow } from 'enzyme';
import Adapter from  'enzyme-adapter-react-16';
import App, { Table } from './App';

Enzyme.configure({ adapter: new Adapter() });

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

describe('Table -> ', () => {
  
  const props = {
    list: [
      {title: '1', author: '1', num_comments: 1, points: 2, relevancy_score: 123, objectID: 'y'},
      {title: '2', author: '2', num_comments: 2, points: 4, relevancy_score: 456, objectID: 'z'},
    ],
  };

  it('shows two items in a list', () => {
    const element = shallow(
      <Table { ...props} />
    );
    expect(element.find('.card').length).toBe(2);
  });

});