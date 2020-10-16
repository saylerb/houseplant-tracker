export async function getPlants() {
  return fetch("/index.json").then(response => response.json());
}

export async function createPlant(data: any) {
  return fetch(`/index.json`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
}

export async function updatePlant(data: { id: any; }) {
  const { id } = data;

  console.log("client side data: ", data);
  return fetch(`/plants/${id}.json`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
}

export async function deletePlant(id: any) {
  return fetch(`/plants/${id}.json`, {
    method: "DELETE"
  }).then(response => response.json());
}
