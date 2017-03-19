// @flow weak

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { createStyleSheet } from 'jss-theme-reactor';
import { easing } from '../styles/transitions';
import customPropTypes from '../utils/customPropTypes';

export const styleSheet = createStyleSheet('MuiRipple', () => ({
  ripple: {
    width: 50,
    height: 50,
    left: 0,
    top: 0,
    opacity: 0,
    position: 'absolute',
    borderRadius: '50%',
    background: 'currentColor',
  },
  rippleVisible: {
    opacity: 0.3,
    transform: 'scale(1)',
    animation: `mui-ripple-enter 550ms ${easing.easeInOut}`,
  },
  rippleFast: {
    animationDuration: '200ms',
  },
  container: {
    opacity: 1,
  },
  containerLeaving: {
    opacity: 0,
    animation: `mui-ripple-exit 550ms ${easing.easeInOut}`,
  },
  containerPulsating: {
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'block',
    width: '100%',
    height: '100%',
    animation: `mui-ripple-pulsate 1500ms ${easing.easeInOut} 200ms infinite`,
    rippleVisible: {
      opacity: 0.2,
    },
  },
  '@keyframes mui-ripple-enter': {
    '0%': {
      transform: 'scale(0)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  '@keyframes mui-ripple-exit': {
    '0%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0,
    },
  },
  '@keyframes mui-ripple-pulsate': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(0.9)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}));

export default class Ripple extends Component {
  static propTypes = {
    /**
     * The CSS class name of the root element.
     */
    className: PropTypes.string,
    pulsate: PropTypes.bool,
    rippleSize: PropTypes.number.isRequired,
    rippleX: PropTypes.number.isRequired,
    rippleY: PropTypes.number.isRequired,
  };

  static defaultProps = {
    pulsate: false,
  };

  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  };

  state = {
    rippleVisible: false,
  };

  componentWillUnmount() {
    clearTimeout(this.leaveTimer);
  }

  componentWillEnter(callback) {
    this.start(callback);
  }

  componentWillLeave(callback) {
    this.stop(() => {
      this.leaveTimer = setTimeout(() => {
        callback();
      }, 550);
    });
  }

  ripple = null;
  leaveTimer = undefined;

  start = (callback) => {
    this.setState({
      rippleVisible: true,
    }, callback);
  };

  stop = (callback) => {
    this.setState({
      rippleLeaving: true,
    }, callback);
  };

  getRippleStyles() {
    const { rippleSize, rippleX, rippleY } = this.props;

    const rippleStyles = {
      width: rippleSize,
      height: rippleSize,
      top: -(rippleSize / 2) + rippleY,
      left: -(rippleSize / 2) + rippleX,
    };

    return rippleStyles;
  }

  render() {
    const { className, pulsate } = this.props;
    const { rippleVisible, rippleLeaving } = this.state;
    const classes = this.context.styleManager.render(styleSheet);

    const rippleClassName = classNames(classes.ripple, {
      [classes.rippleVisible]: rippleVisible,
      [classes.rippleFast]: pulsate,
    }, className);

    const containerClasses = classNames(classes.container, {
      [classes.containerLeaving]: rippleLeaving,
      [classes.containerPulsating]: pulsate,
    });

    const rippleStyles = this.getRippleStyles();

    return (
      <span className={containerClasses}>
        <span className={rippleClassName} style={rippleStyles} />
      </span>
    );
  }
}