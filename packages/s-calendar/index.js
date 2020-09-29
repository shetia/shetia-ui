import SCalendar from './src/s-calendar';

/* istanbul ignore next */
SCalendar.install = function(Vue) {
  Vue.component(SCalendar.name, SCalendar);
};

export default SCalendar;