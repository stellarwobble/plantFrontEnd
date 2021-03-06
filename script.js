const container = document.getElementById("container");
const header = document.getElementById("header");
let plantArray = [];
let pollinatorArray = [];
const capsule = document.getElementById("capsule");
const singleDisplay = document.getElementById("single-display");
fetchPlants();
fetchPollinator();
renderSinglePollinators();
renderSinglePlants();
plantUpdate();
pollinatorUpdate();

header.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "plant":
      container.innerHTML = "";
      singleDisplay.innerHTML = "<h1 class='h1'>Plants and Pollinators</h1>";
      capsule.style.backgroundImage = "";
      styleBlock();
      renderAllPlants();

      break;
    case "pollinator":
      container.innerHTML = "";
      singleDisplay.innerHTML = "<h1 class='h1'>Plants and Pollinators</h1>";
      capsule.style.backgroundImage = "";
      styleBlock();
      renderAllPollinators();

      break;
    case "form":
      container.innerHTML = "";
      singleDisplay.innerHTML = "<h1 class='h1'>Plants and Pollinators</h1>";
      capsule.style.backgroundImage = "";
      e.preventDefault();
      renderForm();
  }
});

function styleBlock() {
  if (container.style.display === "block") {
    container.style.display = "none";
  } else {
    container.style.display = "block";
  }
}
function renderAllPlants() {
  plantArray.forEach((plant) => {
    container.innerHTML += `<main class="plant-card"><p>${plant.common_name}<br>(${plant.latin_name})</br><br><img src="${plant.image}"><br><button class="renderplantbutton" id="${plant.id}">View More</button ></p><br>
           
            
            </main>`;
  });
}

function renderSinglePlants() {
  container.addEventListener("click", (e) => {
    const targetedPlant = plantArray[e.target.id - 1];
    const plantPollinators = targetedPlant.pollinators;
    const pollinatorNames = plantPollinators.map(
      (pollinator) => pollinator.name
    );

    if (e.target.className === "renderplantbutton") {
      capsule.style.backgroundImage = `url(${targetedPlant.image})`;

      singleDisplay.innerHTML = `
                     
                    <div class="plantDiv">
                    <h1>${targetedPlant.common_name}</h1>
                    <h3> Latin Name: ${targetedPlant.latin_name}</h3>
                    <p> Hardiness Zone: ${targetedPlant.zone}</p>
                    <p class='description'  >About This Plant:${
                      targetedPlant.description
                    }</p>

                    <h3 id ='h3'>Pollinators That Love This Plant: ${pollinatorNames.join(
                      ",  "
                    )}</h3>
                   <button id ='${
                     targetedPlant.id
                   }' class="updatePlant">Update Plant Informationt</button>
                   </div>
                    `;
    }
  });
}

function fetchPollinator() {
  fetch("http://localhost:3000/pollinators")
    .then((res) => res.json())
    .then((pollinators) => {
      pollinatorArray = pollinators;

    });
}

function fetchPlants() {
  fetch("http://localhost:3000/plants")
    .then((res) => res.json())
    .then((plants) => {
      plantArray = plants;
     });
}

function renderAllPollinators() {
  pollinatorArray.forEach((pollinator) => {
    container.innerHTML += `<main class="pollinator-card"><p>${pollinator.name}<br>(${pollinator.species})</br><br><img src="${pollinator.image}"><br><button class="renderpollinatorbutton" id="${pollinator.id}">View More</button></p><br>
              
            </main>`;
  });
}

function renderSinglePollinators() {
  container.addEventListener("click", (e) => {
    const targetedPollinator = pollinatorArray[e.target.id - 1];
    if (e.target.className === "renderpollinatorbutton") {
      capsule.style.backgroundImage = `url(${targetedPollinator.image})`;
      singleDisplay.innerHTML = `
                    
                    <div class="pollinatorDiv">
                    <h1>${targetedPollinator.name}</h1>
                    <h3> Species: ${targetedPollinator.species}</h3>
                    <p class="pollinatorDescription">About This Pollinator: ${targetedPollinator.description}</p><br><br>
                    <button id="${targetedPollinator.id}" class="updatePollinator">Update Pollinator Information</button>
                    </div>
                    `;
    }
  });
}

function renderForm() {
  singleDisplay.innerHTML = `<form  method="post" id ="newPlantForm">
  <h1> Add a New Plant to the Collection</h1>
            
            <label for="Pname"> Plant name:</label><br>

            <input type="text" id="fname" name="fname" value="" ><br>

            <label for="Lname"> Latin name:</label><br>
            <input name="lname" type="text" id="lname" value="" ><br>
            
            <label for="zone"> Hardiness Zones:</label><br>
            <input name="zone" type="text" id="zone" value="" ><br>

            <label for="description"> Description:</label><br>
            <input name="description" type="text" id="form-description" value=""> <br>

            <label for="imageUrl">Image Url:</label><br>
            <input name="imgurl" type="text" id="imageUrl" value=""><br><br>

            

            ${pollinatorArray
              .map((polli) => {
                return `<input type="checkbox" id="${polli.id}" name="pollinator" value="${polli.name}">${polli.name}</input><br> `;
              })
              .join(" ")}
              
            <br><input class='submit' type='submit' value='Submit'>

         </form>`;
  submitNewPlantEvent();
}

function submitNewPlantEvent() {
  singleDisplay.addEventListener("submit", (e) => {
    const form = document.getElementById("newPlantForm");
    console.log(e.target)
    e.preventDefault();
    singleDisplay.innerHTML = `<h1 class='h1'>Thank You for Your Submission</h1><main class="plant-card"><p>${form.fname.value}<br>(${form.lname.value})</br><br><img src="${form.imgurl.value}"></main>`
    
    

    const checkboxes = Array.from(form.pollinator);

    const checkedPollinators = checkboxes.filter(
      (checkbox) => checkbox.checked === true
    );

    const sendPollinatorIds = checkedPollinators.map((pollinator) => {
      return pollinator.id;
    });

    fetch("http://localhost:3000/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        plant: {
          common_name: form.fname.value,
          latin_name: form.lname.value,
          description: form.description.value,
          image: form.imgurl.value,
          zone: form.zone.value,
          pollinator_ids: sendPollinatorIds,
        },
      }),
    });
  });
}

function plantUpdate() {
  singleDisplay.addEventListener("click", (e) => {
    const plantId = e.target.id;

    if (e.target.className === "updatePlant") {
      const plantDescriptionValue = plantArray.find((plant) => {
        return parseInt(e.target.id, 10) === plant.id;
      }).description;
      const plantZoneValue = plantArray.find((plant) => {
        return parseInt(e.target.id, 10) === plant.id;
      }).zone;

      singleDisplay.innerHTML = `
        <form id="editPlant">
        <label name='plantDescription'> Description:</label><br>
        <input name='plantDescription' value="${plantDescriptionValue}"><br><br>
       
       <label name="plantZone"> Hardiness Zones:</label><br>
       <input name="plantZone" value="${plantZoneValue}">
        <input class='submit'type='submit' value='Submit'>
 
        </form>
        `;
      singleDisplay.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = document.getElementById("editPlant");
        singleDisplay.innerHTML = 
                    `<h1 class='h1'>Thank You for Your Submission</h1>
                    <div class="plantDiv">
                    <p> Hardiness Zone: ${form.plantZone.value}</p>
                    <p class='description'  >About This Plant:${
                      form.plantDescription.value
                    }</p> `;

       

        fetch(`http://localhost:3000/plants/${plantId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            plant: {
              description: form.plantDescription.value,
              zone: form.plantZone.value,
            },
          }),
        });
      });
    }
  });
}

function pollinatorUpdate() {
  singleDisplay.addEventListener("click", (e) => {
    const pollinatorId = e.target.id;

    if (e.target.className === "updatePollinator") {
      singleDisplay.innerHTML = `
        <form id="editPollinator">
        <label name='pollinatortDescription'> Description:</label><br>
        <input  name='pollinatorDescription' value="${
          pollinatorArray.find((pol) => {
            return parseInt(e.target.id, 10) === pol.id;
          }).description
        }">
       
      
        <input class='submit' type='submit' value='Submit'>
 
        </form>
        `;
      singleDisplay.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(pollinatorId);
        const form = document.getElementById("editPollinator");
        singleDisplay.innerHTML = `<h1 class='h1'>Thank You for Your Submission</h1> <div class="pollinatorDiv">
        
        <p class="pollinatorDescription">About This Pollinator: ${form.pollinatorDescription.value}</p><br>
       
        </div>`;
        

        fetch(`http://localhost:3000/pollinators/${pollinatorId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            pollinator: {
              description: form.pollinatorDescription.value
            },
          }),
        });
      });
    }
  });
}
