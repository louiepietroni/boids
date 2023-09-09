class BoidOld
{
    constructor()
    {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        this.perceptionRadius = perceptionRadiusSlider.value();
        this.perceptionAngle = perceptionAngleSlider.value();
    }

    edges()
    {
        this.position.x = (this.position.x + width) % width;
        this.position.y = (this.position.y + height) % height;
    }

    isLocal(other)
    {
        if (this == other)
        {
            return false;
        }
        if (this.cachedPosition.dist(other.cachedPosition) > this.perceptionRadius)
        {
            return false;
        }
        let vectorToOther = p5.Vector.sub(other.cachedPosition, this.cachedPosition);
        let angleToOther = vectorToOther.angleBetween(this.cachedVelocity);

        if (abs(angleToOther) > this.perceptionAngle)
        {
            return false;
        }
        return true
    }

    isLocal2(other)
    {
        if (this == other)
        {
            return false;
        }
        if (this.cachedPosition.dist(other.cachedPosition) > this.perceptionRadius)
        {
            return false;
        }
        let heading = this.cachedVelocity.heading();
        let vectorToOther = p5.Vector.sub(other.cachedPosition, this.cachedPosition);
        let angleToOther = vectorToOther.angleBetween(this.cachedVelocity);

        stroke(200, 0, 0);
        strokeWeight(1);
        let ang = p5.Vector.fromAngle(heading, 100);
        line(this.cachedPosition.x, this.cachedPosition.y, this.cachedPosition.x+ang.x, this.cachedPosition.y+ang.y);
        stroke(0, 200, 0);
        line(this.cachedPosition.x, this.cachedPosition.y, this.cachedPosition.x+vectorToOther.x, this.cachedPosition.y+vectorToOther.y);

        if (abs(angleToOther) > this.perceptionAngle)
        {
            return false;
        }
        return true
    }

    align(boids)
    {
        let steering = createVector()
        let total = 0;
        for (let other of boids)
        {
            if (this.isLocal(other))
            {
                steering.add(other.cachedVelocity);
                total++;
            }
        }
        if (total > 0)
        {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.cachedVelocity);
            steering.limit(this.maxForce);

        }
        return steering;
    }

    cohesion(boids)
    {
        let steering = createVector()
        let total = 0;
        for (let other of boids)
        {
            if (this.isLocal(other))
            {
                steering.add(other.cachedPosition);
                total++;
            }
        }
        if (total > 0)
        {
            steering.div(total);
            steering.sub(this.cachedPosition);
            steering.setMag(this.maxSpeed); 
            steering.sub(this.cachedVelocity);
            steering.limit(this.maxForce);

        }
        return steering;
    }

    separation(boids)
    {
        let steering = createVector()
        let total = 0;
        for (let other of boids)
        {
            let distance = this.cachedPosition.dist(other.cachedPosition)
            if (this.isLocal(other))
            {

                let diff = p5.Vector.sub(this.cachedPosition, other.cachedPosition);
                diff.div(distance);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0)
        {
            steering.div(total);
            steering.setMag(this.maxSpeed); 
            steering.sub(this.cachedVelocity);
            steering.limit(this.maxForce);

        }
        return steering;
    }

    flock(boids)
    {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());


        this.acceleration.add(cohesion);
        this.acceleration.add(alignment);
        this.acceleration.add(separation);
    }

    update()
    {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.set(0);

    }

    cache()
    {
        this.perceptionRadius = perceptionRadiusSlider.value();
        this.perceptionAngle = perceptionAngleSlider.value();
        this.cachedPosition = this.position;
        this.cachedVelocity = this.velocity;
    }

    show()
    {
        strokeWeight(8);
        stroke(255);
        point(this.position);
    }

    outline()
    {
        fill(255, 100);
        strokeWeight(0);

        let heading = this.velocity.heading();
        arc(this.position.x,
            this.position.y,
            this.perceptionRadius*2,
            this.perceptionRadius*2,
            heading-this.perceptionAngle,
            heading+this.perceptionAngle);
    }

    outlineNeighbours(boids)
    {
        for (let other of boids)
        {
            if (this.isLocal(other))
            {
                strokeWeight(8);
                stroke(0, 250, 0, 175);
                point(other.position);
                
                strokeWeight(1);
                line(this.cachedPosition.x, this.cachedPosition.y, other.cachedPosition.x, other.cachedPosition.y);
            }
        }
    }

    
}