class BallIndicatorBehavior extends Sup.Behavior {
  private ball:Sup.Actor;
  private isVisible:Boolean;
  private spriteRenderer:Sup.SpriteRenderer;
  private textRenderers:Sup.TextRenderer[];
  awake() {
    this.spriteRenderer = this.actor.spriteRenderer;
    this.ball=Sup.getActor("Ball");
    this.isVisible=false;
    var childActors = this.actor.getChildren();
    var textRendererArray = [];
    childActors.forEach(function(element){textRendererArray.push(element.textRenderer)});
    this.textRenderers = textRendererArray;
    Sup.log(this.textRenderers);
  }

  update() {
    if (this.ball.getPosition().y>=80){
      this.isVisible=true;
      this.setText(Math.round(this.ball.getPosition().y-80));
      this.move(this.ball.getPosition().x);
    } else {
      this.isVisible=false;
      this.setText("");
    }
    this.animate();
  }
  
  animate(){
    if (this.isVisible){
      this.spriteRenderer.setAnimation("Visible",true);
    }
    else {
      this.spriteRenderer.setAnimation("Invisible",true);
    }
  }
  
  setText(text){
    this.textRenderers.forEach(function(textRenderer){textRenderer.setText(text);});
  }
  
  move(positionX){
    this.actor.setPosition(positionX,67);
  }
  

}
Sup.registerBehavior(BallIndicatorBehavior);
