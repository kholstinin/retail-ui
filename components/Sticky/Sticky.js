/* @flow */

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

import LayoutEvents from '../../lib/LayoutEvents';

import styles from './Sticky.less';

export default class Sticky extends React.Component {
  static propTypes = {
    side: PropTypes.oneOf(['top', 'bottom']).isRequired,
  };

  state: {
    fixed: bool,
    height: (number | string),
    left: (number | string),
    width: (number | string),
  };

  _wrapper: HTMLElement;
  _inner: HTMLElement;

  _layoutSubscription: {remove: () => void};

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      fixed: false,
      height: 'auto',
      left: 'auto',
      width: 'auto',
    };
  }

  render() {
    let wrapperStyle = null;
    let innerStyle = null;
    if (this.state.fixed) {
      wrapperStyle = {
        height: this.state.height
      };

      innerStyle = ({
        left: this.state.left,
        position: 'fixed',
        width: this.state.width,
      }: Object);

      if (this.props.side === 'top') {
        innerStyle.top = 0;
      } else {
        innerStyle.bottom = 0;
      }
    }

    return (
      <div style={wrapperStyle} ref={(ref) => this._wrapper = ref}>
        <div style={innerStyle} ref={(ref) => this._inner = ref}>
          {this.props.children}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this._reflow();

    this._layoutSubscription = LayoutEvents.addListener(() => this._reflow());
  }

  componentWillUnmount() {
    this._layoutSubscription.remove();
  }

  // $FlowIssue 850
  _reflow = () => {
    const wrapRect = this._wrapper.getBoundingClientRect();
    const wrapBottom = wrapRect.bottom;
    const wrapLeft = wrapRect.left;
    const wrapTop = wrapRect.top;
    const fixed = this.props.side === 'top'
      ? wrapTop < 0
      : wrapBottom > window.innerHeight;

    this.setState({fixed});

    if (fixed) {
      const width = this._wrapper.offsetWidth;
      this.setState({width, left: wrapLeft}, () => {
        const height = this._inner.offsetHeight;
        this.setState({height});
      });
    }
  };
}