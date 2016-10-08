class MatchBehavior extends Sup.Behavior {
  private leftScoreTextRenderers:Sup.TextRenderer[];
  private rightScoreTextRenderers:Sup.TextRenderer[];
  private actualScoreTextRenderers:Sup.TextRenderer[];
  private leftScoreActor:Sup.Actor;
  private rightScoreActor:Sup.Actor;
  private actualScoreActor:Sup.Actor;
  private leftScore:number;
  private rightScore:number;
  private actualScore:number;
 
  awake() {
    this.leftScoreActor = Sup.getActor("LeftScore");
    this.rightScoreActor = Sup.getActor("RightScore");
    this.actualScoreActor = Sup.getActor("ActualScore");
    var leftScoreChildActors = this.leftScoreActor.getChildren();
    var rightScoreChildActors = this.rightScoreActor.getChildren();
    var actualScoreChildActors = this.actualScoreActor.getChildren();
    var leftScoretextRendererArray = [];
    var rightScoretextRendererArray = [];
    var actualScoretextRendererArray = [];
    leftScoreChildActors.forEach(function(element){leftScoretextRendererArray.push(element.textRenderer)});
    rightScoreChildActors.forEach(function(element){leftScoretextRendererArray.push(element.textRenderer)});
    actualScoreChildActors.forEach(function(element){leftScoretextRendererArray.push(element.textRenderer)});
    this.leftScoreTextRenderers = leftScoretextRendererArray;
    this.rightScoreTextRenderers = leftScoretextRendererArray;
    this.actualScoreTextRenderers = leftScoretextRendererArray;
  }

  update() {
    this.updateScores();
    this.checkScores();
  }
  
  updateScores(){
    this.setLeftScoreTextRenderer(this.leftScore);
    this.setRightScoreTextRenderer(this.rightScore);
    this.setActualScoreTextRenderer(this.actualScore);
  }
  
  checkScores(){
    if (this.leftScore>=50) {
      this.winner(0);
    } else if (this.rightScore>=50) {
      this.winner(1);
    }
  }
  
  winner(Player) {
    // afficher winner sur le nom du joueur, faire bumper le winner
    // transformer le second joueur ?
  }
  
  setLeftScoreTextRenderer(text){
    this.leftScoreTextRenderers.forEach(function(textRenderer){textRenderer.setText(text);});
  }
  setRightScoreTextRenderer(text){
    this.rightScoreTextRenderers.forEach(function(textRenderer){textRenderer.setText(text);});
  }
  setActualScoreTextRenderer(text){
    this.actualScoreTextRenderers.forEach(function(textRenderer){textRenderer.setText(text);});
  }
}
Sup.registerBehavior(MatchBehavior);


