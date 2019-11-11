export function createAnimation (transitionFunction, time, duration, v0, v1) {
  return {
    t: time, d: duration, v0: v0, v1: v1, v: v0, t1: time + duration,
    transition: transitionFunction || linear,
    eval (t) {
      if (this.v >= this.v1) return false;
      this.v = this.transition(this.t, this.v0, this.t + this.d, this.v1, t);
      return true;
    },
    run (t, v1) {
      this.t = t;
      this.t1 = t + this.d;
      this.v0 = this.v;
      this.v1 = v1;
    },
    reset (v) {
      this.v0 = this.v1 = this.v = v;
    }
  };
}

function linear (t1, x1, t2, x2, t) {
  if (t1 === t2) {
    return x2;
  }
  if (t < t1) {
    t = t1;
  } else if (t > t2) {
    t = t2;
  }
  t = (t - t1) / (t2 - t1);
  return x1 + t * (x2 - x1);
}
