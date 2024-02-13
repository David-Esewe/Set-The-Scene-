
const positionTolerance = 0.5; // If its within the tolerance range of 0.5 then give them 100
function calculatePercentage(currentPosition, templatePosition, tolerance = positionTolerance) {
    const distance = currentPosition.distanceTo(templatePosition);
    const maxDistance = Math.sqrt(3 * Math.pow(0.5, 2)); // Max distance within the scene
    let similarity;
    if (distance <= tolerance) {
        similarity = 1; 
    } else {
        const adjustedDistance = distance - tolerance; // Adjust distance by subtracting tolerance
        const adjustedMaxDistance = maxDistance - tolerance; // Adjust max distance as well
        similarity = 1 - (adjustedDistance / adjustedMaxDistance);
    }
    similarity = Math.max(similarity, 0); // Ensure similarity is not less than 0
    return Math.round(similarity * 100);
}

document.addEventListener('DOMContentLoaded', function () {
    // Select the percetgae button
    const percentageButton = document.querySelector('#percentage-button');

    percentageButton.addEventListener('click', function () {
        //console.log('Percentage button clicked');
        const pickableObjects = document.querySelectorAll('[pickable]');
        let totalPercentage = 0;

        pickableObjects.forEach(object => {
            const objectId = object.getAttribute('id');
            const object3D = object.object3D;
            const currentPosition = new THREE.Vector3();
            object3D.getWorldPosition(currentPosition);

             
            const templatePosition = defaultPositions[objectId];
            if (!templatePosition) {
                console.error('Default position for object', objectId, 'not found.');
                return;
            }

            const positionPercentage = calculatePercentage(currentPosition, templatePosition);
            totalPercentage += positionPercentage; 
        });

        // Calculate average percentage
        let averagePercentage = totalPercentage / pickableObjects.length;

        // Update a-text to show their score
        //console.log(`Score: ${averagePercentage.toFixed(2)}%`);
        const scoreText = document.querySelector('#scoreText');
        if (scoreText) {
            scoreText.setAttribute('value', `Score: ${averagePercentage.toFixed(2)}%`);
        } else {
            //console.error('ITS NOT WORKING');
        }
    });
});


// These are the right positions for the objects. 
const defaultPositions = {
    'dining': new THREE.Vector3(1.323, 0.043, 5.648),
    'lights': new THREE.Vector3(3.2320693840831685, 0.043000000930844814, 2.386873015360315),
    'couch': new THREE.Vector3(-0.8351380791568347, 0.043000000930844814, 2.8776898513198645),
    'cupboard': new THREE.Vector3(-0.3039961101753915, 0.04300000093084464, 7.403715206894141),
    'laptop': new THREE.Vector3(3.15478, 0, 7.17487),
    'livingchairs': new THREE.Vector3(-0.8018959606510504, 0.04300000093084464, 5.185588785916192),
    'livingtable': new THREE.Vector3(-0.8258836944560969, 0.04300000093084464, 4.375086288281739),
    'plant': new THREE.Vector3(-1.6957297097592412, 0.043000000930844814, 7.44374627740903),
    'stoolchair': new THREE.Vector3(2.784237189853144, 0.04300000093084464, 4.55588741963634)
};


