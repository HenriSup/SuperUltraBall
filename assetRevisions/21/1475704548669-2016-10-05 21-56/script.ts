class BallTrailBehavior extends Sup.Behavior {
  private livingTime =60;
  awake() {
    this.actor.spriteRenderer.setAnimation("ballTrail",false);
  }
  
  update() {
    this.livingTime--;
    if (this.livingTime<=0){
      this.actor.destroy();
      this.destroy();
    }
  }
}
Sup.registerBehavior(BallTrailBehavior);
