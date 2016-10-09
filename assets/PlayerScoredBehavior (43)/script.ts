class PlayerScoredBehavior extends Sup.Behavior {
  
  private firstPush=true;
  public activated=false;
  public value:String=" ";
  private TextRenderers:Sup.TextRenderer[];
  public timeLeftAlive=200;
  

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
      var scene = Sup.appendScene("prefab/TransitionPrefab")[0];
      scene.setPosition(0,0,18);
      this.actor.destroy();
      this.destroy();
    }
    if (this.activated){
      this.setTextRenderer(this.value);
    }

   
  }
  
   setTextRenderer(text){
    this.TextRenderers.forEach(function(textRenderer){textRenderer.setText(text);});
  }
}
Sup.registerBehavior(PlayerScoredBehavior);
