import AnimationHelper from '../AnimationHelper';
import Events from '../Events';
import Brick from './Brick';
import BricksConfig from './BricksConfig';

const {ccclass, property} = cc._decorator;

@ccclass
export default class BricksController extends cc.Component {
    @property({visible: true, type: cc.Prefab}) brickPrefab = null;
    @property({visible: true, type: cc.Node}) bricksHolder = null;
    @property({visible: true, type: cc.Vec2}) offset = cc.v2(10, 10);

    onLoad() {
        this.bricks = [];
        this.destroyedHeartsCount = 0;
        this.heartsCount = 0;
    }

    onEnable() {
        this.toggleSubscribe(true);
    }

    onDisable() {
        this.toggleSubscribe(false);
    }

    toggleSubscribe(isOn) {
        let type = isOn ? 'on' : 'off';

        cc.systemEvent[type](Events.HeartDestroyed.toString(), this.onHeartDestroyed, this);
    }

    async onHeartDestroyed() {
        this.destroyedHeartsCount++;

        if (this.destroyedHeartsCount === this.heartsCount) {
            cc.systemEvent.emit(Events.AllHeartsDestroyed);

            this.destroyedHeartsCount = 0;
            this.heartsCount = 0;

            for (const brick of this.bricks) {
                if (brick.node.active) {
                    brick.destroyBrick();

                    await AnimationHelper.waitFor(this, 0.1);
                }
            }

            cc.systemEvent.emit(Events.Win);
        }
    }

    async spawn(config) {
        if (!config || !config.length || !config[0].length) return;

        this.bricksHolder.removeAllChildren();

        let rows = config.length;
        let cols = config[0].length;

        let totalWidth = (cols - 1) * this.offset.x;
        let totalHeight = (rows - 1) * this.offset.y;

        let startX = -totalWidth * 0.5;
        let startY = totalHeight * 0.5;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (config[row][col] === 0) continue;

                let brickNode = cc.instantiate(this.brickPrefab);

                brickNode.parent = this.bricksHolder;
                brickNode.x = startX + col * this.offset.x;
                brickNode.y = startY - row * this.offset.y;

                let brick = brickNode.getComponent(Brick);

                brick?.init(BricksConfig[config[row][col]]);

                if (brick.isHeart) {
                    this.heartsCount++;
                }

                await AnimationHelper.waitFor(this, 0.01);

                this.bricks.push(brick);
            }
        }
    }
}