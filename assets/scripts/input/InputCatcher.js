let InputSources = require('./InputSources');
let InputTypes = require('./InputTypes');

const {ccclass, property} = cc._decorator;

@ccclass
export default class InputCatcher extends cc.Component {
    @property({type: cc.Enum(InputSources)}) inputSource = InputSources.Default;

    onEnable() {
        this.toggleSubscribe(true);
    }

    onDisable() {
        this.toggleSubscribe(false);
    }

    getSource() {
        return this.inputSource;
    }

    toggleSubscribe(isOn) {
        let type = isOn ? 'on' : 'off';

        this.node[type]('touchstart', this.onDown, this);
        this.node[type]('touchmove', this.onMove, this);
        this.node[type]('touchend', this.onUp, this);
        this.node[type]('touchcancel', this.onUp, this);
    }

    onDown(eventTouch) {
        cc.systemEvent.emit(InputTypes.Down.toString(), eventTouch, this.inputSource);
    }

    onMove(eventTouch) {
        cc.systemEvent.emit(InputTypes.Move.toString(), eventTouch, this.inputSource);
    }

    onUp(eventTouch) {
        cc.systemEvent.emit(InputTypes.Up.toString(), eventTouch, this.inputSource);
    }
}
