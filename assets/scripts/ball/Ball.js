const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    @property({visible: true, type: cc.Integer}) damage = 1;
    @property({visible: true, type: cc.Integer}) velocity = -500;

    getDamage() {
        return this.damage;
    }

    onLoad() {
        this.startPos = this.node.position;
    }

    release() {
        this.node.position = this.startPos;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.velocity);

        console.log(this.node.getComponent(cc.RigidBody).set);
    }

    stop() {
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.Vec2.ZERO;
    }
}
