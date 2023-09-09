class Boid
{
    constructor()
    {
        this.perceptionRadius = 175;
        this.avoidanceRadius = 75;
        this.perceptionAngle = PI;

        this.minSpeed = 200;
        this.maxSpeed = 500;
        this.maxSteerForce = 10;

        this.alignmentForceWeight = 0.9;
        this.cohesionForceWeight = 1;
        this.separationForceWeight = 1.1;
        this.targetForceWeight = 1;

        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(this.minSpeed, this.maxSpeed));
        this.acceleration = createVector();
    }

    edges()
    {
        this.position.x = (this.position.x + width) % width;
        this.position.y = (this.position.y + height) % height;
    }

    cache()
    {
        // this.perceptionRadius = perceptionRadiusSlider.value();
        // this.perceptionAngle = perceptionAngleSlider.value();
        this.cachedPosition = this.position;
        this.cachedVelocity = this.velocity;
    }

    canPerceive(other)
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

    shouldAvoid(other)
    {
        if (this.cachedPosition.dist(other.cachedPosition) > this.avoidanceRadius)
        {
            return false;
        }
        return true
    }

    steerTowards(location)
    {
        let velocityDirection = p5.Vector.sub(p5.Vector.normalize(location).mult(this.maxSpeed), this.cachedVelocity);
        velocityDirection.limit(this.maxSteerForce);
        return velocityDirection;
    }

    steer(flockMates)
    {
        let flockHeading = createVector();
        let flockCentre = createVector();
        let flockSeparationHeading = createVector();
        for (let other of flockMates)
        {
            flockHeading.add(other.cachedVelocity);
            flockCentre.add(other.cachedPosition);
            if (this.shouldAvoid(other))
            {
                let vectorToOther = p5.Vector.sub(other.cachedPosition, this.cachedPosition);
                let distanceToOther = vectorToOther.mag()
                flockSeparationHeading.sub(vectorToOther.div(distanceToOther ** 2))
            }
        }

        let vectorToFlockCentre = p5.Vector.sub(flockCentre.div(flockMates.length), this.cachedPosition);

        let alignmentForce = this.steerTowards(flockHeading);
        let cohesionForce = this.steerTowards(vectorToFlockCentre);
        let separationForce = this.steerTowards(flockSeparationHeading);

        alignmentForce.mult(this.alignmentForceWeight);
        cohesionForce.mult(this.cohesionForceWeight);
        separationForce.mult(this.separationForceWeight);

        this.acceleration.add(alignmentForce);
        this.acceleration.add(cohesionForce);
        this.acceleration.add(separationForce);
    }

    update(flock)
    {
        let flockMates = flock.filter(other => this.canPerceive(other));
        if (flockMates.length)
        {
            this.steer(flockMates);
        }

        if (mouseIsPressed)
        {
            let target = createVector(mouseX, mouseY);
            let vectorToTarget = p5.Vector.sub(target, this.cachedPosition);
            let targetForce = this.steerTowards(vectorToTarget).mult(this.targetForceWeight);
            this.acceleration.add(targetForce);
        }
        
        

        this.velocity.add(this.acceleration.mult(deltaTime / 1000));
        this.velocity.setMag(max(this.velocity.mag(), this.minSpeed)).limit(this.maxSpeed);
        this.position.add(this.velocity.mult(deltaTime / 1000));
        this.acceleration.set(0);

    }

    show()
    {
        strokeWeight(1);
        stroke(255);
        point(this.position);
        let size = 20
        let front = p5.Vector.add(this.position, p5.Vector.normalize(this.velocity).mult(0.3*size));
        // let back = p5.Vector.sub(this.position, p5.Vector.normalize(this.velocity).mult(0.1*size));
        let left = p5.Vector.add(this.position, p5.Vector.normalize(this.velocity).rotate(-2.4).mult(0.35*size));
        let right = p5.Vector.add(this.position, p5.Vector.normalize(this.velocity).rotate(2.4).mult(0.35*size));
        triangle(front.x, front.y, left.x, left.y, right.x, right.y);
        // quad(front.x, front.y, left.x, left.y, back.x, back.y, right.x, right.y);
    }

    outline()
    {
        fill(255, 50);
        strokeWeight(0);

        let heading = this.velocity.heading();
        arc(this.position.x,
            this.position.y,
            this.perceptionRadius*2,
            this.perceptionRadius*2,
            heading-this.perceptionAngle,
            heading+this.perceptionAngle);
        
        fill(255, 100);
        arc(this.position.x,
            this.position.y,
            this.avoidanceRadius*2,
            this.avoidanceRadius*2,
            heading-this.perceptionAngle,
            heading+this.perceptionAngle);
    }

    outlineNeighbours(boids)
    {
        for (let other of boids)
        {
            if (this.canPerceive(other))
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