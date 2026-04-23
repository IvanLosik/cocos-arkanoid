import Ball from './ball/Ball';
import BricksSpawner from './bricks/BricksSpawner';
import Events from './Events';
import InputSources from './input/InputSources';
import InputTypes from './input/InputTypes';
import PaddleMover from './paddle/PaddleMover';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    @property({visible: true, type: BricksSpawner}) bricksSpawner = null;
    @property({visible: true, type: Ball}) ball = null;
    @property({visible: true, type: PaddleMover}) paddleMover = null;
    @property({visible: true, type: cc.Node}) restartButton = null;

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
        cc.systemEvent[type](Events.Fail.toString(), this.onFail, this);
    }


    async onInputDown(eventTouch, inputSource) {

        switch (inputSource) {
            case InputSources.RestartButton: {
                if (this.isStarted) return;

                this.ball.setStartPos();
                this.paddleMover.setStartPos();

                await this.hideNode(1, this.restartButton);

                this.isStarted = true;

                this.ball.release();
                this.paddleMover.release();
            }
        }
    }

    async onFail() {
        this.ball.stop();
        this.paddleMover.stop();

        await this.showNode(1, this.restartButton);

        this.isStarted = false;
    }

    async hideNode(duration, node) {
        return new Promise((resolve) => {
            cc.tween(node)
                .to(duration, {opacity: 0})
                .call(() => node.active = false)
                .call(() => resolve())
                .start();
        })
    }

    async showNode(duration, node) {
        node.active = true;

        return new Promise((resolve) => {
            cc.tween(node)
                .to(duration, {opacity: 255})
                .call(() => resolve())
                .start();
        })
    }
}
