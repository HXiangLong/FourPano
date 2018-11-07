/* global THREE*/
import { scene, sw_measure } from '../../tool/SWConstants';
import { disposeNode } from '../../tool/SWTool';
import SWDrawString from './SWDrawString';

/**
 * 绘制线
 */
class SWDrawLine {
    constructor() {
        /**起点坐标 */
        this.startPoint = new THREE.Vector3(0, 0, 0);
        /**终点坐标*/
        this.endPoint = new THREE.Vector3(0, 0, 0);
        /**划分段数 */
        this.lineAllNum = 10;
        /**画线整体时间 */
        this.lineOverTime = 300 / this.lineAllNum;
        /**计时 */
        this.lineTimeNum = 0;
        /**计数 */
        this.lineNum = 0;
        /**线宽度 */
        this.lineWidth = 2;
        /**线颜色 */
        this.lineColors = 0xff0000;
        /**线的线段点 */
        this.linePointArr = [];
        /**所有线段集合 */
        this.lineAllArr = [];
        /**画线中，请勿打扰 */
        this.lineTimeBoo = false;
        /**文本显示 */
        this.swDrawString = new SWDrawString();
        /**文字标记大小 */
        this.fontSize = 1;
    }

    /**
     * 新增点击点
     * @param {Vector3} points 点击点坐标
     * @param {Boolean} textBoo 是否显示距离
     */
    addPoint(points, textBoo = true) {

        this.endPoint.copy(points);

        let dis = this.startPoint.distanceTo(this.endPoint);

        if (dis > 0 && this.startPoint.distanceTo(new THREE.Vector3(0, 0, 0)) > 0) {

            let v1 = this.endPoint.clone().sub(this.startPoint.clone());

            for (let i = 1; i <= this.lineAllNum; i++) {

                let v2 = v1.clone().divideScalar(this.lineAllNum / i);

                let segment = this.endPoint.clone().sub(v2);

                this.linePointArr.push(segment);

            }

            this.linePointArr.reverse();

            this.lineTimeBoo = true;

            if (textBoo) {

                let dis1 = (Math.ceil(this.endPoint.distanceTo(this.startPoint) * 10) / 100) + "m";

                this.fontSize = sw_measure.swDrawPoint.dotRadius * 3;

                this.swDrawString.drawString(new THREE.Vector3(this.endPoint.x + sw_measure.swDrawPoint.dotRadius, this.endPoint.y + sw_measure.swDrawPoint.dotRadius, this.endPoint.z + sw_measure.swDrawPoint.dotRadius), dis1, this.fontSize);

            }
        }

        this.startPoint.copy(this.endPoint);

        if (this.linePointArr.length > 0) {
            //开始自我计时
            this.lineTimeNum = setInterval(() => {

                if (this.lineNum == this.lineAllNum) {

                    this.lineNum = 0;

                    clearInterval(this.lineTimeNum);

                    this.lineTimeBoo = false;

                    this.linePointArr.length = 0;

                    return;
                }

                this.drawLine(this.linePointArr[this.lineNum], ((this.lineNum + 1) >= this.lineAllNum) ? this.endPoint : this.linePointArr[this.lineNum + 1]);

                this.lineNum++;

            }, this.lineOverTime);

        }

    }

    /**
     * 绘制线段
     * @param {Vector3} p1 第一个点坐标
     * @param {Vector3} p2 第二个点坐标
     */
    drawLine(p1, p2) {

        let geometry = new THREE.Geometry();

        let material = new THREE.LineBasicMaterial({ color: this.lineColors, linewidth: this.lineWidth });

        geometry.vertices.push(p1);

        geometry.vertices.push(p2);

        let line = new THREE.Line(geometry, material);

        line.position.set(0, 0, 0);

        line.userData.depthlevel = 100;
        
        scene.add(line);

        this.lineAllArr.push(line);
    }

    /**
     * 清除点
     * @param {Number} num 0-全部清除 -1从尾部开始清除 1从头开始清除
     */
    clear(num = 0) {

        let dArr = num == 0 ? this.lineAllArr.splice(0, this.lineAllArr.length) :
            num < 0 ? this.lineAllArr.splice(num * this.lineAllNum, Math.abs(num * this.lineAllNum)) :
            this.lineAllArr.splice(0, num * this.lineAllNum);

        dArr.forEach((item) => {

            disposeNode(item);

        });

        this.startPoint = new THREE.Vector3(0, 0, 0);

        this.endPoint = new THREE.Vector3(0, 0, 0);

        this.lineNum = 0;

        if (this.swDrawString) {

            this.swDrawString.clear(num);

        }
    }
}

export default SWDrawLine;