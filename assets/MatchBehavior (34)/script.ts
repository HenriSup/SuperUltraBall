class MatchBehavior extends Sup.Behavior {
  private leftScoreTextRenderers:Sup.TextRenderer[];
  private rightScoreTextRenderers:Sup.TextRenderer[];
  private actualScoreTextRenderers:Sup.TextRenderer[];
  private leftScoreActor:Sup.Actor;
  private rightScoreActor:Sup.Actor;
  private actualScoreActor:Sup.Actor;
  private leftScore:number=0;
  private rightScore:number=0;
  private actualScore:number=0;
 
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
    rightScoreChildActors.forEach(function(element){rightScoretextRendererArray.push(element.textRenderer)});
    actualScoreChildActors.forEach(function(element){actualScoretextRendererArray.push(element.textRenderer)});
    this.leftScoreTextRenderers = leftScoretextRendererArray;
    this.rightScoreTextRenderers = rightScoretextRendererArray;
    this.actualScoreTextRenderers = actualScoretextRendererArray;
  }

  update() {
    this.updateScores();
    this.checkScores();
    Sup.log(this.leftScore+" "+this.actualScore+" "+this.rightScore);
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
  
  addLeftScore(){
    this.leftScore+=this.actualScore;
  }
  addRightScore(){
    this.rightScore+=this.actualScore;
  }
  addActualScore(){
    this.actualScore++;
  }
  resetLeftScore(){
    this.leftScore=0;
  }
  resetRightScore(){
    this.rightScore=0;
  }
  resetActualScore(){
    this.actualScore=0;
  }
}
Sup.registerBehavior(MatchBehavior);


