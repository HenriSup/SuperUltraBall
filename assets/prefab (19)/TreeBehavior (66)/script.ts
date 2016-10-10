class TreeBehavior extends Sup.Behavior {
  
  public moveSpeed=1;
  awake() {
    
  }

  update() {
    var x = this.actor.getPosition().x;
    var y = this.actor.getPosition().y;
    var z = this.actor.getPosition().z;
    x+=this.moveSpeed;
    this.actor.setPosition(x,y,z);
    
  }
}
Sup.registerBehavior(TreeBehavior);
