import Ball from './ball/Ball';
import BricksController from './bricks/BricksController';
import Levels from './bricks/Levels';
import RandomLevel from './bricks/RandomLevel';
import Events from './Events';
import InputSources from './input/InputSources';
import InputTypes from './input/InputTypes';
import PaddleMover from './paddle/PaddleMover';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    @property({visible: true, type: BricksController}) bricksController = null;
    @property({visible: true, type: Ball}) ball = null;
    @property({visible: true, type: PaddleMover}) paddleMover = null;
    @property({visible: true, type: cc.Node}) restartButton = null;

    onLoad() {
        this.isStarted = false;
        this.isCurrentLevelSpawned = false;
        this.currentLevel = 0;
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
        cc.systemEvent[type](Events.Win.toString(), this.onWin, this);
        cc.systemEvent[type](Events.AllHeartsDestroyed.toString(), this.onAllHeartsDestroyed, this);
    }


    async onInputDown(eventTouch, inputSource) {

        switch (inputSource) {
            case InputSources.RestartButton: {
                if (this.isStarted) return;

                if (!this.isCurrentLevelSpawned) {
                    this.isCurrentLevelSpawned = true;
                    console.log(this.currentLevel);
                    if (Levels[this.currentLevel]) {
                        this.bricksController.spawn(Levels[this.currentLevel]);
                    } else {
                        this.bricksController.spawn(RandomLevel.generate());
                    }
                }

                this.ball.setStartPos();
                this.paddleMover.setStartPos();
                this.isStarted = true;

                await this.hideNode(1, this.restartButton);


                this.ball.release();
                this.paddleMover.release();
            }
        }
    }

    onAllHeartsDestroyed() {
        this.ball.stop();
        this.paddleMover.stop();
    }

    async onFail() {
        this.ball.stop();
        this.paddleMover.stop();

        await this.showNode(1, this.restartButton);

        this.isStarted = false;
    }

    async onWin() {
        await this.showNode(1, this.restartButton);

        this.currentLevel++;
        this.isCurrentLevelSpawned = false;
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
