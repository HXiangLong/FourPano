/**
 * 空间坐标对象
 */
class SWViewGesture {
    constructor(yaw, pitch, roll) {
        this._yaw = yaw % 360;
        this._pitch = pitch;
        this._roll = roll;
    }

    get Yaw() {
        return this._yaw;
    }

    set Yaw(yaw) {
        this._yaw = yaw;
    }

    get Pitch() {
        return this._pitch;
    }

    set Pitch(pitch) {
        this._pitch = pitch;
    }

    get Roll() {
        return this._roll;
    }

    set Roll(roll) {
        this._roll = roll;
    }
}
export default SWViewGesture;