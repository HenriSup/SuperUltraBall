class TransitionBehavior extends Sup.Behavior {
  private frameBeforeDestroy:number;
  private matchArbitrator:MatchBehavior;
  awake() {
    this.matchArbitrator = Sup.getActor("MatchArbitrator").getBehavior(MatchBehavior);
    this.actor.spriteRenderer.setAnimation("Transition",false)
    this.frameBeforeDestroy=300;
    
  }

  update() {
    this.frameBeforeDestroy--;
    if (this.frameBeforeDestroy<=0){
      this.actor.destroy();
      this.destroy();
    }
    if (this.actor.spriteRenderer.getAnimationFrameIndex() == 39){
      this.matchArbitrator.restartRound();
    }
  }
}
Sup.registerBehavior(TransitionBehavior);
