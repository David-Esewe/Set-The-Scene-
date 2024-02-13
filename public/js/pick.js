
document.addEventListener('DOMContentLoaded', function() {
    // All the button stuff
    const megButton = document.querySelector('#megbutton');
    const megEntity = document.querySelector('#meg');
    const deleteButton = document.getElementById('deleteButton');
    const rotateButton = document.getElementById('rotateButton');
    const camera = document.querySelector('[camera]');
    const cylinders = document.querySelectorAll('a-entity[id^="cylinder"]');
    const entities = document.querySelectorAll('[pickable]');

   
    let selectedEntity = null;
    let isCarried = false;

    // Megs dissapearing function (SHUTS UP MEG)
    function toggleMegVisibility() {
        const isVisible = megEntity.getAttribute('visible');
        megEntity.setAttribute('visible', !isVisible);
    }

    // Delete object in hand
    function deleteSelectedEntity() {
        if (selectedEntity) {
            selectedEntity.parentNode.removeChild(selectedEntity);
            selectedEntity = null;
        }
    }

    // Rotates object by 45 degrees
    function rotateEntity(object, rotationStep = 45) {
        if (isCarried && object) {
            const currentRotation = object.getAttribute('rotation');
            object.setAttribute('rotation', {
                x: currentRotation.x,
                y: currentRotation.y + rotationStep,
                z: currentRotation.z
            });
        }
    }

   
    megButton.addEventListener('click', toggleMegVisibility);
    deleteButton.addEventListener('click', deleteSelectedEntity);
    rotateButton.addEventListener('click', () => rotateEntity(selectedEntity)); 

    // Handle cylinder interactions
    cylinders.forEach(cylinder => {
        cylinder.addEventListener('click', function() {
            const {x, z} = this.getAttribute('position');
            const yPosition = this.id === "cylinder" ? 3.9 : 1;
            camera.setAttribute('position', `${x} ${yPosition} ${z}`);
        });
    });
        // 'selectable' handles the selection
        AFRAME.registerComponent('selectable', {
            init: function() {
                this.el.addEventListener('click', () => {
                    if (selectedEntity) {
                        selectedEntity.classList.remove('selected');
                    }
                    selectedEntity = this.el;
                    selectedEntity.classList.add('selected');
                });
            }
        });
    
        // 'pickable' handles the carrying section
        AFRAME.registerComponent('pickable', {
                      schema: {
                        rotationStep: { default: 45 },
                        scale: { type: 'string', default: '1 1 1' } 
                      },
                      init: function() {
                        this.isCarried = false; // checks if the object is being carried
                        const object = this.el; // The object 
                        const cameraEl = document.querySelector('[camera]'); // The camera 
                
                        //scale the object
                        object.setAttribute('scale', this.data.scale);
                
                        object.addEventListener('click', () => {
                          if (!this.isCarried) {
                            // Picks up the object
                            this.isCarried = true;
                            const objectWorldPos = object.object3D.getWorldPosition(new THREE.Vector3());
                            const objectWorldRot = object.object3D.getWorldQuaternion(new THREE.Quaternion());
                            cameraEl.object3D.add(object.object3D);
                            object.object3D.position.copy(objectWorldPos);
                            object.object3D.quaternion.copy(objectWorldRot);
                            object.setAttribute('position', '0 -0.5 -1'); // let it appear in front of camera
                            // scale reduces object. models were apperaing too big in the camera view
                            object.setAttribute('scale', '0.5 0.5 0.5');
                
                            
                            rotateButton.addEventListener('click', () => {
                              if (this.isCarried) {
                                const currentRotation = object.getAttribute('rotation');
                                object.setAttribute('rotation', `0 ${currentRotation.y + this.data.rotationStep} 0`);
                              }
                            });
                            document.body.appendChild(rotateButton);
                          } else {
                  
                        
                          }
                        });
                
                       
                        document.querySelector('#ground').addEventListener('click', (evt) => {
                          if (this.isCarried && evt.target === document.querySelector('#ground')) {
                            const clickPoint = evt.detail.intersection.point; // where the user clicks on
                            this.dropObject(object, clickPoint);
                            this.isCarried = false;
                          }
                        });
                      },
                      dropObject: function(object, dropPosition) {
                        
                        object.object3D.parent = object.sceneEl.object3D;
                        object.object3D.position.set(dropPosition.x, dropPosition.y, dropPosition.z);
                        object.setAttribute('position', {x: dropPosition.x, y: dropPosition.y, z: dropPosition.z});
                      }
                    });
                
                    
                  });
    
