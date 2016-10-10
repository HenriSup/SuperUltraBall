class IntroBehavior extends Sup.Behavior {
  private frameCounter = 0;
  private Noxi:Sup.Actor;
  private Fond:Sup.SpriteRenderer;
  private FondNoir:Sup.SpriteRenderer;
  private Logo:Sup.SpriteRenderer;
  private LogoSound=new Sup.Audio.SoundPlayer("Sounds/StartSound", 0.8, { loop: false });
  private IntroMusic=new Sup.Audio.SoundPlayer("Sounds/IntroMusic", 0.6, { loop: false });
  private JumpChargeSound=new Sup.Audio.SoundPlayer("Sounds/JumpLoading", 0.4, { loop: false });
  private JumpSound=new Sup.Audio.SoundPlayer("Sounds/Jump", 0.4, { loop: false });
  private net:Sup.Actor;
  
  awake() {
    this.Noxi = Sup.getActor("Noxi");
    this.Fond = Sup.getActor("Fond").spriteRenderer;
    this.FondNoir = Sup.getActor("FondNoir").spriteRenderer;
    this.Logo = Sup.getActor("Logo").spriteRenderer;
    this.Fond.setOpacity(1);
    this.FondNoir.setOpacity(0);
    this.Logo.setOpacity(0);
    this.net = Sup.appendScene("prefab/NetPrefab")[0];
    this.net.getBehavior(NetBehavior).moveSpeed=0;
    this.net.setPosition(-1460,0,4);
  }

  update() {
    this.frameCounter++;
    if (this.frameCounter>60 && this.frameCounter < 60*4){
      this.phase1();
    }if (this.frameCounter>=60*4 && this.frameCounter < 60*19){
      this.phase2();
    }
    if (this.frameCounter==60*19){
      this.JumpSound.setPitch(-1);
      this.JumpSound.play();
      this.Noxi.spriteRenderer.setAnimation("InAirUp");
      
    }
    if (this.frameCounter>=60*19){
      var noxiX = this.Noxi.getPosition().x;
      var noxiY = this.Noxi.getPosition().y;
      
      noxiY+=1;
     
      
      this.Noxi.setPosition(noxiX,noxiY);
      if (noxiY>=55){
        Sup.loadScene("Menu");
      }
      
    }
  }
  
  phase1(){
    this.Fond.setOpacity(1);
    this.FondNoir.setOpacity(0);
    if (this.Logo.getAnimation()!="In" && this.frameCounter<60*3){
      this.Logo.setOpacity(1);
      this.Logo.setAnimation("In",false);
    }
    if (this.Logo.getAnimationFrameIndex()==1  && this.frameCounter<60*3){
      this.LogoSound.setPitch(0.3);
      this.LogoSound.play();
    }
    if (this.frameCounter==60*3){
      this.Logo.setAnimation("Out",false);
    }
  }
  phase2(){
    this.Fond.setOpacity(0);
    this.FondNoir.setOpacity(1);
    if(this.frameCounter==60*4){
      this.IntroMusic.play();
    }
    var x= this.Noxi.getPosition().x;
    var y= this.Noxi.getPosition().y;
    var z= this.Noxi.getPosition().z;
    if(this.frameCounter % 2 == 0){
      x--;
    }
    
    if (x!=0){
      this.Noxi.setPosition(x,y,z);
    }
    if (this.frameCounter==80*4){
      for (var i=0;i<60;i++){
        var arbreX=this.getRandom(-1300,-150);
        var arbreY=this.getRandom(-30,40);
        var arbreZ=0;
        if(arbreY>0){
          arbreZ=-arbreY/2;
        } else {
          arbreZ=Math.abs(arbreY)/2;
        }
        var moveSpeed=2;
      
        var tree = Sup.appendScene("prefab/TreePrefab")[0];
        tree.getBehavior(TreeBehavior).moveSpeed=moveSpeed;
        tree.setPosition(arbreX,arbreY,arbreZ);
      }
      this.net.getBehavior(NetBehavior).moveSpeed=2;
    }
    if (this.net.getPosition().x==0){
      if (this.Noxi.spriteRenderer.getAnimation()!="JumpCharge"){
        this.Noxi.spriteRenderer.setAnimation("JumpCharge",true);
        this.JumpChargeSound.setPitch(-1);
        this.JumpChargeSound.play();
      }
    }
    
    
  }
  phase3(){
    
  }
  
  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
}
Sup.registerBehavior(IntroBehavior);
