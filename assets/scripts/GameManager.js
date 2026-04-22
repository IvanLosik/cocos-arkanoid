const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }
}
