const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchConverter extends cc.Component {
    @property({visible: true, type: cc.Camera}) camera = null;

    static staticCamera = null;

    onLoad() {
        TouchConverter.staticCamera = this.camera;
    }

    static convertToWorld(eventTouch) {
        var location = eventTouch.getLocation();
        var worldPos = TouchConverter.staticCamera.getScreenToWorldPoint(cc.v2(location.x, location.y));

        return cc.v2(worldPos.x, worldPos.y);
    }
}
