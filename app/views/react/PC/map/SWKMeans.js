import * as constants from '../../../../src/tool/SWConstants';

class SWKMeans {
    /**
     * 运用K-Means聚类算法，步骤如下：
     * 1.地图范围划分成指定尺寸的正方形（每个缩放级别不同尺寸）
     * 2.将各个点落到相应正方形内
     * 3.求解各个网格的质心
     * 4.合并质心：判断各个质心是否在某一范围内，如果在某一范围内则进行合并
     */
    constructor() {

        this.lattice = 50; //格子宽度

        this.minDis = 25; //两点距离小于这个值被聚
    }

    /**
     * 传入参数开始聚类计算，返回一个新的坐标点集[[px,py,panoID,markerTypeCode,length]]
     * @param {Array} table [px,py,panoID,markerTypeCode]
     * @param {Array} markerPointArr zoom-marker图层[left,top]
     */
    start(table) {

        let minPx = 0;
        let maxPx = 0;
        let minPy = 0;
        let maxPy = 0;

        table.forEach((point) => {

            if (minPx > point[0]) {
                minPx = point[0];
            }

            if (maxPx < point[0]) {
                maxPx = point[0];
            }

            if (minPy > point[1]) {
                minPy = point[1];
            }

            if (maxPy < point[1]) {
                maxPy = point[1];
            }
        });

        let bw = Math.ceil((maxPx - minPx) / this.lattice);

        let bh = Math.ceil((maxPy - minPy) / this.lattice) + 1;

        let markerArr = [];

        for (let i = 0; i <= bw; i++) { //网格数组

            markerArr.push([]);

            for (let j = 0; j <= bh; j++) {

                markerArr[i].push([]);
            }
        }

        table.forEach((item) => {

            let left = item[0];

            let top = item[1];

            let x = Math.ceil((left - minPx) / this.lattice);

            let y = Math.ceil((top - minPy) / this.lattice);

            constants.c_StationInfo.panoID == item[2] ? markerArr[x][markerArr[x].length - 1].push(item) : markerArr[x][y].push(item);
        });

        let centroidArr = [];

        markerArr.forEach((itemArr) => {

            if (itemArr.length > 0) {

                itemArr.forEach((item) => {

                    item.length > 0 && centroidArr.push(item.length == 1 ? [item[0][0], item[0][1], item[0][2], (constants.c_StationInfo.panoID == item[0][2] ? "999" : item[0][3])] : this.getPolygonAreaCenter(item));

                });
            }
        });

        return centroidArr;
    }


    //计算多点的质心
    getPolygonAreaCenter(points) {
        let xx, yy, panoId, tc, typeCode = -1;

        //多点聚集时，点的类别高，则显示到小地图上
        points.forEach((item) => {

            if (item[3] > typeCode) {

                typeCode = item[3];

                panoId = item[2];
            }

            tc = constants.c_StationInfo.panoID == item[2] ? "999" : "5";
        });

        if (points.length == 2) {

            xx = (points[0][0] + points[1][0]) * 0.5;

            yy = (points[0][1] + points[1][1]) * 0.5;

        } else {

            let sum_x = 0;

            let sum_y = 0;

            let sum_area = 0;

            let p1 = points[1];

            let p2, area;

            for (let i = 2; i < points.length; i++) {

                p2 = points[i];

                area = this.Area(points[0], p1, p2);

                sum_area += area;

                sum_x += (points[0][0] + p1[0] + p2[0]) * area;

                sum_y += (points[0][1] + p1[1] + p2[1]) * area;

                p1 = p2;

            }

            xx = sum_x / sum_area / 3;

            yy = sum_y / sum_area / 3;

        }

        return [xx, yy, panoId, tc, points];
    }

    Area(p0, p1, p2) {

        let area = 0.0;

        area = p0[0] * p1[1] + p1[0] * p2[1] + p2[0] * p0[1] - p1[0] * p0[1] - p2[0] * p1[1] - p0[0] * p2[1];

        return area / 2;
    }

    /**
     * 两点之间的距离
     * @param {Array} point1 
     * @param {Array} point2 
     */
    pointDistance(point1, point2) {

        let total = 0;

        for (c in point1) {

            total += Math.pow(point2[c] - point1[c], 2);

        }

        return Math.sqrt(total);
    }
}

export default SWKMeans;