// import React from 'react'
//
// let el = <div></div>
//
// el.positions = { right: void 0, left: void 0}
//
// export default el

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DrawerLayoutAndroid
 */
'use strict';

import React, { Component } from 'react'


// import autobind from 'autobind-decorator';
// import dismissKeyboard from 'react-native-dismiss-keyboard';
import {
  dismissKeyboard,
  Animated,
  Dimensions,
  InteractionManager,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

console.log('luciene')

// const {
//   Animated,
//   Dimensions,
//   InteractionManager,
//   PanResponder,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   View,
// } = ReactNative;

const {
  PropTypes,
} = React;

const DEVICE_WIDTH = parseFloat(Dimensions.get('window').width);
const THRESHOLD = DEVICE_WIDTH / 2;
const VX_MAX = 0.1;

const IDLE = 'Idle';
const DRAGGING = 'Dragging';
const SETTLING = 'Settling';

export default class DrawerLayout extends React.Component {

  static defaultProps = {
    drawerWidth: 0,
    drawerPosition: 'left',
  };

  static positions = {
    Left: 'left',
    Right: 'right',
  };

  static propTypes = {
    children: PropTypes.node,
    drawerBackgroundColor: PropTypes.string,
    drawerLockMode: PropTypes.oneOf(['unlocked', 'locked-closed', 'locked-open']),
    drawerPosition: PropTypes.oneOf(['left', 'right']).isRequired,
    drawerWidth: PropTypes.number.isRequired,
    keyboardDismissMode: PropTypes.oneOf(['none', 'on-drag']),
    onDrawerClose: PropTypes.func,
    onDrawerOpen: PropTypes.func,
    onDrawerSlide: PropTypes.func,
    onDrawerStateChanged: PropTypes.func,
    renderNavigationView: PropTypes.func.isRequired,
    statusBarBackgroundColor: PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);

    this.interactionHandle = null;

    this.state = {
      openValue: new Animated.Value(0),
      drawerShown: false,
    };


    ;(this: any).openDrawer = this.openDrawer.bind(this)
    ;(this: any).closeDrawer = this.closeDrawer.bind(this)

    ;(this: any)._onOverlayClick = this._onOverlayClick.bind(this)
    ;(this: any)._handleDrawerOpen = this._handleDrawerOpen.bind(this)
    ;(this: any)._handleDrawerClose = this._handleDrawerClose.bind(this)
    ;(this: any)._shouldSetPanResponder = this._shouldSetPanResponder.bind(this)
    ;(this: any)._panResponderGrant = this._panResponderGrant.bind(this)
    ;(this: any)._panResponderRelease = this._panResponderRelease.bind(this)

  }

  componentWillMount() {
    const { openValue } = this.state;

    openValue.addListener(({ value }) => {
      const drawerShown = value > 0;
      if (drawerShown !== this.state.drawerShown) {
        this.setState({ drawerShown });
      }

      if (this.props.keyboardDismissMode === 'on-drag') {
        dismissKeyboard();
      }

      if (value === 0 || value === 1) {
        if (this.interactionHandle) {
          InteractionManager.clearInteractionHandle(this.interactionHandle);
          this.interactionHandle = undefined;
        }
      } else if (!this.interactionHandle) {
        this.interactionHandle = InteractionManager.createInteractionHandle();
      }

      this._lastOpenValue = value;
      if (this.props.onDrawerSlide) {
        this.props.onDrawerSlide({ nativeEvent: { offset: value } });
      }
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._shouldSetPanResponder,
      onPanResponderGrant: this._panResponderGrant,
      onPanResponderMove: this._panResponderMove,
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: this._panResponderRelease,
      onPanResponderTerminate: () => { },
    });
  }

  render() {
    const {
      drawerShown,
      openValue,
    } = this.state;

    const {
      drawerBackgroundColor,
      drawerPosition,
      drawerWidth,
    } = this.props;

    const dynamicDrawerStyles = {
      backgroundColor: drawerBackgroundColor,
    };
    dynamicDrawerStyles[drawerPosition] = 0;
    dynamicDrawerStyles.width = drawerWidth;

    /* Drawer styles */
    let outputRange;

    if (drawerPosition === 'left') {
      outputRange = [-drawerWidth, 0];
    } else {
      outputRange = [drawerWidth, 0];
    }

    const drawerTranslateX = openValue.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: 'clamp',
    });
    const animatedDrawerStyles = { transform: [{ translateX: drawerTranslateX }] };

    /* Overlay styles */
    const overlayOpacity = openValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
      extrapolate: 'clamp',
    });
    const animatedOverlayStyles = { opacity: overlayOpacity };

    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }} {...this._panResponder.panHandlers}>
        <Animated.View style={styles.main}>
          {this.props.children}
        </Animated.View>

        {drawerShown &&
          <TouchableWithoutFeedback onPress={this._onOverlayClick}>
            <Animated.View
              style={[styles.overlay, animatedOverlayStyles]} />
          </TouchableWithoutFeedback>
        }
        <Animated.View style={[styles.drawer, dynamicDrawerStyles, animatedDrawerStyles]}>
          {this.props.renderNavigationView()}
        </Animated.View>
      </View>
    );
  }

  // @autobind
  _onOverlayClick(e) {
    e.stopPropagation();
    if (!this._isLockedClosed() && !this._isLockedOpen()) {
      this.closeDrawer();
    }
  }

  _emitStateChanged(newState) {
    if (this.props.onDrawerStateChanged) {
      this.props.onDrawerStateChanged(newState);
    }
  }

  // @autobind
  openDrawer(options = {}) {
    this._emitStateChanged(SETTLING);
    Animated.spring(this.state.openValue, { toValue: 1, bounciness: 0, restSpeedThreshold: 0.1, ...options }).start(() => {
      if (this.props.onDrawerOpen) {
        this.props.onDrawerOpen();
      }
      this._emitStateChanged(IDLE);
    });
  }

  // @autobind
  closeDrawer(options = {}) {
    this._emitStateChanged(SETTLING);
    Animated.spring(this.state.openValue, { toValue: 0, bounciness: 0, restSpeedThreshold: 1, ...options }).start(() => {
      if (this.props.onDrawerClose) {
        this.props.onDrawerClose();
      }
      this._emitStateChanged(IDLE);
    });
  }

  // @autobind
  _handleDrawerOpen() {
    if (this.props.onDrawerOpen) {
      this.props.onDrawerOpen();
    }
  }

  // @autobind
  _handleDrawerClose() {
    if (this.props.onDrawerClose) {
      this.props.onDrawerClose();
    }
  }

  // @autobind
  _shouldSetPanResponder(e, { moveX, dx, dy }) {
    const { drawerPosition } = this.props;

    if (this._isLockedClosed() || this._isLockedOpen()) {
      return false;
    }

    if (drawerPosition === 'left') {
      const overlayArea = DEVICE_WIDTH - (DEVICE_WIDTH - this.props.drawerWidth);

      if (this._lastOpenValue === 1) {
        if ((dx < 0 && (Math.abs(dx) > (Math.abs(dy) * 3))) || (moveX > overlayArea)) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX <= 35 && dx > 0) {
          this._isClosing = false;
          return true;
        }

        return false;
      }
    } else {
      const overlayArea = DEVICE_WIDTH - this.props.drawerWidth;

      if (this._lastOpenValue === 1) {
        if ((dx > 0 && (Math.abs(dx) > (Math.abs(dy) * 3))) || (moveX < overlayArea)) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX >= DEVICE_WIDTH - 35 && dx < 0) {
          this._isClosing = false;
          return true;
        }

        return false;
      }
    }
  }

  // @autobind
  _panResponderGrant() {
    this._emitStateChanged(DRAGGING);
  }

  // @autobind
  _panResponderMove(e, { moveX }) {
    let openValue = this._getOpenValueForX(moveX);

    if (this._isClosing) {
      openValue = 1 - (this._closingAnchorValue - openValue);
    }

    if (openValue > 1) {
      openValue = 1;
    } else if (openValue < 0) {
      openValue = 0;
    }

    this.state.openValue.setValue(openValue);
  }

  // @autobind
  _panResponderRelease(e, { moveX, vx }) {
    const { drawerPosition } = this.props;
    const previouslyOpen = this._isClosing;
    const isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;

    if (drawerPosition === 'left') {
      if ((vx > 0 && moveX > THRESHOLD) || (vx >= VX_MAX) || isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD) {
        this.openDrawer({ velocity: vx });
      } else if ((vx < 0 && moveX < THRESHOLD) || (vx < -VX_MAX) || isWithinVelocityThreshold && !previouslyOpen) {
        this.closeDrawer({ velocity: vx });
      } else if (previouslyOpen) {
        this.openDrawer();
      } else {
        this.closeDrawer();
      }
    }

    if (drawerPosition === 'right') {
      if ((vx < 0 && moveX < THRESHOLD) || (vx <= -VX_MAX) || isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD) {
        this.openDrawer({ velocity: -1 * vx });
      } else if ((vx > 0 && moveX > THRESHOLD) || (vx > VX_MAX) || isWithinVelocityThreshold && !previouslyOpen) {
        this.closeDrawer({ velocity: -1 * vx });
      } else if (previouslyOpen) {
        this.openDrawer();
      } else {
        this.closeDrawer();
      }
    }
  }

  _isLockedClosed() {
    return this.props.drawerLockMode === 'locked-closed' && !this.state.drawerShown;
  }

  _isLockedOpen() {
    return this.props.drawerLockMode === 'locked-open' && this.state.drawerShown;
  }

  _getOpenValueForX(x) {
    const { drawerPosition, drawerWidth } = this.props;

    if (drawerPosition === 'left') {
      return x / drawerWidth;
    } else if (drawerPosition === 'right') {
      return (DEVICE_WIDTH - x) / drawerWidth;
    }
  }
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  main: {
    flex: 1,
  },
  overlay: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});


// import ReactNative, {
//   ColorPropType, NativeMethodsMixin, Platform, StatusBar, StyleSheet,
//   UIManager, View, dismissKeyboard, requireNativeComponent
// } from 'react-native'
//
// // var ColorPropType = require('ColorPropType');
// // var NativeMethodsMixin = require('NativeMethodsMixin');
// // var Platform = require('Platform');
// // var React = require('React');
// // var ReactNative = require('ReactNative');
// // var StatusBar = require('StatusBar');
// // var StyleSheet = require('StyleSheet');
// // var UIManager = require('UIManager');
// // var View = require('View');
//
// console.log('daadssdsa', UIManager)
//
// var DrawerConsts = UIManager.AndroidDrawerLayout.Constants;
//
// // var dismissKeyboard = require('dismissKeyboard');
// // var requireNativeComponent = require('requireNativeComponent');
//
// var ReactPropTypes = React.PropTypes;
//
// var RK_DRAWER_REF = 'drawerlayout';
// var INNERVIEW_REF = 'innerView';
//
// var DRAWER_STATES = [
//   'Idle',
//   'Dragging',
//   'Settling',
// ];
//
// /**
//  * React component that wraps the platform `DrawerLayout` (Android only). The
//  * Drawer (typically used for navigation) is rendered with `renderNavigationView`
//  * and direct children are the main view (where your content goes). The navigation
//  * view is initially not visible on the screen, but can be pulled in from the
//  * side of the window specified by the `drawerPosition` prop and its width can
//  * be set by the `drawerWidth` prop.
//  *
//  * Example:
//  *
//  * ```
//  * render: function() {
//  *   var navigationView = (
//  *     <View style={{flex: 1, backgroundColor: '#fff'}}>
//  *       <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
//  *     </View>
//  *   );
//  *   return (
//  *     <DrawerLayoutAndroid
//  *       drawerWidth={300}
//  *       drawerPosition={DrawerLayoutAndroid.positions.Left}
//  *       renderNavigationView={() => navigationView}>
//  *       <View style={{flex: 1, alignItems: 'center'}}>
//  *         <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
//  *         <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
//  *       </View>
//  *     </DrawerLayoutAndroid>
//  *   );
//  * },
//  * ```
//  */
// var DrawerLayoutAndroid = React.createClass({
//   statics: {
//     positions: DrawerConsts.DrawerPosition,
//   },
//
//   propTypes: {
//     ...View.propTypes,
//     /**
//      * Determines whether the keyboard gets dismissed in response to a drag.
//      *   - 'none' (the default), drags do not dismiss the keyboard.
//      *   - 'on-drag', the keyboard is dismissed when a drag begins.
//      */
//     keyboardDismissMode: ReactPropTypes.oneOf([
//       'none', // default
//       'on-drag',
//     ]),
//     /**
//      * Specifies the background color of the drawer. The default value is white.
//      * If you want to set the opacity of the drawer, use rgba. Example:
//      *
//      * ```
//      * return (
//      *   <DrawerLayoutAndroid drawerBackgroundColor="rgba(0,0,0,0.5)">
//      *   </DrawerLayoutAndroid>
//      * );
//      * ```
//      */
//     drawerBackgroundColor: ColorPropType,
//     /**
//      * Specifies the side of the screen from which the drawer will slide in.
//      */
//     drawerPosition: ReactPropTypes.oneOf([
//       DrawerConsts.DrawerPosition.Left,
//       DrawerConsts.DrawerPosition.Right
//     ]),
//     /**
//      * Specifies the width of the drawer, more precisely the width of the view that be pulled in
//      * from the edge of the window.
//      */
//     drawerWidth: ReactPropTypes.number,
//     /**
//      * Specifies the lock mode of the drawer. The drawer can be locked in 3 states:
//      * - unlocked (default), meaning that the drawer will respond (open/close) to touch gestures.
//      * - locked-closed, meaning that the drawer will stay closed and not respond to gestures.
//      * - locked-open, meaning that the drawer will stay opened and not respond to gestures.
//      * The drawer may still be opened and closed programmatically (`openDrawer`/`closeDrawer`).
//      */
//     drawerLockMode: ReactPropTypes.oneOf([
//       'unlocked',
//       'locked-closed',
//       'locked-open'
//     ]),
//     /**
//      * Function called whenever there is an interaction with the navigation view.
//      */
//     onDrawerSlide: ReactPropTypes.func,
//     /**
//      * Function called when the drawer state has changed. The drawer can be in 3 states:
//      * - idle, meaning there is no interaction with the navigation view happening at the time
//      * - dragging, meaning there is currently an interaction with the navigation view
//      * - settling, meaning that there was an interaction with the navigation view, and the
//      * navigation view is now finishing its closing or opening animation
//      */
//     onDrawerStateChanged: ReactPropTypes.func,
//     /**
//      * Function called whenever the navigation view has been opened.
//      */
//     onDrawerOpen: ReactPropTypes.func,
//     /**
//      * Function called whenever the navigation view has been closed.
//      */
//     onDrawerClose: ReactPropTypes.func,
//     /**
//      * The navigation view that will be rendered to the side of the screen and can be pulled in.
//      */
//     renderNavigationView: ReactPropTypes.func.isRequired,
//
//     /**
//      * Make the drawer take the entire screen and draw the background of the
//      * status bar to allow it to open over the status bar. It will only have an
//      * effect on API 21+.
//      */
//     statusBarBackgroundColor: ColorPropType,
//   },
//
//   // mixins: [NativeMethodsMixin],
//
//   getDefaultProps: function(): Object {
//     return {
//       drawerBackgroundColor: 'white',
//     };
//   },
//
//   getInitialState: function() {
//     return { statusBarBackgroundColor: undefined };
//   },
//
//   getInnerViewNode: function() {
//     return this.refs[INNERVIEW_REF].getInnerViewNode();
//   },
//
//   componentDidMount: function() {
//     this._updateStatusBarBackground();
//   },
//
//   componentDidReceiveProps: function() {
//     this._updateStatusBarBackground();
//   },
//
//   render: function() {
//     var drawStatusBar = Platform.Version >= 21 && this.props.statusBarBackgroundColor;
//     var drawerViewWrapper =
//       <View
//         style={[
//           styles.drawerSubview,
//           { width: this.props.drawerWidth, backgroundColor: this.props.drawerBackgroundColor }
//         ]}
//         collapsable={false}>
//         {this.props.renderNavigationView()}
//         {drawStatusBar && <View style={styles.drawerStatusBar} />}
//       </View>;
//     var childrenWrapper =
//       <View ref={INNERVIEW_REF} style={styles.mainSubview} collapsable={false}>
//         {drawStatusBar &&
//         <StatusBar
//           translucent
//           backgroundColor={this.state.statusBarBackgroundColor}
//         />}
//         {drawStatusBar &&
//         <View style={[
//           styles.statusBar,
//           {backgroundColor: this.props.statusBarBackgroundColor}
//         ]} />}
//         {this.props.children}
//       </View>;
//     return (
//       <AndroidDrawerLayout
//         {...this.props}
//         ref={RK_DRAWER_REF}
//         drawerWidth={this.props.drawerWidth}
//         drawerPosition={this.props.drawerPosition}
//         drawerLockMode={this.props.drawerLockMode}
//         style={[styles.base, this.props.style]}
//         onDrawerSlide={this._onDrawerSlide}
//         onDrawerOpen={this._onDrawerOpen}
//         onDrawerClose={this._onDrawerClose}
//         onDrawerStateChanged={this._onDrawerStateChanged}>
//         {childrenWrapper}
//         {drawerViewWrapper}
//       </AndroidDrawerLayout>
//     );
//   },
//
//   _onDrawerSlide: function(event) {
//     if (this.props.onDrawerSlide) {
//       this.props.onDrawerSlide(event);
//     }
//     if (this.props.keyboardDismissMode === 'on-drag') {
//       dismissKeyboard();
//     }
//   },
//
//   _onDrawerOpen: function() {
//     if (this.props.onDrawerOpen) {
//       this.props.onDrawerOpen();
//     }
//   },
//
//   _onDrawerClose: function() {
//     if (this.props.onDrawerClose) {
//       this.props.onDrawerClose();
//     }
//   },
//
//   _onDrawerStateChanged: function(event) {
//     if (this.props.onDrawerStateChanged) {
//       this.props.onDrawerStateChanged(DRAWER_STATES[event.nativeEvent.drawerState]);
//     }
//   },
//
//   /**
//    * Opens the drawer.
//    */
//   openDrawer: function() {
//     UIManager.dispatchViewManagerCommand(
//       this._getDrawerLayoutHandle(),
//       UIManager.AndroidDrawerLayout.Commands.openDrawer,
//       null
//     );
//   },
//
//   /**
//    * Closes the drawer.
//    */
//   closeDrawer: function() {
//     UIManager.dispatchViewManagerCommand(
//       this._getDrawerLayoutHandle(),
//       UIManager.AndroidDrawerLayout.Commands.closeDrawer,
//       null
//     );
//   },
//
//   _getDrawerLayoutHandle: function() {
//     return ReactNative.findNodeHandle(this.refs[RK_DRAWER_REF]);
//   },
//
//   // Update the StatusBar component background color one frame after creating the
//   // status bar background View to avoid a white flicker that happens because
//   // the StatusBar background becomes transparent before the status bar View
//   // from this component has rendered.
//   _updateStatusBarBackground: function() {
//     if (Platform.Version >= 21 && this.props.statusBarBackgroundColor) {
//       // Check if the value is not already transparent to avoid an extra render.
//       if (this.state.statusBarBackgroundColor !== 'transparent') {
//         requestAnimationFrame(() => {
//           this.setState({statusBarBackgroundColor: 'transparent'});
//         });
//       }
//     } else {
//       this.setState({statusBarBackgroundColor: undefined});
//     }
//   },
// });
//
// var styles = StyleSheet.create({
//   base: {
//     flex: 1,
//     // elevation: 16, // maybe use z-index and some shadow thing
//   },
//   mainSubview: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   drawerSubview: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//   },
//   statusBar: {
//     height: StatusBar.currentHeight,
//   },
//   drawerStatusBar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: StatusBar.currentHeight,
//     backgroundColor: 'rgba(0, 0, 0, 0.251)',
//   },
// });
//
// // The View that contains both the actual drawer and the main view
// // var AndroidDrawerLayout = requireNativeComponent('AndroidDrawerLayout', DrawerLayoutAndroid);
// class AndroidDrawerLayout extends Component {
//   render () {
//     console.log(this, this.props)
//     return <View />
//   }
// }
//
// // requireNativeComponent('AndroidDrawerLayout', DrawerLayoutAndroid);
//
// module.exports = DrawerLayoutAndroid;
