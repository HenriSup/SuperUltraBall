class MenuBehavior extends Sup.Behavior {
  private frameCounter = 0;
  private MenuSelect:Sup.Actor;
  private fondu:Sup.SpriteRenderer;
  private transition:Sup.SpriteRenderer;
  private leftSelected=true;
  private controleScheme;
  private validated=false;
  private ValidateSound=new Sup.Audio.SoundPlayer("Sounds/Validate", 0.8, { loop: false });
  private SwitchSelectSound=new Sup.Audio.SoundPlayer("Sounds/SwitchSelect", 0.6, { loop: false });
  private SuperUltraBallSound=new Sup.Audio.SoundPlayer("Sounds/SuperUltraBall", 0.6, { loop: false });
  awake() {
    this.SuperUltraBallSound.setPitch(0);
    this.SuperUltraBallSound.play();
    this.MenuSelect = Sup.getActor("Select");
    this.fondu = Sup.getActor("Fondu").spriteRenderer;
    this.transition = Sup.getActor("Transition").spriteRenderer;
    this.fondu.setAnimation("Fondu",false);
    this.controleScheme = {left:'LEFT',right:'RIGHT',validate:'RETURN',
                             left2:'Q',right2:'D',validate2:'SPACE'};
  }

  update() {
    this.frameCounter++;
    //0 = croix
    //9 = start
    //14 = left
    //15 = right
    var leftIsPressed = Sup.Input.wasKeyJustPressed(this.controleScheme.left) || Sup.Input.wasKeyJustPressed(this.controleScheme.left2) || Sup.Input.wasGamepadButtonJustPressed(0,14);//croix
    var rightIsPressed = Sup.Input.wasKeyJustPressed(this.controleScheme.right) || Sup.Input.wasKeyJustPressed(this.controleScheme.right2) || Sup.Input.wasGamepadButtonJustPressed(0,15);
    var validateIsPressed = Sup.Input.wasKeyJustPressed(this.controleScheme.validate) || Sup.Input.wasKeyJustPressed(this.controleScheme.validate2) || Sup.Input.wasGamepadButtonJustPressed(0,0)|| Sup.Input.wasGamepadButtonJustPressed(0,9);
    if (leftIsPressed && !this.leftSelected){
      this.SwitchSelectSound.setPitch(3);
      this.SwitchSelectSound.play();
    }
    if (rightIsPressed && this.leftSelected){
      this.SwitchSelectSound.setPitch(3);
      this.SwitchSelectSound.play();
    }
    
    if (!this.validated){
      this.changeSelection(leftIsPressed,rightIsPressed);
    }
    
    this.validateSelection(validateIsPressed);
    this.animateMenu();
  }
  
  animateMenu(){
    if (this.MenuSelect.spriteRenderer.getAnimation()== "ValidateLeft" || this.MenuSelect.spriteRenderer.getAnimation()== "ValidateRight" && this.MenuSelect.spriteRenderer.getAnimationFrameIndex() >= 3 ){
      if(this.transition.getAnimationFrameIndex()>=26){
        this.launchMode();
      }
      
    }
    if(this.leftSelected){
      if (this.validated) {
        this.MenuSelect.spriteRenderer.setAnimation("ValidateLeft",false);
      } else
      if (this.MenuSelect.spriteRenderer.getAnimation()!="SelectLeft"){
        this.MenuSelect.spriteRenderer.setAnimation("SelectLeft",true);
      }
    }
    else {
      if (this.validated) {
        this.MenuSelect.spriteRenderer.setAnimation("ValidateRight",false);
      } else
      if (this.MenuSelect.spriteRenderer.getAnimation()!="SelectRight"){
        this.MenuSelect.spriteRenderer.setAnimation("SelectRight",true);
      }
    }
  }
  changeSelection(left,right){
    
    if (left){
      this.leftSelected=true;
    } else if (right){
      this.leftSelected=false;
    }
    
  }
  
  validateSelection(button){
    if(button){
      
      this.validated=true;
      this.ValidateSound.play();
      this.transition.setAnimation("TransitionDebut",false);
    }
  }
  
  launchMode(){
    if (this.leftSelected){
      Sup.loadScene("BotMatch");
    } else {
      Sup.loadScene("Match");
    }
  }
}
Sup.registerBehavior(MenuBehavior);
