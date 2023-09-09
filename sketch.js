const flock = [];

let alignSlider, cohesionSlider, separationSlider;
let perceptionRadiusSlider, perceptionAngleSlider;

function setup()
{
    createCanvas(2000, 1200);
    alignSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1, 0.1);
    
    perceptionRadiusSlider = createSlider(0, 500, 100, 10);
    perceptionAngleSlider = createSlider(0, PI, PI*0.4, 0.001);

    for (let i = 0; i < 150; i++)
    {
        flock.push(new Boid());
    }
}

function draw()
{

    background(51);

    for (let boid of flock)
    {
        boid.edges();
        boid.cache();
    }

    for (let boid of flock)
    {
        boid.update(flock); 
        boid.show();
    }

    // flock[0].outline();
    // flock[0].outlineNeighbours(flock);
}
 