function increaseSpeed(currentSpeed, hitCorner = false, logo) {
    if (hitCorner) {
        logo.updateSpeed(10);
    } else {
        logo.updateSpeed(5);
    }

    setInterval(() => {
        logo.updateSpeed(currentSpeed)
    },5000);
}

function decreaseSpeed(currentSpeed, hitCorner= false, logo) {
    logo.updateSpeed(1);
    setInterval(() => {
        logo.updateSpeed(currentSpeed)
    },5000);
}

export { increaseSpeed, decreaseSpeed };