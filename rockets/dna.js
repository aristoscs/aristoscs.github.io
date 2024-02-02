function DNA(genes) {
  if (genes) {
      this.genes = genes;
  } else {
      this.genes = Array.from({ length: lifespan }, () => p5.Vector.random2D().setMag(maxforce));
  }

  this.crossover = function(partner) {
      var newgenes = [];
      var mid = floor(random(this.genes.length));
      for (var i = 0; i < this.genes.length; i++) {
          newgenes[i] = (i > mid) ? this.genes[i] : partner.genes[i];
      }
      return new DNA(newgenes);
  }

  this.mutation = function() {
      for (var i = 0; i < this.genes.length; i++) {
          if (random(1) < 0.01) {
              this.genes[i] = p5.Vector.random2D().setMag(maxforce);
          }
      }
  }
}
