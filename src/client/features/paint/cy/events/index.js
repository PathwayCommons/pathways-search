import bindHover from './hover';
import bindExpandCollapse from './expandCollapse';

const bindEvents = (cy) => {
  bindHover(cy);
  bindExpandCollapse(cy);
};

export default bindEvents;