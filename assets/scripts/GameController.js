import Ball from './ball/Ball';
import BricksSpawner from './bricks/BricksSpawner';
import InputSources from './input/InputSources';
import InputTypes from './input/InputTypes';
import PaddleMover from './paddle/PaddleMover';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    @property({visible: true, type: BricksSpawner}) bricksSpawner = null;
    @property({visible: true, type: Ball}) ball = null;
    @property({visible: true, type: PaddleMover}) paddleMover = null;

    onLoad() {
        this.isStarted = false;
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
    }

    onInputDown(eventTouch, inputSource) {

        if (inputSource !== InputSources.StartButton || this.isStarted) return;

        cc.tween(eventTouch.target)
            .to(1, {opacity: 0})
            .call(() => {
                this.isStarted = true;

                this.ball.release();
                this.paddleMover.release();
            })
            .start();

    }
}
