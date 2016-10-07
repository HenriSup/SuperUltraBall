class BallBehavior extends Sup.Behavior {
  private hitSoundPlayers = [new Sup.Audio.SoundPlayer("Sounds/BallHit", 0.8, { loop: false }),new Sup.Audio.SoundPlayer("Sounds/BallHit", 0.8, { loop: false }),new Sup.Audio.SoundPlayer("Sounds/BallHit", 0.8, { loop: false })];
  private shouldShake = false;
  private hasBeenShakingFor = 0;
  private timeShaking = 20;
  private hitBox:Sup.ArcadePhysics2D.Body;
  private shouldPlayOn=0;
  awake() {
    this.hitBox = this.actor.arcadeBody2D;
  }


  update() {
    var velocityX=this.actor.cannonBody.body.velocity.x;
    var velocityY=this.actor.cannonBody.body.velocity.y;
    this.actor.cannonBody.body.linearDamping=0.5;
    var positionY = this.actor.getY();
    var positionX = this.actor.getX();
    this.shouldShake=false;
    
    if (positionY>(-66)) {
      velocityY+=-5;
    }
    else{
      velocityY=(Math.abs(velocityY));
      this.actor.setY(-65);
      this.playSound();
    }  
    
    if (positionX<(-74)) {
      this.actor.setX(-73);
      velocityX=Math.abs(velocityX);
      this.playSound();
    }
    if (positionX>(74)) {
      this.actor.setX(73);
      velocityX=-(Math.abs(velocityX));
      this.playSound();
    }
    
    
     if (Sup.Input.wasKeyJustPressed("NUMPAD4"))
      {
        velocityX+=-50;
        this.playSound();
        this.shouldShake = true;
      }
    if (Sup.Input.wasKeyJustPressed("NUMPAD6"))
      {
        velocityX+=50;
        this.playSound();
        this.shouldShake = true;
      }
      if (Sup.Input.wasKeyJustPressed("NUMPAD8"))
      {
        velocityY+=100;
        this.playSound();
        this.shouldShake = true;
      }
    if (Sup.Input.wasKeyJustPressed("NUMPAD2"))
      {
        velocityY+=-50;
        this.playSound();
        this.shouldShake = true;
      }
    
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(velocityX,velocityY,0);
    
    if (this.actor.cannonBody.body.velocity.y < -50 || this.actor.cannonBody.body.velocity.y > 50) {
      Sup.getActor("ballVelocity").textRenderer.setText("x: "+this.actor.cannonBody.body.velocity.y.toFixed());
    } else {
      Sup.getActor("ballVelocity").textRenderer.setText("x: 0");
    }
    
    var trail = Sup.appendScene("prefab/BallTrailPrefab")[0];
    trail.setPosition(this.actor.getPosition().x,this.actor.getPosition().y,this.actor.getPosition().z-1);
    this.shakeCam(this.shouldShake);
    this.Animate(this.shouldShake);
    this.hitBox.warpPosition(this.actor.getPosition().x,this.actor.getPosition().y);
  }
  
  playSound(){
    var lower = 0.2;
    var higher = 0.3;
    var random = (Math.random() * (higher-lower)) + lower;
    
    this.hitSoundPlayers[this.shouldPlayOn].setPitch(random);
    this.hitSoundPlayers[this.shouldPlayOn].play();
    this.shouldPlayOn++;
    if (this.shouldPlayOn>=this.hitSoundPlayers.length){
      this.shouldPlayOn=0;
    }

  }
  
  Animate(hit){
    if (hit) {
      this.actor.spriteRenderer.setAnimation("ballHit",false);
    }
    else {
      if (this.actor.spriteRenderer.getAnimationFrameIndex()>=3){
        this.actor.spriteRenderer.setAnimation("ball",false);
      }
    }
  }
  
  shakeCam(startShake){
    if (startShake){
      this.hasBeenShakingFor=0;
      var lower = -1;
      var higher = 1;

      var x = (Math.random() * (higher-lower)) + lower;
      var y = (Math.random() * (higher-lower)) + lower;
      Sup.getActor("Camera").setPosition(x,y,20);
    }
    else {
      if (this.hasBeenShakingFor<this.timeShaking){
        this.hasBeenShakingFor++;
        var lower = -1;
        var higher = 1;

        var x = (Math.random() * (higher-lower)) + lower;
        var y = (Math.random() * (higher-lower)) + lower;
        Sup.getActor("Camera").setPosition(x,y,20);
      }
      else {
      
        Sup.getActor("Camera").setPosition(0,0,20);
      }
    }
  }
  
  gotPunched(left,right,up,down){
    var velocityX=this.actor.cannonBody.body.velocity.x;
    var velocityY=this.actor.cannonBody.body.velocity.y;
    if (left){velocityX=-Math.abs(velocityX)-150;}
    if (right){velocityX=Math.abs(velocityX)+150;}
    if (up){velocityY=(Math.abs(velocityY)*0.8)+200;}
    if (down){velocityY+=-(Math.abs(velocityY)*0.8)-100;}
    this.playSound();
    this.shouldShake = true;
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(velocityX,velocityY,0);
    this.shakeCam(true);
    this.Animate(true);
  }
  
}
Sup.registerBehavior(BallBehavior);
