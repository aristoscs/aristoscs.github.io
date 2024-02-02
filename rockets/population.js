function Population() {
  this.rockets = Array.from({ length: 25 }, () => new Rocket());
  this.matingpool = [];

  this.evaluate = function() {
      let maxfit = Math.max(...this.rockets.map(rocket => (rocket.calcFitness(), rocket.fitness)));

      this.rockets.forEach(rocket => rocket.fitness /= maxfit);

      this.matingpool = this.rockets.flatMap(rocket => Array.from({ length: rocket.fitness * 100 }, () => rocket));
  }

  this.selection = function() {
      this.rockets = this.rockets.map(() => {
          let parentA = random(this.matingpool).dna;
          let parentB = random(this.matingpool).dna;
          let child = parentA.crossover(parentB);
          child.mutation();
          return new Rocket(child);
      });
  }

  this.run = function() {
      this.rockets.forEach(rocket => (rocket.update(), rocket.show()));
  }
}
