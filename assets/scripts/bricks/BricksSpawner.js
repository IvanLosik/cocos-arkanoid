import Brick from './Brick';
import BricksConfig from './BricksConfig';
import Levels from './Levels';

const {ccclass, property} = cc._decorator;

@ccclass
export default class BricksSpawner extends cc.Component {
    @property({visible: true, type: cc.Prefab}) brickPrefab = null;
    @property({visible: true, type: cc.Node}) bricksHolder = null;
    @property({visible: true, type: cc.Vec2}) offset = cc.v2(10, 10);

    start() {
        this.spawn(Levels.Level1);
    }

    spawn(config) {
        if (!config || !config.length || !config[0].length) return;

        this.bricksHolder.removeAllChildren();

        let rows = config.length;
        let cols = config[0].length;

        let totalWidth = (cols - 1) * this.offset.x;
        let totalHeight = (rows - 1) * this.offset.y;

        let startX = -totalWidth * 0.5;
        let startY = totalHeight * 0.5;

        let bricks = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (config[row][col] === 0) continue;

                let brickNode = cc.instantiate(this.brickPrefab);

                brickNode.parent = this.bricksHolder;
                brickNode.x = startX + col * this.offset.x;
                brickNode.y = startY - row * this.offset.y;

                let brick = brickNode.getComponent(Brick);

                brick?.init(BricksConfig[config[row][col]]);

                bricks.push(brick);
            }
        }

        return bricks;
    }
}