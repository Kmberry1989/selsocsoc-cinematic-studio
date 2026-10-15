(function(global){
  'use strict';

  const ZERO={position:[0,0,0],rotation:[0,0,0]};
  function part(position,rotation){return {position:position||ZERO.position.slice(),rotation:rotation||ZERO.rotation.slice()}}
  function complete(duration,body,head,leftHand,rightHand,leftFoot,rightFoot,label){return {label:label,duration:duration,parts:{body:body||part(),head:head||part(),leftHand:leftHand||part(),rightHand:rightHand||part(),leftFoot:leftFoot||part(),rightFoot:rightFoot||part()}}}

  // Additive transforms relative to the avatar rig's authored rest pose. This data has
  // no studio/UI dependencies and can be consumed by the game unchanged.
  const POSES=Object.freeze({
    neutral:complete(420,part(),part(),part(),part(),part(),part(),'Neutral'),
    wave:complete(520,
      part([-.018,.01,0],[0,0,-.025]),part([0,.015,0],[0,0,.11]),
      part([-.02,.03,0],[0,0,.05]),part([.08,.82,.04],[.05,0,-.22]),
      part(),part(),'Wave'),
    bow:complete(620,
      part([0,-.055,.075],[.32,0,0]),part([0,-.105,.16],[.27,0,0]),
      part([.05,-.05,.11],[.18,0,-.05]),part([-.05,-.05,.11],[.18,0,.05]),
      part([0,0,.025],[0,0,0]),part([0,0,.025],[0,0,0]),'Bow'),
    cheer:complete(480,
      part([0,.025,0],[0,0,0]),part([0,.04,0],[0,0,0]),
      part([-.12,.84,.015],[0,0,.18]),part([.12,.84,.015],[0,0,-.18]),
      part([-.025,.025,0],[0,0,-.04]),part([.025,.025,0],[0,0,.04]),'Cheer'),
    point:complete(540,
      part([-.025,.01,0],[0,-.08,-.025]),part([0,.01,0],[0,-.26,-.035]),
      part([-.03,.04,0],[0,0,.04]),part([.23,.16,.52],[-.18,-.05,-.18]),
      part(),part(),'Point'),
    shrug:complete(500,
      part([0,.01,0],[0,0,.02]),part([0,.02,0],[0,0,-.12]),
      part([-.28,.36,.06],[0,0,-.17]),part([.28,.36,.06],[0,0,.17]),
      part(),part(),'Shrug'),
    think:complete(560,
      part([0,0,0],[0,.04,0]),part([0,-.025,0],[.1,.12,-.12]),
      part([-.03,.02,0],[0,0,.04]),part([-.40,.52,.20],[-.15,0,.10]),
      part(),part(),'Think'),
    curtsy:complete(600,
      part([.025,-.10,0],[0,0,.09]),part([.03,-.07,0],[0,0,-.04]),
      part([-.12,.06,.02],[0,0,.16]),part([.06,.18,.02],[0,0,-.12]),
      part([.11,0,.035],[0,0,.08]),part([-.09,-.025,-.07],[0,0,-.12]),'Curtsy')
  });

  const NODE_NAMES={body:'BodyRig',head:'HeadRig',leftHand:'Hand_L',rightHand:'Hand_R',leftFoot:'Foot_L',rightFoot:'Foot_R'};
  const PART_KEYS=Object.keys(NODE_NAMES);
  const clamp01=n=>Math.max(0,Math.min(1,n));
  const ease=n=>{n=clamp01(n);return n*n*(3-2*n)};
  const cloneOffsets=source=>{const out={};PART_KEYS.forEach(k=>{const p=source[k]||ZERO;out[k]={position:p.position.slice(),rotation:p.rotation.slice()}});return out};
  const mixOffsets=(a,b,t)=>{const out={};PART_KEYS.forEach(k=>{out[k]={position:[0,1,2].map(i=>a[k].position[i]+(b[k].position[i]-a[k].position[i])*t),rotation:[0,1,2].map(i=>a[k].rotation[i]+(b[k].rotation[i]-a[k].rotation[i])*t)}});return out};

  class PoseController{
    constructor(root,options){
      options=options||{};
      this.root=root;
      this.parts={};
      this.base={};
      PART_KEYS.forEach(key=>{
        const node=root.getObjectByName(NODE_NAMES[key]);
        if(!node)throw new Error('Pose rig is missing '+NODE_NAMES[key]);
        this.parts[key]=node;
        this.base[key]={position:[node.position.x,node.position.y,node.position.z],rotation:[node.rotation.x,node.rotation.y,node.rotation.z]};
      });
      this.phase=Number.isFinite(options.phase)?options.phase:Math.random()*Math.PI*2;
      this.alive=options.alive!==false;
      this.pose='neutral';
      this.from=cloneOffsets(POSES.neutral.parts);
      this.to=cloneOffsets(POSES.neutral.parts);
      this.current=cloneOffsets(POSES.neutral.parts);
      this.started=performance.now();
      this.duration=POSES.neutral.duration;
    }
    setAlive(on){this.alive=!!on}
    setPose(name,now){
      if(!POSES[name])name='neutral';
      now=Number.isFinite(now)?now:performance.now();
      this._sample(now);
      this.from=cloneOffsets(this.current);
      this.to=cloneOffsets(POSES[name].parts);
      this.pose=name;
      this.started=now;
      this.duration=POSES[name].duration;
    }
    _sample(now){
      const t=this.duration?ease((now-this.started)/this.duration):1;
      this.current=mixOffsets(this.from,this.to,t);
    }
    applyBase(){
      PART_KEYS.forEach(key=>{
        const n=this.parts[key],b=this.base[key];
        n.position.set(b.position[0],b.position[1],b.position[2]);
        n.rotation.set(b.rotation[0],b.rotation[1],b.rotation[2]);
      });
    }
    update(now){
      this._sample(now);
      const seconds=now*.001,phase=this.phase;
      const motion={};PART_KEYS.forEach(key=>motion[key]={position:[0,0,0],rotation:[0,0,0]});
      if(this.alive){
        // Cadence and vertical amplitudes mirror the game's BJ loop; the extra
        // body sway is intentionally smaller because this studio has no speech state.
        motion.body.position[0]=Math.sin(now*.00115+phase)*.009;
        motion.body.position[1]=Math.sin(now*.00155+phase)*.035;
        motion.body.rotation[2]=Math.sin(now*.00115+phase)*.014;
        motion.body.rotation[1]=Math.sin(now*.00095+phase)*.011;
        motion.head.position[1]=Math.sin(now*.0022+phase)*.025;
        motion.head.rotation[2]=Math.sin(now*.00115+phase+.4)*.012;
        motion.leftHand.position[1]=Math.sin(now*.0025+phase)*.025;
        motion.rightHand.position[1]=Math.sin(now*.0025+phase+1)*.025;
        motion.leftFoot.position[1]=Math.max(0,Math.sin(now*.0022+phase))*0.018;
        motion.rightFoot.position[1]=Math.max(0,Math.sin(now*.0022+phase+Math.PI))*0.018;
        if(this.pose==='wave')motion.rightHand.rotation[2]=Math.sin(seconds*6.6+phase)*.12;
        if(this.pose==='cheer'){
          const hop=Math.max(0,Math.sin(seconds*4.2+phase))*.034;
          PART_KEYS.forEach(key=>motion[key].position[1]+=hop);
          motion.leftHand.rotation[2]+=Math.sin(seconds*5.2+phase)*.035;
          motion.rightHand.rotation[2]-=Math.sin(seconds*5.2+phase)*.035;
        }
      }
      PART_KEYS.forEach(key=>{
        const node=this.parts[key],base=this.base[key],pose=this.current[key],add=motion[key];
        node.position.set(base.position[0]+pose.position[0]+add.position[0],base.position[1]+pose.position[1]+add.position[1],base.position[2]+pose.position[2]+add.position[2]);
        node.rotation.set(base.rotation[0]+pose.rotation[0]+add.rotation[0],base.rotation[1]+pose.rotation[1]+add.rotation[1],base.rotation[2]+pose.rotation[2]+add.rotation[2]);
      });
    }
  }

  global.SnugPoseLibrary=Object.freeze({POSES:POSES,PoseController:PoseController,nodeNames:Object.freeze(NODE_NAMES)});
})(window);
