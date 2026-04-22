const {ccclass, property} = cc._decorator;

@ccclass
export default class Brick extends cc.Component {
    @property({visible: true, type: cc.Node}) render = null;
    @property({visible: true, type: cc.Animation}) brickAnimation = null;
    @property({visible: true, type: cc.AnimationClip}) destroyAnimClip = null;
    @property({visible: true, type: cc.AnimationClip}) hitAnimClip = null;
    @property({visible: true, type: cc.AnimationClip}) pulseAnimClip = null;

    onLoad() {
        this.hp = 1;
        this.color = '#A7A4A4';
        this.isHeart = false;
    }

    init(config) {
        if (!config) {
            return;
        }

        this.hp = config.hp;
        this.color = config.color;
        this.isHeart = config.isHeart;

        this.render.color = cc.color().fromHEX(this.color);

        if (this.isHeart) {
            this.brickAnimation.play(this.pulseAnimClip.name);
        }
    }
}