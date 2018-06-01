/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

//这组控件执行轨道运动，放大（缩放）和平移。
//与TrackballControls不同，它保持“向上”方向object.up（默认情况下为+ Y）。
//
//轨道 - 鼠标左键/触摸：单指移动
//缩放 - 中鼠标，或鼠标滚轮/触摸：双指扩展或挤压
//泛 - 右键，或箭头键/触摸：双指移动

THREE.OrbitControls = function(object, domElement) {

    this.object = object;

    this.domElement = (domElement !== undefined) ? domElement : document;

    //设置为false以禁用此控件
    this.enabled = true;

    //“target”设置焦点的位置，对象绕过的位置
    this.target = new THREE.Vector3();

    //您可以进出多远（仅适用于PerspectiveCamera）
    this.minDistance = 0;
    this.maxDistance = Infinity;

    //您可以放大或缩小多少（仅限OrthographicCamera）
    this.minZoom = 0;
    this.maxZoom = Infinity;

    //你可以垂直绕行多远，上限和下限。
    //范围从0到Math.PI弧度。
    this.minPolarAngle = 0; // 弧度
    this.maxPolarAngle = Math.PI; // 弧度

    //你可以绕水平方向运行多远，上限和下限。
    //如果设置，则必须是区间[ - Math.PI，Math.PI]的子区间。
    this.minAzimuthAngle = -Infinity; // 弧度
    this.maxAzimuthAngle = Infinity; // 弧度

    //设置为true以启用阻尼（惯性）
    //如果启用阻尼，则必须在动画循环中调用controls.update（）
    this.enableDamping = false;
    this.dampingFactor = 0.25;

    //这个选项实际上可以使进出进入; 为了向后兼容，保留为“缩放”。
         //设置为false以禁用缩放
    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    //设置为false以禁用旋转
    this.enableRotate = true;
    this.rotateSpeed = 1.0;

    //设置为false以禁用平移
    this.enablePan = true;
    this.panSpeed = 1.0;
    this.screenSpacePanning = false; //如果为true，则在屏幕空间中平移
    this.keyPanSpeed = 7.0; //按箭头按键移动像素

    //设置为true以自动围绕目标旋转
    //如果启用自动旋转，则必须在动画循环中调用controls.update（）
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; //当fps为60时，每轮30秒

    //设置为false以禁用键的使用
    this.enableKeys = true;

    //四个箭头键
    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

    //鼠标按钮
    this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

    //重置
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;

    //
    //公共方法
    //
    /**获得极地角度 */
    this.getPolarAngle = function() {

        return spherical.phi;

    };

    /**获得方位角 */
    this.getAzimuthalAngle = function() {

        return spherical.theta;

    };

    /**保存状态 */
    this.saveState = function() {

        scope.target0.copy(scope.target);
        scope.position0.copy(scope.object.position);
        scope.zoom0 = scope.object.zoom;

    };

    /**重启 */
    this.reset = function() {

        scope.target.copy(scope.target0);
        scope.object.position.copy(scope.position0);
        scope.object.zoom = scope.zoom0;

        scope.object.updateProjectionMatrix();
        scope.dispatchEvent(changeEvent);

        scope.update();

        state = STATE.NONE;

    };

    // 这种方法是暴露的，但也许它会更好，如果我们可以使它私人...
    this.update = function() {

        var offset = new THREE.Vector3();

        // 所以camera.up是轨道轴
        var quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
        var quatInverse = quat.clone().inverse();

        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();

        return function update() {

            var position = scope.object.position;

            offset.copy(position).sub(scope.target);

            // 将偏移量旋转到“y轴向上”空间
            offset.applyQuaternion(quat);

            // 从z轴绕y轴的角度
            spherical.setFromVector3(offset);

            if (scope.autoRotate && state === STATE.NONE) {

                rotateLeft(getAutoRotationAngle());

            }

            spherical.theta += sphericalDelta.theta;
            spherical.phi += sphericalDelta.phi;

            // 将θ限制在期望的限制之间
            spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));

            //限制phi在期望的限制之间
            spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));

            spherical.makeSafe();


            spherical.radius *= scale;

            //将半径限制在期望的限制之间
            spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

            // 将目标移动到平移位置
            scope.target.add(panOffset);

            offset.setFromSpherical(spherical);

            //将偏移量旋转回“camera-up-vector-is-up”空间
            offset.applyQuaternion(quatInverse);

            position.copy(scope.target).add(offset);

            scope.object.lookAt(scope.target);

            if (scope.enableDamping === true) {

                sphericalDelta.theta *= (1 - scope.dampingFactor);
                sphericalDelta.phi *= (1 - scope.dampingFactor);

                panOffset.multiplyScalar(1 - scope.dampingFactor);

            } else {

                sphericalDelta.set(0, 0, 0);

                panOffset.set(0, 0, 0);

            }

            scale = 1;

            //更新条件是：
            // min（相机位移，相机以弧度旋转）^ 2> EPS
            //使用小角度逼近cos（x / 2）= 1 - x ^ 2/8
            if (zoomChanged ||
                lastPosition.distanceToSquared(scope.object.position) > EPS ||
                8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {

                scope.dispatchEvent(changeEvent);

                lastPosition.copy(scope.object.position);
                lastQuaternion.copy(scope.object.quaternion);
                zoomChanged = false;

                return true;

            }

            return false;

        };

    }();

    this.dispose = function() {

        scope.domElement.removeEventListener('contextmenu', onContextMenu, false);
        scope.domElement.removeEventListener('mousedown', onMouseDown, false);
        scope.domElement.removeEventListener('wheel', onMouseWheel, false);

        scope.domElement.removeEventListener('touchstart', onTouchStart, false);
        scope.domElement.removeEventListener('touchend', onTouchEnd, false);
        scope.domElement.removeEventListener('touchmove', onTouchMove, false);

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);

        window.removeEventListener('keydown', onKeyDown, false);

        //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

    };

    //
    // 内部
    //

    var scope = this;

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start' };
    var endEvent = { type: 'end' };

    var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 };

    var state = STATE.NONE;

    var EPS = 0.000001;

    // 球坐标中的当前位置
    var spherical = new THREE.Spherical();
    var sphericalDelta = new THREE.Spherical();

    var scale = 1;
    var panOffset = new THREE.Vector3();
    var zoomChanged = false;

    var rotateStart = new THREE.Vector2();
    var rotateEnd = new THREE.Vector2();
    var rotateDelta = new THREE.Vector2();

    var panStart = new THREE.Vector2();
    var panEnd = new THREE.Vector2();
    var panDelta = new THREE.Vector2();

    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();

    /**获得自动旋转角度 */
    function getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

    }

    /**设置缩放比例 */
    function getZoomScale() {

        return Math.pow(0.95, scope.zoomSpeed);

    }

    /**向左旋转 */
    function rotateLeft(angle) {

        sphericalDelta.theta -= angle;

    }

    /**向右旋转 */
    function rotateUp(angle) {

        sphericalDelta.phi -= angle;

    }

    /**平移左 */
    var panLeft = function() {

        var v = new THREE.Vector3();

        return function panLeft(distance, objectMatrix) {

            v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
            v.multiplyScalar(-distance);

            panOffset.add(v);

        };

    }();

    /**平移上 */
    var panUp = function() {

        var v = new THREE.Vector3();

        return function panUp(distance, objectMatrix) {

            if (scope.screenSpacePanning === true) {

                v.setFromMatrixColumn(objectMatrix, 1);

            } else {

                v.setFromMatrixColumn(objectMatrix, 0);
                v.crossVectors(scope.object.up, v);

            }

            v.multiplyScalar(distance);

            panOffset.add(v);

        };

    }();

    // deltaX和deltaY以像素为单位; 右和下正方向
    var pan = function() {

        var offset = new THREE.Vector3();

        return function pan(deltaX, deltaY) {

            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

            if (scope.object.isPerspectiveCamera) {

                // 透视
                var position = scope.object.position;
                offset.copy(position).sub(scope.target);
                var targetDistance = offset.length();

                // fov的一半是屏幕顶部的中心
                targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);

                // 我们在这里只使用clientHeight，因此纵横比不会扭曲速度
                panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
                panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);

            } else if (scope.object.isOrthographicCamera) {

                // 正交
                panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);

            } else {

                // 相机既不是正交也不是透视
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                scope.enablePan = false;

            }

        };

    }();

    function dollyIn(dollyScale) {

        if (scope.object.isPerspectiveCamera) {

            scale /= dollyScale;

        } else if (scope.object.isOrthographicCamera) {

            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom * dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;

        } else {

            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;

        }

    }

    function dollyOut(dollyScale) {

        if (scope.object.isPerspectiveCamera) {

            scale *= dollyScale;

        } else if (scope.object.isOrthographicCamera) {

            scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
            scope.object.updateProjectionMatrix();
            zoomChanged = true;

        } else {

            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            scope.enableZoom = false;

        }

    }

    //
    //事件回调 - 更新对象状态
    //

    function handleMouseDownRotate(event) {

        //console.log( 'handleMouseDownRotate' );

        rotateStart.set(event.clientX, event.clientY);

    }

    function handleMouseDownDolly(event) {

        //console.log( 'handleMouseDownDolly' );

        dollyStart.set(event.clientX, event.clientY);

    }

    function handleMouseDownPan(event) {

        //console.log( 'handleMouseDownPan' );

        panStart.set(event.clientX, event.clientY);

    }

    function handleMouseMoveRotate(event) {

        //console.log( 'handleMouseMoveRotate' );

        rotateEnd.set(event.clientX, event.clientY);

        rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height

        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);

        rotateStart.copy(rotateEnd);

        scope.update();

    }

    function handleMouseMoveDolly(event) {

        //console.log( 'handleMouseMoveDolly' );

        dollyEnd.set(event.clientX, event.clientY);

        dollyDelta.subVectors(dollyEnd, dollyStart);

        if (dollyDelta.y > 0) {

            dollyIn(getZoomScale());

        } else if (dollyDelta.y < 0) {

            dollyOut(getZoomScale());

        }

        dollyStart.copy(dollyEnd);

        scope.update();

    }

    function handleMouseMovePan(event) {

        //console.log( 'handleMouseMovePan' );

        panEnd.set(event.clientX, event.clientY);

        panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);

        pan(panDelta.x, panDelta.y);

        panStart.copy(panEnd);

        scope.update();

    }

    function handleMouseUp(event) {

        // console.log( 'handleMouseUp' );

    }

    function handleMouseWheel(event) {

        // console.log( 'handleMouseWheel' );

        if (event.deltaY < 0) {

            dollyOut(getZoomScale());

        } else if (event.deltaY > 0) {

            dollyIn(getZoomScale());

        }

        scope.update();

    }

    function handleKeyDown(event) {

        //console.log( 'handleKeyDown' );

        switch (event.keyCode) {

            case scope.keys.UP:
                pan(0, scope.keyPanSpeed);
                scope.update();
                break;

            case scope.keys.BOTTOM:
                pan(0, -scope.keyPanSpeed);
                scope.update();
                break;

            case scope.keys.LEFT:
                pan(scope.keyPanSpeed, 0);
                scope.update();
                break;

            case scope.keys.RIGHT:
                pan(-scope.keyPanSpeed, 0);
                scope.update();
                break;

        }

    }

    function handleTouchStartRotate(event) {

        //console.log( 'handleTouchStartRotate' );

        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);

    }

    function handleTouchStartDollyPan(event) {

        //console.log( 'handleTouchStartDollyPan' );

        if (scope.enableZoom) {

            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;

            var distance = Math.sqrt(dx * dx + dy * dy);

            dollyStart.set(0, distance);

        }

        if (scope.enablePan) {

            var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
            var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

            panStart.set(x, y);

        }

    }

    function handleTouchMoveRotate(event) {

        //console.log( 'handleTouchMoveRotate' );

        rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);

        rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

        var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height

        rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);

        rotateStart.copy(rotateEnd);

        scope.update();

    }

    function handleTouchMoveDollyPan(event) {

        //console.log( 'handleTouchMoveDollyPan' );

        if (scope.enableZoom) {

            var dx = event.touches[0].pageX - event.touches[1].pageX;
            var dy = event.touches[0].pageY - event.touches[1].pageY;

            var distance = Math.sqrt(dx * dx + dy * dy);

            dollyEnd.set(0, distance);

            dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));

            dollyIn(dollyDelta.y);

            dollyStart.copy(dollyEnd);

        }

        if (scope.enablePan) {

            var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
            var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

            panEnd.set(x, y);

            panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);

            pan(panDelta.x, panDelta.y);

            panStart.copy(panEnd);

        }

        scope.update();

    }

    function handleTouchEnd(event) {

        //console.log( 'handleTouchEnd' );

    }

    //
    // event handlers - FSM: listen for events and reset state
    //

    function onMouseDown(event) {

        if (scope.enabled === false) return;

        event.preventDefault();

        switch (event.button) {

            case scope.mouseButtons.ORBIT:

                if (scope.enableRotate === false) return;

                handleMouseDownRotate(event);

                state = STATE.ROTATE;

                break;

            case scope.mouseButtons.ZOOM:

                if (scope.enableZoom === false) return;

                handleMouseDownDolly(event);

                state = STATE.DOLLY;

                break;

            case scope.mouseButtons.PAN:

                if (scope.enablePan === false) return;

                handleMouseDownPan(event);

                state = STATE.PAN;

                break;

        }

        if (state !== STATE.NONE) {

            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('mouseup', onMouseUp, false);

            scope.dispatchEvent(startEvent);

        }

    }

    function onMouseMove(event) {

        if (scope.enabled === false) return;

        event.preventDefault();

        switch (state) {

            case STATE.ROTATE:

                if (scope.enableRotate === false) return;

                handleMouseMoveRotate(event);

                break;

            case STATE.DOLLY:

                if (scope.enableZoom === false) return;

                handleMouseMoveDolly(event);

                break;

            case STATE.PAN:

                if (scope.enablePan === false) return;

                handleMouseMovePan(event);

                break;

        }

    }

    function onMouseUp(event) {

        if (scope.enabled === false) return;

        handleMouseUp(event);

        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('mouseup', onMouseUp, false);

        scope.dispatchEvent(endEvent);

        state = STATE.NONE;

    }

    function onMouseWheel(event) {

        if (scope.enabled === false || scope.enableZoom === false || (state !== STATE.NONE && state !== STATE.ROTATE)) return;

        event.preventDefault();
        event.stopPropagation();

        scope.dispatchEvent(startEvent);

        handleMouseWheel(event);

        scope.dispatchEvent(endEvent);

    }

    function onKeyDown(event) {

        if (scope.enabled === false || scope.enableKeys === false || scope.enablePan === false) return;

        handleKeyDown(event);

    }

    function onTouchStart(event) {

        if (scope.enabled === false) return;

        event.preventDefault();

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate

                if (scope.enableRotate === false) return;

                handleTouchStartRotate(event);

                state = STATE.TOUCH_ROTATE;

                break;

            case 2: // two-fingered touch: dolly-pan

                if (scope.enableZoom === false && scope.enablePan === false) return;

                handleTouchStartDollyPan(event);

                state = STATE.TOUCH_DOLLY_PAN;

                break;

            default:

                state = STATE.NONE;

        }

        if (state !== STATE.NONE) {

            scope.dispatchEvent(startEvent);

        }

    }

    function onTouchMove(event) {

        if (scope.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate

                if (scope.enableRotate === false) return;
                if (state !== STATE.TOUCH_ROTATE) return; // is this needed?

                handleTouchMoveRotate(event);

                break;

            case 2: // two-fingered touch: dolly-pan

                if (scope.enableZoom === false && scope.enablePan === false) return;
                if (state !== STATE.TOUCH_DOLLY_PAN) return; // is this needed?

                handleTouchMoveDollyPan(event);

                break;

            default:

                state = STATE.NONE;

        }

    }

    function onTouchEnd(event) {

        if (scope.enabled === false) return;

        handleTouchEnd(event);

        scope.dispatchEvent(endEvent);

        state = STATE.NONE;

    }

    function onContextMenu(event) {

        if (scope.enabled === false) return;

        event.preventDefault();

    }

    //

    scope.domElement.addEventListener('contextmenu', onContextMenu, false);

    scope.domElement.addEventListener('mousedown', onMouseDown, false);
    scope.domElement.addEventListener('wheel', onMouseWheel, false);

    scope.domElement.addEventListener('touchstart', onTouchStart, false);
    scope.domElement.addEventListener('touchend', onTouchEnd, false);
    scope.domElement.addEventListener('touchmove', onTouchMove, false);

    window.addEventListener('keydown', onKeyDown, false);

    // force an update at start

    this.update();

};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

Object.defineProperties(THREE.OrbitControls.prototype, {

    center: {

        get: function() {

            console.warn('THREE.OrbitControls: .center has been renamed to .target');
            return this.target;

        }

    },

    // backward compatibility

    noZoom: {

        get: function() {

            console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
            return !this.enableZoom;

        },

        set: function(value) {

            console.warn('THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
            this.enableZoom = !value;

        }

    },

    noRotate: {

        get: function() {

            console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
            return !this.enableRotate;

        },

        set: function(value) {

            console.warn('THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.');
            this.enableRotate = !value;

        }

    },

    noPan: {

        get: function() {

            console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
            return !this.enablePan;

        },

        set: function(value) {

            console.warn('THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.');
            this.enablePan = !value;

        }

    },

    noKeys: {

        get: function() {

            console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
            return !this.enableKeys;

        },

        set: function(value) {

            console.warn('THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.');
            this.enableKeys = !value;

        }

    },

    staticMoving: {

        get: function() {

            console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
            return !this.enableDamping;

        },

        set: function(value) {

            console.warn('THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.');
            this.enableDamping = !value;

        }

    },

    dynamicDampingFactor: {

        get: function() {

            console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
            return this.dampingFactor;

        },

        set: function(value) {

            console.warn('THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.');
            this.dampingFactor = value;

        }

    }

});