import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Manager from './Manager';
import {createId} from './utils/func';
import { updateHash, removeHash } from './utils/hash';

export default class ScrollableSection extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.array
    ]),
    name: PropTypes.string,
    hash: PropTypes.string,
    onEnter: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.name = (props.name || '').replace(/^\//, '') || null;
    this.hash = (props.hash || '').replace(/^\#/, '') || props.children.ref || null;
    this.meta = props.meta || null;
    this.id = createId({name: this.name, hash: this.hash});
  }

  componentDidMount() {
    const element = ReactDOM.findDOMNode(this.refs[Object.keys(this.refs)[0]]);

    Manager.addAnchor({
      element,
      name: this.name,
      hash: this.hash,
      exact: !!this.props.exact,
      id: this.id,
      meta: this.meta
    });
  }

  componentWillUnmount() {
    Manager.removeAnchor(this.id);
  }

  render() {
    const {children, name, hash, title, formatTitle, ...props} = this.props;

    if (Array.isArray(children)) {
      return (
        <div ref={this.id} {...props}>
          {React.Children.map(children, child => (
            React.cloneElement(child, {})
          ))}
        </div>
      )
    }

    return React.cloneElement(children, {
      ref: children.ref || this.id,
      ...props
    });

  }
}

ScrollableSection.defaultProps = {
 
};


export class ScrollableLink extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { href } = this.props;

    if (href && href !== '/' && href !== '#') {
      const pathParts = href.split('#');
      const name = pathParts[0].replace(/^\//, '') || null;
      const hash = pathParts[1] || null;
      const id = createId({name, hash});

      if (Manager.anchors[id]) {
        updateHash({
          anchor: Manager.anchors[id],
          affectHistory: false,
          manager: Manager
        });

        Manager.goToSection(id);
      }
    } else {
      removeHash({manager: Manager});
    }
  }

  render() {
    const { children } = this.props;

    if (Array.isArray(children)) {
      return (
        <span onClick={this.handleClick}>
          {React.Children.map(children, child => (
            React.cloneElement(child, {})
          ))}
        </span>
      )
    }

    return React.cloneElement(children, {
      onClick: this.handleClick
    });

  }
}
