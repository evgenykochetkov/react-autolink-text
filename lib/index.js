'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _match_parser = require('./match_parser');

var _match_parser2 = _interopRequireDefault(_match_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AutoLinkText = function (_PureComponent) {
  _inherits(AutoLinkText, _PureComponent);

  function AutoLinkText() {
    _classCallCheck(this, AutoLinkText);

    return _possibleConstructorReturn(this, (AutoLinkText.__proto__ || Object.getPrototypeOf(AutoLinkText)).apply(this, arguments));
  }

  _createClass(AutoLinkText, [{
    key: 'prepareElements',
    value: function prepareElements(matches, text) {
      var linkProps = this.props.linkProps;

      var elements = [];
      var lastIndex = 0;

      matches.forEach(function (match) {
        if (match.position.start !== 0) {
          elements.push(_react2.default.createElement('span', {}, text.slice(lastIndex, match.position.start)));
        }
        elements.push(_react2.default.createElement('a', Object.assign({}, { href: match.getAnchorHref() }, linkProps), match.getAnchorText()));
        lastIndex = match.position.end;
      });

      if (lastIndex < text.length) {
        elements.push(_react2.default.createElement('span', {}, text.slice(lastIndex)));
      }

      return elements;
    }
  }, {
    key: 'truncate',
    value: function truncate(items) {
      var _this2 = this;

      if (!this.props.maxLength) return items;

      var elements = [];
      var length = 0;

      items.some(function (el) {
        length += el.props.children.length;

        if (length > _this2.props.maxLength) {
          var truncatedText = el.props.children.slice(0, -(length - _this2.props.maxLength));
          elements.push(_react2.default.cloneElement(el, {}, truncatedText));
          return true; // stop iterating through the elements
        }

        elements.push(el);
      });

      return elements;
    }

    /*
     * Generate unique keys for each of the elements.
     * The key will be based on the index of the element.
     */

  }, {
    key: 'keyElements',
    value: function keyElements(elements) {
      return elements.map(function (el, index) {
        return _react2.default.cloneElement(el, { key: index });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var text = this.props.text || '';

      var keyedElements = this.keyElements(this.truncate(this.prepareElements((0, _match_parser2.default)(text), text)));

      return _react2.default.createElement('span', {}, keyedElements);
    }
  }]);

  return AutoLinkText;
}(_react.PureComponent);

exports.default = AutoLinkText;


AutoLinkText.propTypes = {
  text: _propTypes2.default.string,
  linkProps: _propTypes2.default.object,
  maxLength: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};