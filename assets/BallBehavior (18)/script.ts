class BallBehavior extends Sup.Behavior {
  private hitSoundPlayers = [new Sup.Audio.SoundPlayer("Sounds/BallHit", 0.8, { loop: false }),new Sup.Audio.SoundPlayer("Sounds/BallHit", 0.8, { loop: false }),new Sup.Audio.SoundPlayer("Sounds/BallHit", 0.8, { loop: false })];
  private shouldShake = false;
  private hasBeenShakingFor = 0;
  private timeShaking = 20;
  private hitBox:Sup.ArcadePhysics2D.Body;
  private shouldPlayOn=0;
  private actualScore:number;
  private matchArbitrator:MatchBehavior;
  private lastHit=10;
  private timeBetweenHit=6;
  private lastNetHit=21;
  private timeBetweenNetHit=20;
  awake() {
    this.matchArbitrator = Sup.getActor("MatchArbitrator").getBehavior(MatchBehavior);
    this.hitBox = this.actor.arcadeBody2D;
  }


  update() {
    this.lastHit++;
    var velocityX=this.actor.cannonBody.body.velocity.x;
    var velocityY=this.actor.cannonBody.body.velocity.y;
    this.actor.cannonBody.body.linearDamping=0.5;
    var positionY = this.actor.getY();
    var positionX = this.actor.getX();
    this.shouldShake=false;
    this.lastNetHit++;
    if (positionY>(-66)) {
      velocityY+=-5;
    }
    else{
      velocityY=(Math.abs(velocityY));
      this.actor.setY(-65);
      this.playSound();
      this.touchTheGround();
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
    
    if (this.checkForNet()){
      if (this.actor.getPosition().y<=-17){
        velocityY=(Math.abs(velocityY));
      }
      if (this.actor.getPosition().x<0){
        velocityX=-(Math.abs(velocityX));
      }
      if (this.actor.getPosition().x>0){
        velocityX=(Math.abs(velocityX));
      }
      if (this.lastNetHit>=this.timeBetweenNetHit){
        this.playSound();
        this.lastNetHit=0;
      }
      
        
    }
    
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(velocityX,velocityY,0);
    
    var trail = Sup.appendScene("prefab/BallTrailPrefab")[0];
    trail.setPosition(this.actor.getPosition().x,this.actor.getPosition().y,this.actor.getPosition().z-1);
    this.shakeCam(this.shouldShake);
    this.Animate(this.shouldShake);
    this.hitBox.warpPosition(this.actor.getPosition().x,this.actor.getPosition().y);
  }
  
  playSound(){
      var volume = 1;   
      var maxSpeed = Math.max(Math.abs(this.actor.cannonBody.body.velocity.y),Math.abs(this.actor.cannonBody.body.velocity.x)); 
      
      if (maxSpeed < 20) {
        volume=0;
      } else if (maxSpeed >= 20 && maxSpeed <40) {
        volume=0.1;
      } else if (maxSpeed >= 40 && maxSpeed <200) {
        volume=0.4;
      }else if (maxSpeed >= 200 && maxSpeed <300) {
        volume=0.6;
      } else if (maxSpeed >= 300 && maxSpeed <400) {
        volume=0.8;
      } else {
        volume=1;
      }
      var lower = 0.2;
      var higher = 0.3;
      var random = (Math.random() * (higher-lower)) + lower;
      this.hitSoundPlayers[this.shouldPlayOn].setVolume(volume);
      this.hitSoundPlayers[this.shouldPlayOn].setPitch(random);
      this.hitSoundPlayers[this.shouldPlayOn].play();
      this.shouldPlayOn++;
      if (this.shouldPlayOn>=this.hitSoundPlayers.length){
        this.shouldPlayOn=0;
      }
    
  }
  
  checkForNet(){
    return Sup.ArcadePhysics2D.intersects(this.hitBox,Sup.getActor("Net").arcadeBody2D);
  
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
    if (this.lastHit>this.timeBetweenHit){
      var velocityX=this.actor.cannonBody.body.velocity.x;
      var velocityY=this.actor.cannonBody.body.velocity.y;
      if (left){velocityX=-Math.abs(velocityX)-50;}
      if (right){velocityX=Math.abs(velocityX)+50;}
      if (up){velocityY=(Math.abs(velocityY)*0.8)+200;}
      if (down){
        velocityY+=-(Math.abs(velocityY)*0.8);
        if (left){velocityX=-Math.abs(velocityX)-200;}
        if (right){velocityX=Math.abs(velocityX)+200;}
      }
      if (!down && !up){
        if (left){velocityX=-Math.abs(velocityX)-50;}
        if (right){velocityX=Math.abs(velocityX)+50;}
      }
      this.playSound();
      this.shouldShake = true;
      this.actor.cannonBody.body.velocity=new CANNON.Vec3(velocityX,velocityY,0);
      this.shakeCam(true);
      this.Animate(true);
      this.actualScore++;
      this.matchArbitrator.addActualScore();
      this.lastHit=0;
    }
  }
  
  touchTheGround(){
    if (this.actor.getPosition().x<0){
      this.matchArbitrator.addRightScore();
    } else if (this.actor.getPosition().x>0){
      this.matchArbitrator.addLeftScore();
    }
    this.actualScore = 0;
    this.matchArbitrator.resetActualScore();
  }
  
}
Sup.registerBehavior(BallBehavior);
