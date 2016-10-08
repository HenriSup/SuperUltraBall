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
  private actualScoreVisibility:number=0;
  private visibilityTime:number=120;
  private hasBeenShakingFor:number;
  private timeShaking:number=60;
  private startShake:boolean=false;
 
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
    this.shakeCam(this.startShake);
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
    this.actualScoreVisibility=this.visibilityTime;
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
  
  actualScoreVisiblityCheck(){
    if (this.actualScoreVisibility>0){
      this.actualScoreVisibility--;
    }
    if (this.actualScoreVisibility<=0){
      this.setActualScoreTextRenderer("");
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
}
Sup.registerBehavior(MatchBehavior);


