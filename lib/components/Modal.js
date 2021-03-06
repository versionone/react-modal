var React = require('react');
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');
var ModalPortal = React.createFactory(require('./ModalPortal'));
var ariaAppHider = require('../helpers/ariaAppHider');
var injectCSS = require('../helpers/injectCSS');

var SafeHTMLElement = ExecutionEnvironment.canUseDOM ? window.HTMLElement : {};
var AppElement = ExecutionEnvironment.canUseDOM ? document.body : {appendChild: function() {}};

var Modal = module.exports = React.createClass({

  displayName: 'Modal',

  statics: {
    setAppElement: function(element) {
      AppElement = ariaAppHider.setElement(element);
    },
    injectCSS: injectCSS
  },

  propTypes: {
    isOpen: React.PropTypes.bool.isRequired,
    onRequestClose: React.PropTypes.func,
    appElement: React.PropTypes.instanceOf(SafeHTMLElement),
    closeTimeoutMS: React.PropTypes.number,
    ariaHideApp: React.PropTypes.bool,
    className: React.PropTypes.string,
    position: React.PropTypes.shape({
      my: React.PropTypes.string,
      at: React.PropTypes.string,
      of: React.PropTypes.any.isRequired,
      collision: React.PropTypes.string
    }),
    focusChild: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      isOpen: false,
      ariaHideApp: true,
      closeTimeoutMS: 0,
      disableOnClickOutside: true,
      className: 'fill',
      position: null,
      focusChild: null
    };
  },

  componentDidMount: function() {
    this.node = document.createElement('div');
    this.node.className = 'ReactModalPortal';
    AppElement.appendChild(this.node);
    this.renderPortal(this.props);
  },

  componentWillReceiveProps: function(newProps) {
    this.renderPortal(newProps);
  },

  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.node);
    AppElement.removeChild(this.node);
  },

  renderPortal: function(props) {
    if (props.ariaHideApp) {
      ariaAppHider.toggle(props.isOpen, props.appElement);
    }
    sanitizeProps(props);
    if (this.portal)
      this.portal.setProps(props);
    else
      this.portal = React.render(ModalPortal(props), this.node);
  },

  render: function () {
    return null;
  }
});

function sanitizeProps(props) {
  delete props.ref;
}
