export async function getPlants() {
  return fetch("/index.json").then(response => response.json());
}
