/* global THREE*/

/**gif动画对象 */
export default class SWTextureAnimator {
    /**
     * GIF动画
     * @param {THREE.Texture} texture 贴图对象
     * @param {number} tilesHoriz 横向
     * @param {number} tilesVert 竖向
     * @param {number} numTiles 数量
     * @param {number} tileDispDuration 间隔时间 
     */
    constructor(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {

        this.textures = texture;

        this.tilesHorizontal = tilesHoriz;

        this.tilesVertical = tilesVert;

        this.numberOfTiles = numTiles;

        this.textures.wrapS = this.textures.wrapT = THREE.RepeatWrapping;

        this.textures.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

        this.tileDisplayDuration = tileDispDuration;

        this.currentDisplayTime = 0;

        this.currentTile = 0;
    }

    /**不停更新 */
    update(milliSec) {

        this.currentDisplayTime += milliSec;

        while (this.currentDisplayTime > this.tileDisplayDuration) {

            this.currentDisplayTime -= this.tileDisplayDuration;

            this.currentTile++;

            if (this.currentTile == this.numberOfTiles) {

                this.currentTile = 0;

            }

            let currentColumn = this.currentTile % this.tilesHorizontal;

            this.textures.offset.x = currentColumn / this.tilesHorizontal;

            let currentRow = Math.floor(this.currentTile / this.tilesHorizontal);

            this.textures.offset.y = currentRow / this.tilesVertical;
        }
    }
}