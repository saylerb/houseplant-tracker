<script>
  import { onMount } from "svelte";
  import { getPlants } from "../api";
  import { Temporal } from "proposal-temporal/lib/index.mjs";

  let plants = [];

  onMount(async () => {
    plants = getPlants().then(json =>
      json.map(plant => ({
        ...plant,
        formattedDate: Temporal.Date.from(plant.lastWateredAt).toString()
      }))
    );
  });
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
      {#each data as plant}
        <li>{plant.name} - {plant.formattedDate}</li>
      {/each}
    </ul>
  {:catch error}
    There was a problem fetching the list of plants
  {/await}
</main>
