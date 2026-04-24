import InputSources from '../input/InputSources';
import TouchConverter from '../TouchConverter';

let InputTypes = require('../input/InputTypes');

const {ccclass, property} = cc._decorator;

@ccclass('PaddleMover')
export default class PaddleMover extends cc.Component {
    onLoad() {
        this.isTouched = false;
        this.isLocked = true;
        this.startPos = this.node.position;
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

    setStartPos() {
        this.node.position = this.startPos
    }

    release() {
        this.isLocked = false;
    }

    stop() {
        this.isLocked = true;
    }


    onInputDown(eventTouch, inputSource) {
        if (!this.canMove(inputSource) || this.isTouched) return;

        this.isTouched = true;
    }

    onInputMove(eventTouch, inputSource) {
        if (!this.canMove(inputSource) || !this.isTouched) return;

        let worldPos = TouchConverter.convertToWorld(eventTouch);

        this.node.setWorldPosition(cc.v2(worldPos.x, this.node.y));
    }

    onInputUp(eventTouch, inputSource) {
        if (!this.canMove(inputSource) || !this.isTouched) return;

        this.isTouched = false;
    }

    canMove(inputSource) {
        if (inputSource === InputSources.Paddle && !this.isLocked) return true;

        return false;
    }
}
