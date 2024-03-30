let imageCounter = 0;

function createCustomAlert(message) {
  const alertDiv = document.createElement("div");
  alertDiv.setAttribute("role", "alert");
  alertDiv.classList.add(
    "alert",
    "alert-error",
    "text-xl",
    "font-medium"
  );

  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.classList.add("stroke-current", "shrink-0", "h-6", "w-6");
  svgElement.setAttribute("fill", "none");
  svgElement.setAttribute("viewBox", "0 0 24 24");

  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("stroke-linecap", "round");
  pathElement.setAttribute("stroke-linejoin", "round");
  pathElement.setAttribute("stroke-width", "2");
  pathElement.setAttribute(
    "d",
    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  );

  svgElement.appendChild(pathElement);

  const spanElement = document.createElement("span");
  spanElement.textContent = message;

  alertDiv.appendChild(svgElement);
  alertDiv.appendChild(spanElement);

  // Insert the alert into the desired container, e.g., div with id "alertimg"
  const alertContainer = document.getElementById("alertimg");
  alertContainer.innerHTML = "";
  alertContainer.appendChild(alertDiv);
}

function createCountAlert(message) {
  const alertDiv = document.createElement("div");
  alertDiv.setAttribute("role", "alert");
  alertDiv.classList.add("alert", "alert-info", "text-xl", "font-medium");

  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.classList.add("stroke-current", "shrink-0", "h-6", "w-6");
  svgElement.setAttribute("fill", "none");
  svgElement.setAttribute("viewBox", "0 0 24 24");

  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("stroke-linecap", "round");
  pathElement.setAttribute("stroke-linejoin", "round");
  pathElement.setAttribute("stroke-width", "2");
  pathElement.setAttribute(
    "d",
    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  );

  svgElement.appendChild(pathElement);

  const spanElement = document.createElement("span");
  spanElement.textContent = message;

  alertDiv.appendChild(svgElement);
  alertDiv.appendChild(spanElement);

  // Insert the alert into the desired container, e.g., div with id "alertimg"
  const alertContainer = document.getElementById("alertcntimg");
  alertContainer.innerHTML = "";
  alertContainer.appendChild(alertDiv);
}

function clearCustomAlert() {
  const alertContainerImg = document.getElementById("alertimg");
  const alertContainerCnt = document.getElementById("alertcntimg");
  alertContainerImg.innerHTML = "";
  alertContainerCnt.innerHTML = "";
}

async function getImages() {
  const selectedDate = document.getElementById("datepicker").value;
  console.log("Selected date:", selectedDate);

  try {
    const response = await fetch(`/getdate/${selectedDate}`);
    const base64Values = await response.json();

    const imageList = document.getElementById("imageList");
    const imageCounterElement = document.getElementById("imageCounter");

    imageList.innerHTML = ""; // Clear existing images
    imageCounter = 0; // Reset counter

    clearCustomAlert(); // Clear CustomAlert when there are images

    if (base64Values.length === 0) {
      createCustomAlert("No images for the selected date.");
      imageCounterElement.textContent = ""; // Hide counter when no images
      return;
    }

    for (const value of base64Values) {
      var imgElement = document.createElement("img");
      imgElement.src = "data:image/jpeg;base64," + value;

      var canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 640;
      canvas.classList.add("rounded-box");

      var ctx = canvas.getContext("2d");
      await new Promise((resolve) => {
        imgElement.onload = () => {
          ctx.drawImage(imgElement, 0, 0, 640, 640);
          resolve();
        };
      });

      imageList.appendChild(canvas);
      imageCounter++;
    }

    if (imageCounter > 0) {
      createCountAlert(`จำนวนรูปภาพ ณ วันที่เลือก: ${imageCounter}`);
      //imageCounterElement.textContent = `Images: ${imageCounter}`;
    } else {
      imageCounterElement.textContent = ""; // Hide counter when no images
    }
  } catch (error) {
    console.error("Error fetching OID values:", error);
  }
  setTimeout(() => {
    clearCustomAlert();
  }, 5000);
}
