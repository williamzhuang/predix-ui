import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'core-js/es6/map';
import 'core-js/es6/set';

import 'raf/polyfill';

//import React from 'react';
//import ReactDOM from 'react-dom';

configure({ adapter: new Adapter() });

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};