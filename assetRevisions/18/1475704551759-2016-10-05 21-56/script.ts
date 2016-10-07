class BallBehavior extends Sup.Behavior {
  private debugText:Sup.Actor;  
  awake() {
    this.debugText=this.actor.getChild("DebugText");
  }

  update() {
    var velocityX=this.actor.cannonBody.body.velocity.x;
    var velocityY=this.actor.cannonBody.body.velocity.y;
    this.actor.cannonBody.body.linearDamping=0.5;
    var positionY = this.actor.getY();
    var positionX = this.actor.getX();
    if (positionY>(-66)) {
      velocityY+=-5;
    }
    else{
      velocityY=-(velocityY);
      this.actor.setY(-65);
    }  
    
    if (positionX<(-74)) {
      this.actor.setX(-73);
      velocityX=-velocityX;
    }
    if (positionX>(74)) {
      this.actor.setX(73);
      velocityX=-velocityX;
    }

    
  
    
     if (Sup.Input.wasKeyJustPressed("NUMPAD4"))
      {
        velocityX+=-50;
      }
    if (Sup.Input.wasKeyJustPressed("NUMPAD6"))
      {
        velocityX+=50;
      }
      if (Sup.Input.wasKeyJustPressed("NUMPAD8"))
      {
        velocityY+=100;
      }
    if (Sup.Input.wasKeyJustPressed("NUMPAD2"))
      {
        velocityY+=-50;
      }
    
    
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(velocityX,velocityY,0);
    this.debugText.textRenderer.setText(velocityY.toFixed());
    Sup.log(velocityY.toString());
    
    var trail = Sup.appendScene("prefab/BallTrailPrefab")[0];
    trail.setPosition(this.actor.getPosition().x,this.actor.getPosition().y,this.actor.getPosition().z-1);
    
  }
  
}
Sup.registerBehavior(BallBehavior);
