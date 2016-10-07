class PlayerBehavior extends Sup.Behavior {
  private actualJump: number;  
  private jumpSize: number;
  
  awake() {
    this.actualJump=0;
    this.jumpSize=230;
  }
  
  update() {
    
    var x=0;
    var chargeJump = false;
    var y=this.actor.cannonBody.body.velocity.y;
    var positionY = this.actor.getY();
    var canjump=true;
    if (Sup.Input.isKeyDown('Q'))
      {
        x+=-60;
      }
    
    if (Sup.Input.isKeyDown('D'))
      {
        x+=60;
      }
    
    if (positionY> (-59))
    {
      canjump=false;
      y+=-5;
    }
    else {
      this.actor.setY(-59);
      y=0;
    }
      
    if (Sup.Input.isKeyDown('Z') && canjump)
    {
      chargeJump=true;
      if (this.actor.cannonBody.body.velocity.x>0){
        x=this.actor.cannonBody.body.velocity.x-1;
      }else if (this.actor.cannonBody.body.velocity.x<0){
        x=this.actor.cannonBody.body.velocity.x+1;
      }else {x=0;}
      if (this.actualJump<this.jumpSize) {
        this.actualJump+=5;
      }
      
    }
    if (Sup.Input.wasKeyJustReleased('Z') && canjump)
    {
      y+=this.actualJump;
      this.actualJump = 0;
    }
    
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(x,y,0);
    this.animate(x,y,chargeJump);
    this.actor.spriteRenderer.setAnimation("Wave");
  }
  
  animate(x,y,chargeJump) {
    var run = false;
    var facingLeft = this.actor.spriteRenderer.getHorizontalFlip();
    if (x!=0) {run = true};
    if (x!=0 && x>0){ facingLeft=false;}
    if (x!=0 && x<0){ facingLeft=true;}
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
Sup.registerBehavior(PlayerBehavior);
