import InputSources from '../input/InputSources';

let InputTypes = require('../input/InputTypes');

const {ccclass, property} = cc._decorator;

@ccclass('PaddleMover')
export default class PaddleMover extends cc.Component {
    @property(cc.Node) leftBorder = null;
    @property(cc.Node) rightBorder = null;

    onLoad() {
        this.isTouched = false;
        this.isLocked = true;
        this.startPos = this.node.position;
        this.lastTouchWorldPos = null;

        this.minX = 0;
        this.maxX = 0;

        this.calculateBorders();
    }

    onEnable() {
        this.toggleSubscribe(true);
    }

    onDisable() {
        this.toggleSubscribe(false);
    }

    toggleSubscribe(isOn) {
        let type = isOn ? 'on' : 'off';

        cc.systemEvent[type](InputTypes.Down.toString(), this.onInputDown, this);
        cc.systemEvent[type](InputTypes.Move.toString(), this.onInputMove, this);
        cc.systemEvent[type](InputTypes.Up.toString(), this.onInputUp, this);
    }

    onInputDown(eventTouch, inputSource) {
        if (!this.canMove(inputSource) || this.isTouched) return;

        this.isTouched = true;
        this.lastTouchWorldPos = eventTouch.getLocation();
    }

    onInputMove(eventTouch, inputSource) {
        if (!this.canMove(inputSource) || !this.isTouched) return;

        let currentTouchWorldPos = eventTouch.getLocation();
        let deltaX = currentTouchWorldPos.x - this.lastTouchWorldPos.x;
        let targetX = this.node.x + deltaX * 2.5;

        this.node.x = this.clampByBorders(targetX);

        this.lastTouchWorldPos = currentTouchWorldPos;
    }

    onInputUp(eventTouch, inputSource) {
        if (!this.canMove(inputSource) || !this.isTouched) return;

        this.isTouched = false;
        this.lastTouchWorldPos = null;
    }

    setStartPos() {
        this.node.position = this.startPos;
        this.node.x = this.clampByBorders(this.node.x);
    }

    release() {
        this.isLocked = false;
    }

    stop() {
        this.isLocked = true;
        this.isTouched = false;
        this.lastTouchWorldPos = null;
    }

    canMove(inputSource) {
        if (inputSource === InputSources.CommonCatcher && !this.isLocked) return true;

        return false;
    }

    calculateBorders() {
        let parent = this.node.parent;

        let leftWorldPos = this.leftBorder.convertToWorldSpaceAR(cc.v2(0, 0));
        let rightWorldPos = this.rightBorder.convertToWorldSpaceAR(cc.v2(0, 0));

        let leftLocalPos = parent.convertToNodeSpaceAR(leftWorldPos);
        let rightLocalPos = parent.convertToNodeSpaceAR(rightWorldPos);

        let minX = Math.min(leftLocalPos.x, rightLocalPos.x);
        let maxX = Math.max(leftLocalPos.x, rightLocalPos.x);

        let halfWidth = this.node.width * this.node.scaleX * 0.5;

        this.minX = minX + halfWidth;
        this.maxX = maxX - halfWidth;
    }

    clampByBorders(targetX) {
        return cc.misc.clampf(targetX, this.minX, this.maxX);
    }

}