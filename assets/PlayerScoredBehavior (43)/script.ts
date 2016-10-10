class PlayerScoredBehavior extends Sup.Behavior {
  
  public timeLeftAlive=200;
  

  awake() {
    this.actor.spriteRenderer.setAnimation("Score",false);
  }

  update() {
    this.timeLeftAlive--;
    if (this.timeLeftAlive==20){
      var scene = Sup.appendScene("prefab/TransitionPrefab")[0];
      scene.setPosition(0,0,19);
    }
    if (this.timeLeftAlive<=0){
      
      this.actor.destroy();
      this.destroy();
    }
  }
  
   
}
Sup.registerBehavior(PlayerScoredBehavior);
