class PlayerBehavior extends Sup.Behavior {
  
  private actualJump:number;
  private maxJumpSize:number;
  private minJumpSize:number;
  private maxSpeed:number;

  private textBox:Sup.Actor;  
  private textBoxBackground:Sup.Actor;  
  private variableText:Sup.Actor;  
  awake() {
    this.actualJump=0;
    this.maxJumpSize=700;
    this.minJumpSize=430;
    this.maxSpeed=60;   
    this.textBox = this.actor.getChild("JumpVariableText");
    this.textBoxBackground = this.actor.getChild("JumpVariableTextBackground");
    this.variableText = this.actor.getChild("VelocityVariableText");
  }
  
  update() {
    var punch=false;
    var x=this.getVelocity();
    this.actor.cannonBody.body.linearDamping=0.99;
    var chargeJump = false;
    var y=this.actor.cannonBody.body.velocity.y;
    var positionY = this.actor.getY();
    var canjump=true;
    if (Sup.Input.isKeyDown('Q'))
      {
        if (x>(-this.maxSpeed)){
          x+=-10;
        }
      }
    
    if (Sup.Input.isKeyDown('D'))
      {
        if (x<this.maxSpeed){
          x+=10;
        }
      }
    if (Sup.Input.wasKeyJustPressed('U'))
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
    
    if (Sup.Input.isKeyDown('Z') && canjump)
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
        this.actualJump+=20;
      }
    }
    if (Sup.Input.wasKeyJustReleased('Z') && canjump)
    {
      if (this.actualJump<this.minJumpSize) {
        this.actualJump=this.minJumpSize;
      }
      y+=this.actualJump;
      this.actualJump=0;
    }
    
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(x,y,0);
    this.animate(x,y,chargeJump,punch);
    
//     this.textBox.textRenderer.setText(this.actualJump.toString());
//     this.textBoxBackground.textRenderer.setText(this.actualJump.toString());
//     this.variableText.textRenderer.setText(this.actor.cannonBody.body.velocity.x.toString());
    
  }
  
  animate(x,y,chargeJump,punch) {
    var run = false;
    var facingLeft = this.actor.spriteRenderer.getHorizontalFlip();
    if (x>5 || x<-5) {run = true};
    if (x!=0 && x>0){ facingLeft=false;}
    if (x!=0 && x<0){ facingLeft=true;}
    if (punch || ((this.actor.spriteRenderer.getAnimation()=="punch"))&&this.actor.spriteRenderer.getAnimationFrameIndex()!=3) {
      if (this.actor.spriteRenderer.getAnimation()!="punch"){
        this.actor.spriteRenderer.setAnimation("punch",true);
      }
    }
    else {
      if (chargeJump){
        this.actor.spriteRenderer.setAnimation("charginJump",true);
            }
        else {
          if (y>0){
            this.actor.spriteRenderer.setAnimation("inAir",true);
          }
          else {
            if (run) {
              this.actor.spriteRenderer.setAnimation("run",true);
            }
            else {


              this.actor.spriteRenderer.setAnimation("idle",true);}

          }

          this.actor.spriteRenderer.setHorizontalFlip(facingLeft);
        }
      }
    }
  
  getVelocity() {
    var x=this.actor.cannonBody.body.velocity.x;
  
      if (-1<x && x<1){
        x=0;
      }

    return x;
  }
}
Sup.registerBehavior(PlayerBehavior);
