const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraScaler extends cc.Component {
    @property({visible: true, type: cc.Camera}) camera = null;

    @property({visible: true, type: cc.Node}) portraitBox = null;
    @property({visible: true, type: cc.Node}) landscapeBox = null;

    onLoad() {
        this.game_width = 0;
        this.game_height = 0;
        this.half_width = 0;
        this.half_heigth = 0;
        this.is_landscape = false;

        this.updateSettings();

        cc.view.setResizeCallback(() => {
            this.windowResized();
        });

        this.windowResized();
    }

    updateSettings() {
        this.game_width = cc.winSize.width;
        this.game_height = cc.winSize.height;

        this.half_width = this.game_width * .5;
        this.half_heigth = this.game_height * .5;

        this.is_landscape = this.game_width > this.game_height;
    }

    getZoomRatio(target) {
        const tw = target.width;
        const th = target.height;
        const gw = this.game_width;
        const gh = this.game_height;

        const zX = gw / tw;
        const zY = gh / th;

        let zoomRatio = Math.min(zX, zY);

        return zoomRatio;
    }

    windowResized() {
        this.updateSettings();

        let target = this.is_landscape ? this.landscapeBox : this.portraitBox;
        let zoomRatio = this.getZoomRatio(target);

        this.camera.zoomRatio = zoomRatio;
    }
}
