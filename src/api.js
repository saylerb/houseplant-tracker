export async function getPlants() {
  return fetch("http://localhost:3000/").then(response => response.json());
}
