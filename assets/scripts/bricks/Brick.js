import Ball from '../ball/Ball';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Brick extends cc.Component {
    @property({visible: true, type: cc.Node}) render = null;
    @property({visible: true, type: cc.RigidBody}) rigidBody = null;
    @property({visible: true, type: cc.PhysicsBoxCollider}) boxCollider = null;
    @property({visible: true, type: cc.Animation}) brickAnimation = null;
    @property({visible: true, type: cc.AnimationClip}) destroyAnimClip = null;
    @property({visible: true, type: cc.AnimationClip}) hitAnimClip = null;
    @property({visible: true, type: cc.AnimationClip}) pulseAnimClip = null;

    onLoad() {
        this.hp = 1;
        this.color = '#A7A4A4';
        this.isHeart = false;

        this.node.getComponent(cc.RigidBody).enabledContactListener = true;
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

    onBeginContact(contact, selfCollider, otherCollider) {
        let ball = otherCollider.node.getComponent(Ball);

        if (!ball) {
            return;
        }

        this.takeDamage(ball.getDamage());
    }

    takeDamage(value) {
        this.hp -= value;

        if (this.hp <= 0) {
            this.destroyBrick();

            return;
        }

        this.hitBrick();
    }

    hitBrick() {
        this.brickAnimation.play(this.hitAnimClip.name);
    }

    destroyBrick() {
        this.boxCollider.enabled = false;
        this.brickAnimation.play(this.destroyAnimClip.name);

        this.brickAnimation.on('finished', () => {
            this.node.active = false;
        })
    }
}
