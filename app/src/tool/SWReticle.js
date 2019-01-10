/* global THREE */
const external = require('./SWExternalConst.js');
/** 十字点动画*/
class SWReticle extends THREE.Sprite {
    /**
     * 
     * @param {THREE.Color} [color = 0xfffff]  - 标线精灵的颜色
     * @param {boolean} [autoSelect = true]  - 自动选择
     * @param {string} [idleImageUrl]  - 图片资源网址
     * @param {string} [dwellImageUrl]  - 图片资产网址
     * @param {number} [dwellTime = 1500]  - 住宅序列完成的持续时间
     * @param {number} [dwellSpriteAmount = 45]  - 住宅精灵序列的数量
     */
    constructor(color = 0xffffff, autoSelect, idleImageUrl, dwellImageUrl, dwellTime, dwellSpriteAmount) {

        super();

        this.autoSelect = autoSelect != undefined ? autoSelect : true;

        this.dwellTime = dwellTime || 1500;
        this.dwellSpriteAmount = dwellSpriteAmount || 45;
        this.dwellInterval = this.dwellTime / this.dwellSpriteAmount;

        this.IDLE = 0;
        this.DWELLING = 1;
        this.status;

        this.scaleIdle = new THREE.Vector3(0.2, 0.2, 1);
        this.scaleDwell = new THREE.Vector3(1, 0.8, 1);

        this.textureLoaded = false;
        this.idleImageUrl = idleImageUrl || external.ReticleIdle_icon;
        this.dwellImageUrl = dwellImageUrl || external.ReticleDwell_icon;
        this.idleTexture = new THREE.Texture();
        this.dwellTexture = new THREE.Texture();

        this.material = new THREE.SpriteMaterial({
            color: color,
            depthTest: false
        });

        this.currentTile = 0;
        this.startTime = 0;

        this.visible = false;
        this.renderOrder = 10;
        this.timerId;

        this.loadTextures();

        // 初步更新
        this.updateStatus(this.IDLE);
    }

    /**显示 */
    show() {
        this.visible = true;
    }

    /**隐藏 */
    hide() {
        this.visible = false;
    }

    /**加载资源 */
    loadTextures() {
        this.idleTexture = new THREE.ImageUtils.loadTexture(this.idleImageUrl);
        this.dwellTexture = new THREE.ImageUtils.loadTexture(this.dwellImageUrl);

        this.material.map = this.idleTexture;
        this.setupDwellSprite(this.dwellTexture);
        this.textureLoaded = true;
    }

    select(completeCallback) {
        if (performance.now() - this.startTime >= this.dwellTime) {
            this.cancelDwelling();
            completeCallback();
        } else if (this.autoSelect) {
            this.updateDwelling(performance.now());
            this.timerId = window.requestAnimationFrame(this.select.bind(this, completeCallback));
        }
    }

    clearTimer() {
        window.cancelAnimationFrame(this.timerId);
        this.timerId = null;
    }

    setupDwellSprite(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.set(1 / this.dwellSpriteAmount, 1);
    }

    updateStatus(status) {
        this.status = status;
        if (status === this.IDLE) {
            this.scale.copy(this.scaleIdle);
            this.material.map = this.idleTexture;
        } else if (status === this.DWELLING) {
            this.scale.copy(this.scaleDwell);
            this.material.map = this.dwellTexture;
        }
        this.currentTile = 0;
        this.material.map.offset.x = 0;
    }

    startDwelling(completeCallback) {
        if (!this.autoSelect) {
            return;
        }
        this.startTime = performance.now();
        this.updateStatus(this.DWELLING);
        this.select(completeCallback);
    }

    updateDwelling(time) {
        var elasped = time - this.startTime;
        if (this.currentTile <= this.dwellSpriteAmount) {
            this.currentTile = Math.floor(elasped / this.dwellTime * this.dwellSpriteAmount);
            this.material.map.offset.x = this.currentTile / this.dwellSpriteAmount;
        } else {
            this.updateStatus(this.IDLE);
        }
    }

    cancelDwelling() {
        this.clearTimer();
        this.updateStatus(this.IDLE);
    }
}

export default SWReticle;