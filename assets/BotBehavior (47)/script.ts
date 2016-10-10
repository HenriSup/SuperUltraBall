class BotBehavior extends Sup.Behavior {
  
  public playerNumber:number;
  private actualJump:number;
  private maxJumpSize:number;
  private minJumpSize:number;
  private maxSpeed:number;
  private jumpSoundPlayer = new Sup.Audio.SoundPlayer("Sounds/Jump", 0.3, { loop: false });
  private jumpLoadingSoundPlayer = new Sup.Audio.SoundPlayer("Sounds/JumpLoading", 0.1, { loop: false });
  private textBox:Sup.Actor;  
  private textBoxBackground:Sup.Actor;
  private variableText:Sup.Actor;
  private hitBoxPunch:Sup.ArcadePhysics2D.Body;
  private walkspeed;
  private shouldGoRight:boolean;
  private shouldGoLeft:boolean;
  private shouldChill:boolean;
  awake() {
    this.walkspeed=50;
    this.maxSpeed=60;
    this.hitBoxPunch = this.actor.getChild("HitBoxPunch").arcadeBody2D;
    
  }
  
  update() {
    
    var punch=false;
    this.shouldChill=false;
    this.shouldGoLeft=false;
    this.shouldGoRight=false;
    var x=this.getVelocity();
    this.actor.cannonBody.body.linearDamping=0.99;
      
    var y=this.actor.cannonBody.body.velocity.y;
    var positionY = this.actor.getY();
    var positionX = this.actor.getX();
    var ballX= Sup.getActor("Ball").getPosition().x;
    
    if (ballX<=0) {
      this.goToCenterAndChill();
    }
    if (ballX>0){
      this.goToBall();
    }
    
    if (this.shouldGoLeft)
    {
      if (x>(-this.maxSpeed)){
        x+=-this.walkspeed;
      }
    }

    if (this.shouldGoRight)
    {
      if (x<this.maxSpeed){
        x+=this.walkspeed;
      }
    }

    if(Sup.ArcadePhysics2D.intersects(this.hitBoxPunch,Sup.getActor("Ball").arcadeBody2D)){
      punch=true;
    }
    
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(x,y,0);
    this.animate(x,y,punch); 
    this.moveHitBox();
    if (Sup.ArcadePhysics2D.intersects(this.hitBoxPunch,Sup.getActor("Ball").arcadeBody2D)){
      this.punch();
    }   
  }
  
  
  animate(x,y,punch) {
    var run = false;
    var facingLeft = this.actor.spriteRenderer.getHorizontalFlip();
    if (x>5 || x<-5) {run = true}; 
    if (x>0){ facingLeft=false;}
    if (x<0){ facingLeft=true;}
    if(this.shouldChill){
      if (this.actor.spriteRenderer.getAnimation()!="chillIn") {
        this.actor.spriteRenderer.setAnimation("chillIn",false); // CHANGE
      }
      
    } else {
      if (this.actor.spriteRenderer.getAnimation()=="chillIn" || this.actor.spriteRenderer.getAnimation()=="chillOut"){
        if (this.actor.spriteRenderer.getAnimation()=="chillIn"){
            this.actor.spriteRenderer.setAnimation("chillOut",false);
        } else if (this.actor.spriteRenderer.getAnimation()=="chillOut"){
          if(this.actor.spriteRenderer.getAnimationFrameIndex()>=4){
            this.actor.spriteRenderer.setAnimation("idle",true);
          }
        }
      } else 
      
    if ((punch || this.isPlayingPunchAnimation())&&this.actor.spriteRenderer.getAnimationFrameIndex()!=10) {
      if (!this.isPlayingPunchAnimation()){
        var animationName = "punch";
        this.actor.spriteRenderer.setAnimation(animationName,true);
      }
    }
    else {
      if (run) {
        this.actor.spriteRenderer.setAnimation("run",true);
      }
      else {
        this.actor.spriteRenderer.setAnimation("idle",true);
      }
    }
      
    }
    
    
  }

  
  isPlayingPunchAnimation() {
    var anim = false;
    if (this.actor.spriteRenderer.getAnimation()=="punch") {
      anim = true;
    }
    return anim;
  }
  
  getVelocity() {
    var x=this.actor.cannonBody.body.velocity.x;
  
      if (-1<x && x<1){
        x=0;
      }

    return x;
  }
  
  goToBall(){
    var posXBall = Sup.getActor("Ball").getPosition().x;
    var posXBot = this.actor.getPosition().x;
    var ballVelocity = Sup.getActor("Ball").cannonBody.body.velocity.x;
    if (!(posXBall+ballVelocity>73 || posXBall+ballVelocity<5)){ballVelocity=0;}
    if (posXBot<posXBall+ballVelocity && posXBot<70){
      this.shouldGoRight=true;
    }else if((posXBot>posXBall+ballVelocity && posXBot>20)){
      this.shouldGoLeft=true;
    }
    
  
  }
  
  goToCenterAndChill(){
    var x= this.actor.getPosition().x;
    if (x<60 && x>40){
      this.shouldChill=true;
    }
    else {
       if (x<50 ) {
        this.shouldGoRight=true;
      }
      if (x>50){
        this.shouldGoLeft=true;
      }
    }
     
  }
  
  punch(){
    if ((this.isPlayingPunchAnimation())&&this.actor.spriteRenderer.getAnimationFrameIndex()>2) {
        
        var left = true;
        var right = false;
        var up = true;
        var down = false;
        Sup.getActor("Ball").getBehavior(BallBehavior).gotPunched(left,right,up,down);
      
    }
    
  }
  
  moveHitBox(){
    if (this.actor.spriteRenderer.getHorizontalFlip()){
      this.hitBoxPunch.warpPosition(this.actor.getPosition().x-11,this.actor.getPosition().y);
    }
    else {
      this.hitBoxPunch.warpPosition(this.actor.getPosition().x+11,this.actor.getPosition().y);
    }
  }
  
  isMoving(){
    var returnValue = false;
    if (this.actor.cannonBody.body.velocity.x >0.1){
      returnValue=true;
    }
    return returnValue;
  }
}
Sup.registerBehavior(BotBehavior);
