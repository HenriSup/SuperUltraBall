class ShipBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    if (Sup.Input.isKeyDown('Q'))
      {
        this.actor.cannonBody.body.velocity=new CANNON.Vec3(-3,0,0);
      }
  }
}
Sup.registerBehavior(ShipBehavior);
