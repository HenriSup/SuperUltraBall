class PlayerBehavior extends Sup.Behavior {
  
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
  private timeBetweenPunch=5;
  private lastPunch=0;
  private controleScheme;
  
  awake() {
    this.walkspeed=50;
    this.actualJump=0;
    this.maxJumpSize=700;
    this.minJumpSize=430;
    this.maxSpeed=60;
    this.textBox = this.actor.getChild("JumpVariableText");
    this.textBoxBackground = this.actor.getChild("JumpVariableTextBackground");
    this.variableText = this.actor.getChild("VelocityVariableText");
    this.hitBoxPunch = this.actor.getChild("HitBoxPunch").arcadeBody2D;
    if (this.playerNumber == 0){
      this.controleScheme = {left:'Q',right:'D',up:'Z',down:'S',punch:'V',jump:'B',dash:'N',
                             left2:'A',right2:'D',up2:'W',down2:'S',punch2:'V',jump2:'B',dash2:'N'};
    } 
    if (this.playerNumber == 1){
      this.controleScheme = {left:'LEFT',right:'RIGHT',up:'UP',down:'DOWN',punch:'I',jump:'O',dash:'P',
                             left2:'LEFT',right2:'RIGHT',up2:'UP',down2:'DOWN',punch2:'NUMPAD1',jump2:'NUMPAD2',dash2:'NUMPAD3'};
    }
  }
  
  update() {
    //0 = croix
    //1 = rond
    //2 = carré
    //3 = triangle
    //4 = L1
    //5 = R1
    //6 = L2
    //7 = R2
    //8 = select
    //9 = start
    //10 = L3
    //11 = R3
    //12 = up
    //13 = down
    //14 = left
    //15 = right
    var leftIsDown = Sup.Input.isKeyDown(this.controleScheme.left) || Sup.Input.isKeyDown(this.controleScheme.left2) || Sup.Input.isGamepadButtonDown(this.playerNumber,14);//Dpad left
    var rightIsDown = Sup.Input.isKeyDown(this.controleScheme.right) || Sup.Input.isKeyDown(this.controleScheme.right2) || Sup.Input.isGamepadButtonDown(this.playerNumber,15);//Dpad right
    var upIsDown = Sup.Input.isKeyDown(this.controleScheme.up) || Sup.Input.isKeyDown(this.controleScheme.up2) || Sup.Input.isGamepadButtonDown(this.playerNumber,12);//Dpad up
    var downIsDown = Sup.Input.isKeyDown(this.controleScheme.down) || Sup.Input.isKeyDown(this.controleScheme.down2) || Sup.Input.isGamepadButtonDown(this.playerNumber,13);//Dpad down
    var jumpIsPressed = Sup.Input.wasKeyJustPressed(this.controleScheme.jump) || Sup.Input.wasKeyJustPressed(this.controleScheme.jump2) || Sup.Input.wasGamepadButtonJustPressed(this.playerNumber,0);//croix
    var punchIsPressed = Sup.Input.wasKeyJustPressed(this.controleScheme.punch) || Sup.Input.wasKeyJustPressed(this.controleScheme.punch2) || Sup.Input.wasGamepadButtonJustPressed(this.playerNumber,2);//carré
    var dashIsDown = Sup.Input.isKeyDown(this.controleScheme.dash) || Sup.Input.isKeyDown(this.controleScheme.dash2) || Sup.Input.isGamepadButtonDown(this.playerNumber,1);//rond
    var dashWasJustReleased = Sup.Input.wasKeyJustReleased(this.controleScheme.dash) || Sup.Input.wasKeyJustReleased(this.controleScheme.dash2) || Sup.Input.wasGamepadButtonJustReleased(this.playerNumber,1);//rond
    
    var punch=false;
    var x=this.getVelocity();
    if ((leftIsDown || rightIsDown)&& !(leftIsDown && rightIsDown) && this.actualJump!=0 && !dashIsDown){
      this.actor.cannonBody.body.linearDamping=0;
    }
    else {
      this.actor.cannonBody.body.linearDamping=0.99;
    }
      
    var chargeJump = false;
    var y=this.actor.cannonBody.body.velocity.y;
    var positionY = this.actor.getY();
    var positionX = this.actor.getX();
    var canjump=true;
    
    if (leftIsDown)
    {
      if (x>(-this.maxSpeed)){
        x+=-this.walkspeed;
      }
    }

    if (rightIsDown)
      {
        if (x<this.maxSpeed){
          x+=this.walkspeed;
        }
      }

    if (punchIsPressed)
      {
        punch=true;
   
      }
    
    if (positionY> (-59))
    {
      canjump=false;
      y+=-20;
    }
    else {
      this.actor.setY(-59);
      y=0;
    }
    
    if (dashIsDown && canjump)
    {
      chargeJump=true;
      if (this.actualJump>200){
        if (this.actor.cannonBody.body.velocity.x>0){
          x=this.actor.cannonBody.body.velocity.x-1;
        }else if (this.actor.cannonBody.body.velocity.x<0){
          x=this.actor.cannonBody.body.velocity.x+1;
        }
      }
     
      if (this.actualJump<this.maxJumpSize){
        this.actualJump+=18;
      }
    }
    if (dashWasJustReleased && canjump)
    {
      if (this.actualJump<this.minJumpSize) {
        this.actualJump=this.minJumpSize;
      }
      this.jumpSoundPlayer.setPitch(0.5);
      this.jumpSoundPlayer.play();
      if (this.actualJump>=this.maxJumpSize){
        if (leftIsDown){
          x+=-this.actualJump/2;
        }if (rightIsDown){
          x+=this.actualJump/2;
        }
      }
      y+=this.actualJump*0.9;
      this.actualJump=0;
    }   
    
    if ( jumpIsPressed && canjump && !dashIsDown)
    {
      this.jumpSoundPlayer.setPitch(0.5);
      this.jumpSoundPlayer.play();
      y+=400;
    }
    
    if (positionX>(78)) {
      if (x>0) {x=-10;}
    }
    if (positionX<(-78)) {
      if (x<0) {x=10;}
    }
    this.lastPunch++;
    if (this.isPlayingPunchAnimation() && this.canPunch()) {this.punch()};
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(x,y,0);
    this.animate(x,y,chargeJump,punch); 
    this.moveHitBox();
  }
  
  canPunch(){
    return (this.lastPunch>this.timeBetweenPunch);
  }
  
  animate(x,y,chargeJump,punch) {
    var leftIsDown = Sup.Input.isKeyDown(this.controleScheme.left) || Sup.Input.isKeyDown(this.controleScheme.left2) || Sup.Input.isGamepadButtonDown(this.playerNumber,14);//Dpad left
    var rightIsDown = Sup.Input.isKeyDown(this.controleScheme.right) || Sup.Input.isKeyDown(this.controleScheme.right2) || Sup.Input.isGamepadButtonDown(this.playerNumber,15);//Dpad right
    var upIsDown = Sup.Input.isKeyDown(this.controleScheme.up) || Sup.Input.isKeyDown(this.controleScheme.up2) || Sup.Input.isGamepadButtonDown(this.playerNumber,12);//Dpad up
    var downIsDown = Sup.Input.isKeyDown(this.controleScheme.down) || Sup.Input.isKeyDown(this.controleScheme.down2) || Sup.Input.isGamepadButtonDown(this.playerNumber,13);//Dpad down
    var run = false;
    var facingLeft = this.actor.spriteRenderer.getHorizontalFlip();
    if (x>5 || x<-5) {run = true}; 
    if (rightIsDown){ facingLeft=false;}
    if (leftIsDown){ facingLeft=true;}
    if ((punch || this.isPlayingPunchAnimation())&&this.actor.spriteRenderer.getAnimationFrameIndex()!=3) {
      if (!this.isPlayingPunchAnimation()){
        var animationName = "punchDirect";
        if (upIsDown){ animationName="punchUp";}
        if (downIsDown){ animationName="punchDown";}
        this.actor.spriteRenderer.setAnimation(animationName,true);
      }
    }
    else {
      if (chargeJump){
        this.actor.spriteRenderer.setAnimation("charginJump",true);
        if (this.actualJump<this.maxJumpSize) {
          this.jumpLoadingSoundPlayer.play();
        }
      }
      else {
        this.jumpLoadingSoundPlayer.stop();
        if (y!=0){
          if (y>0){
           this.actor.spriteRenderer.setAnimation("inAirUp",true);
          } 
          if (y<0){
           this.actor.spriteRenderer.setAnimation("inAirDown",true);
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
      this.actor.spriteRenderer.setHorizontalFlip(facingLeft);
    }
  }
  
  isPlayingPunchAnimation() {
    var anim = false;
    if (this.actor.spriteRenderer.getAnimation()=="punchDirect") {
      anim = true;
    }
    if (this.actor.spriteRenderer.getAnimation()=="punchUp") {
      anim = true;
    }
    if (this.actor.spriteRenderer.getAnimation()=="punchDown") {
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
  
  punch(){
    this.lastPunch=0;
    var test = Sup.ArcadePhysics2D.intersects(this.hitBoxPunch,Sup.getActor("Ball").arcadeBody2D);
    if (test) {
      var upIsDown = Sup.Input.isKeyDown(this.controleScheme.up) || Sup.Input.isKeyDown(this.controleScheme.up2) || Sup.Input.isGamepadButtonDown(this.playerNumber,12);//Dpad up
      var downIsDown = Sup.Input.isKeyDown(this.controleScheme.down) || Sup.Input.isKeyDown(this.controleScheme.down2) || Sup.Input.isGamepadButtonDown(this.playerNumber,13);//Dpad down
      var left = this.actor.spriteRenderer.getHorizontalFlip();
      var right = !this.actor.spriteRenderer.getHorizontalFlip();
      var up = upIsDown;
      var down = downIsDown;
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
}
Sup.registerBehavior(PlayerBehavior);
