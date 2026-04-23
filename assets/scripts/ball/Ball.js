const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    @property({visible: true, type: cc.Integer}) damage = 1;

    getDamage() {
        return this.damage;
    }
}
