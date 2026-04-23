const {ccclass, property} = cc._decorator;

@ccclass
export default class AnimationHelper {
    static async playAnim(animation, animClip) {
        animation.play(animClip);

        return new Promise((resolve) => {
            animation.on('finished', () => {
                resolve();
            })
        })
    }
}
