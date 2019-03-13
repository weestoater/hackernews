import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, {
    shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Button from './Button';

Enzyme.configure({
    adapter: new Adapter()
});


describe('Button -> ', () => {

            it('renders without crashing', () => {
                    const div = document.createElement('div');
                    ReactDOM.render( <Button>More articles... </Button> , div);
                        ReactDOM.unmountComponentAtNode(div);
                    });

                test('has a valid snapshot', () => {
                        const component = renderer.create( <Button> More articles... </Button>);
                            const tree = component.toJSON(); expect(tree).toMatchSnapshot();
                        });

                });