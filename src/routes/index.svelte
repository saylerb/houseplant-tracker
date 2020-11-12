<script lang="ts" context="module">
  import type { Preload } from "@sapper/common";

  export const preload: Preload.Preload = async function (this) {
    return this.fetch("/index.json")
      .then((response) => {
        if (response.status === 200) return response.json();
        if (response.status === 403) return this.redirect(302, "login");
      })
      .then((json) => ({ initPlants: json }));
  };
</script>

<script lang="ts">
  import { getPlants, updatePlant, deletePlant, createPlant } from "../api";
  import { Temporal } from "proposal-temporal";
  import type { Plant } from "@prisma/client";

  export let initPlants;

  // TODO: Remove mixed type here and manage updating the list of plants better
  //     - synchronously setting plants allows us to SSR render the list of plants
  //     - async setting allows us to refresh the list with a loading indicator after
  //       adding, removing or marking a plant as watered.
  let plants:
    | Promise<PlantWithElapsedTime[]>
    | PlantWithElapsedTime[] = calculateElapsedTime(initPlants);

  let value = "";

  interface HasElapsedTime {
    elapsed: string;
  }

  // TODO: the typing of Plant is not quite correct,
  // since the dates are strings in the frontend
  type PlantWithElapsedTime = Plant & HasElapsedTime;

  async function allPlants() {
    return getPlants().then(calculateElapsedTime);
  }

  function calculateElapsedTime(plants): PlantWithElapsedTime[] {
    return plants
      .map((plant: { lastWateredAt: string }) => {
        const date = Temporal.DateTime.from(plant.lastWateredAt);

        const { seconds } = Temporal.now
          .instant()
          .difference(Temporal.Instant.from(plant.lastWateredAt));

        const SECONDS_IN_A_DAY = 86400;
        const days = Math.floor(seconds / SECONDS_IN_A_DAY);
        const elapsed = `${days} days ago`;
        const formattedDate = Temporal.Date.from(date).toString();

        return {
          ...plant,
          formattedDate,
          elapsed,
          compare: date,
        };
      })

      .sort(
        (
          a: { compare: Temporal.DateTime },
          b: { compare: Temporal.DateTime }
        ) => Temporal.DateTime.compare(a.compare, b.compare)
      );
  }

  async function handleDelete(id: number) {
    if (window.confirm("Delete plant?")) {
      await deletePlant(id);
      plants = allPlants();
    }
  }

  async function handleNewPlantSubmit() {
    await createPlant({ name: value });

    plants = allPlants();
  }

  async function handleWatered(id: number) {
    const lastWateredAt = Temporal.now.dateTime().toString();

    const data = { id, lastWateredAt };

    await updatePlant(data);

    plants = allPlants();
  }
</script>

<style>
  main {
    max-width: 300px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  input {
    margin-bottom: 10px;
  }

  .controls {
    display: flex;
    justify-content: space-between;
  }

  ul {
    padding: 0;
    list-style-type: none;
  }

  li {
    margin-bottom: 1em;
    border-radius: 0.25rem;
    border: solid 1px lightgray;
    padding: 1em;
  }

  .elapsed {
    color: darkgray;
    display: inline;
    font-style: italic;
  }
  .plant-details {
    margin-bottom: 0.5em;
  }

  .name {
    display: inline;
    margin-right: 0.25em;
  }

  button,
  input {
    border-radius: 0.1em;
    border: 1px solid #dfdfdf;
  }

  input[type="submit"] {
    padding: 1px 6px;
    font-weight: 400;
  }

  input[type="text"] {
    height: 20px;
  }

  form > input {
    margin-bottom: 0;
  }
</style>

<main>
  <form on:submit|preventDefault={handleNewPlantSubmit}>
    <input type="text" bind:value name="newPlant" />
    <input type="submit" value="Add Plant" />
  </form>

  {#await plants}
    loading...
  {:then data}
    <ul>
      {#each data as plant (plant.id)}
        <li>
          <div class="plant-details">
            <h3 class="name">{plant.name}</h3>
            <span class="elapsed">watered {plant.elapsed}</span>
          </div>

          <div class="controls">
            <button on:click={() => handleWatered(plant.id)}>Watered!</button>
            <a href={`/plants/${plant.id}`}>Edit</a>
            <button on:click={() => handleDelete(plant.id)}>X</button>
          </div>
        </li>
      {/each}
    </ul>
  {:catch}
    There was a problem fetching the list of plants!
  {/await}
</main>
