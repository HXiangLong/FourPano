import * as constants from '../tool/SWConstants';
import HashTable from '../tool/SWHashTable';
import FloorsMarkerInfo from './SWFloorsMarkerInfo';
/**
 * 楼层信息
 */
class FloorsInfo {
    constructor(obj) {
        this.floorID = obj.FloorID; //楼层id
        this.buildingID = obj.BuildingID; //建筑id
        this.storey = obj.Storey; //楼层
        this.description = obj.Description; //说明
        this.displayPriority = obj.DisplayPriority; //优先级
        this.names = obj.RasterMapInfoModel.Name; //显示名称
        this.panoIDs = obj.PanoIDs;
        this.rasterMapPath = obj.RasterMapInfoModel.RasterMapPath; //地图链接地址
        this.rasterMapMarkers = new HashTable(); //楼层所以点集合
        constants.c_FloorsMapTable.add(this.storey, this);
        Array.from(obj.RasterMapMarkers, (mapMarker) => {
            let floorsMarkerInfo = new FloorsMarkerInfo(mapMarker);
            this.rasterMapMarkers.add(floorsMarkerInfo.markerID, floorsMarkerInfo);
        });
    }
}

export default FloorsInfo;