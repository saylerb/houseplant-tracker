<script>
  import { onMount } from "svelte";
  import { getPlants } from "../api";

  let plants = [];

  onMount(async () => {
    plants = getPlants();
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
  <h1>Plant Tracker!</h1>

  {#await plants}
    loading...
  {:then data}
    <ul>
      {#each data as plant}
        <li>{plant.name}</li>
      {/each}
    </ul>
  {:catch error}
    There was a problem fetching the list of plants
  {/await}
</main>
