/* global THREE */
import * as constants from '../../tool/SWConstants';

/**预加载全景图 */
class SWBoxPreloadingImage {
    constructor(panoID,level, imageName, callfun) {

        if (constants.c_panoImageTable.containsKey(panoID + "_" + imageName)) {

            if (callfun) callfun(constants.c_panoImageTable.getValue(panoID + "_" + imageName));

            return;
        }

        let path = `${constants.sw_getService.resourcesUrl}/panoImages/${panoID}/${level}/${imageName}`;

        let loader = new THREE.TextureLoader();

        loader.load(path,
            (texture) => {

                constants.c_panoImageTable.add(panoID + "_" + imageName, texture);

                if (callfun) {
                    callfun(texture);
                }
            },
            (xhr) => {},
            (xhr) => {
                console.log(`图片加载失败：${path}`);
            }
        );
    }
}

export default SWBoxPreloadingImage;