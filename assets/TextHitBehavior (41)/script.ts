class TextHitBehavior extends Sup.Behavior {
  
  private firstPush=true;
  public activated=false;
  public value:number=0;
  private TextRenderers:Sup.TextRenderer[];
  public timeLeftAlive=500;
  

  awake() {
    var ChildActors = this.actor.getChildren();
    var textRendererArray = [];
    ChildActors.forEach(function(element){textRendererArray.push(element.textRenderer)});
    this.TextRenderers = textRendererArray;
    this.setTextRenderer(" ");
  }

  update() {
    this.timeLeftAlive--;
    if (this.timeLeftAlive<=0){
      this.actor.destroy();
      this.destroy();
    }
    if (this.activated){
      this.setTextRenderer(this.value);
    }
    var y=this.actor.cannonBody.body.velocity.y;
    var x=this.actor.cannonBody.body.velocity.x;
    if (this.firstPush){
      y+=100;
      var lower = -50;
      var higher = 50;
      var random = (Math.random() * (higher-lower)) + lower;
      x+=random;
      this.firstPush=false;
    }
    y+=-5;
    this.actor.cannonBody.body.velocity=new CANNON.Vec3(x,y,0);
  }
  
   setTextRenderer(text){
    this.TextRenderers.forEach(function(textRenderer){textRenderer.setText(text);});
  }
}
Sup.registerBehavior(TextHitBehavior);
