<script>
  import { onMount } from "svelte";
  import { getPlants, updatePlant } from "../api";
  import { Temporal } from "proposal-temporal/lib/index.mjs";

  let plants = [];

  async function allPlants() {
    return getPlants().then(json =>
      json
        .map(plant => ({
          ...plant,
          formattedDate: Temporal.Date.from(plant.lastWateredAt).toString(),
          compare: Temporal.DateTime.from(plant.lastWateredAt)
        }))
        .sort((a, b) => a.id - b.id)
    );
  }

  onMount(async () => {
    plants = allPlants();
  });

  async function handleSubmit(event) {
    const id = event.target.elements[0].value;
    const lastWateredAt = event.target.elements[1].value;

    const data = { id, lastWateredAt };

    await updatePlant(data);

    plants = allPlants();
  }
</script>

<style>
  main {
    max-width: 240px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Name - Last Watered At</h1>

  {#await plants}
    loading...
  {:then data}
    <ul>
      {#each data as plant (plant.id)}
        <li>
          {plant.name} - {plant.formattedDate}
          <form on:submit|preventDefault={handleSubmit}>
            <input type="hidden" value={plant.id} />
            <input type="datetime-local" />
            <input type="submit" />
          </form>

        </li>
      {/each}
    </ul>
  {:catch error}
    There was a problem fetching the list of plants
  {/await}
</main>
