import Ball from './ball/Ball';
import Events from './Events';

const {ccclass, property} = cc._decorator;

@ccclass
export default class FailZone extends cc.Component {
    @property({visible: true, type: cc.PhysicsBoxCollider}) boxCollider = null;

    onBeginContact(contact, selfCollider, otherCollider) {
        let ball = otherCollider.node.getComponent(Ball);

        if (!ball) return;

        cc.systemEvent.emit(Events.Fail)
    }
}
