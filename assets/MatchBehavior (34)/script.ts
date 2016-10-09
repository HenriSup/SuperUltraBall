class MatchBehavior extends Sup.Behavior {
  private leftScoreTextRenderers:Sup.TextRenderer[];
  private rightScoreTextRenderers:Sup.TextRenderer[];
  private leftScoreActor:Sup.Actor;
  private rightScoreActor:Sup.Actor;
  private leftScore:number=0;
  private rightScore:number=0;
  private actualScore:number=0;
  private hasBeenShakingFor:number;
  private timeShaking:number=60;
  private startShake:boolean=false;
  private serviceLeft=true;
 
  awake() {
    this.leftScoreActor = Sup.getActor("LeftScore");
    this.rightScoreActor = Sup.getActor("RightScore");
    var leftScoreChildActors = this.leftScoreActor.getChildren();
    var rightScoreChildActors = this.rightScoreActor.getChildren();
    var leftScoretextRendererArray = [];
    var rightScoretextRendererArray = [];
    leftScoreChildActors.forEach(function(element){leftScoretextRendererArray.push(element.textRenderer)});
    rightScoreChildActors.forEach(function(element){rightScoretextRendererArray.push(element.textRenderer)});
    this.leftScoreTextRenderers = leftScoretextRendererArray;
    this.rightScoreTextRenderers = rightScoretextRendererArray;
  }

  update() {
    this.updateScores();
    this.checkScores();
    this.shakeCam(this.startShake);
  }
  
  updateScores(){
    this.setLeftScoreTextRenderer(this.leftScore);
    this.setRightScoreTextRenderer(this.rightScore);
  }
  
  checkScores(){
    if (this.leftScore>=50) {
      this.winner(0);
    } else if (this.rightScore>=50) {
      this.winner(1);
    }
  }
  
  winner(Player) {
    // afficher winner sur le nom du joueur, faire bumper le text winner
    // transformer le second joueur ?
  }
  
  setLeftScoreTextRenderer(text){
    this.leftScoreTextRenderers.forEach(function(textRenderer){textRenderer.setText(text);});
  }
  setRightScoreTextRenderer(text){
    this.rightScoreTextRenderers.forEach(function(textRenderer){textRenderer.setText(text);});
  }
  
  addLeftScore(){
    this.leftScore+=this.actualScore;
    this.serviceLeft=false;
    this.nextRound();
  }
  addRightScore(){
    this.rightScore+=this.actualScore;
    this.serviceLeft=true;
    this.nextRound();
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
  
  nextRound(){
    var scene = Sup.appendScene("prefab/TransitionPrefab")[0];
    scene.setPosition(0,0,19);
  }
  
  restartRound(){
    Sup.getActor('Player1').cannonBody.body.position=new CANNON.Vec3(-50,-59,1);
    Sup.getActor('Player1').spriteRenderer.setHorizontalFlip(false);
    Sup.getActor('Player2').cannonBody.body.position=new CANNON.Vec3(50,-59,1);
    Sup.getActor('Player2').spriteRenderer.setHorizontalFlip(true);
    if (this.serviceLeft){
      Sup.getActor('Ball').cannonBody.body.position=new CANNON.Vec3(-40,-30,1);
      Sup.getActor('Ball').getBehavior(BallBehavior).resetFirstHit();
    } else {
      Sup.getActor('Ball').cannonBody.body.position=new CANNON.Vec3(40,-30,1);
      Sup.getActor('Ball').getBehavior(BallBehavior).resetFirstHit();
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


