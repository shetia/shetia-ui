import SPdf from './src/s-pdf';

/* istanbul ignore next */
SPdf.install = function(Vue) {
  Vue.component(SPdf.name, SPdf);
};

export default SPdf;