<script lang="ts">
  import { onMount } from "svelte";
  import { getPlants, updatePlant, deletePlant, createPlant } from "../api";
  import { Temporal } from "proposal-temporal";
  import type { Plant } from "@prisma/client";

  const dev = true; // TODO: Be able to set this during build

  let plants: Promise<PlantWithElapsedTime[]> = Promise.resolve([]);
  let value = "";

  interface HasElapsedTime {
    elapsed: string;
  }

  // TODO: the typing of Plant is not quite correct, since the dates are strings in the frontend
  type PlantWithElapsedTime = Plant & HasElapsedTime;

  async function allPlants(): Promise<PlantWithElapsedTime[]> {
    return getPlants().then((json) =>
      json
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
        )
    );
  }

  onMount(async () => {
    plants = allPlants();
  });

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
    border: solid 1px lightgray;
    padding: 1em;
  }
</style>

<main>
  <form on:submit|preventDefault={handleNewPlantSubmit}>
    <label for="newPlant">Add Plant</label>
    <input type="text" bind:value name="newPlant" />
    <input type="submit" />
  </form>

  {#await plants}
    loading...
  {:then data}
    <ul>
      {#each data as plant (plant.id)}
        <li>
          <h3>{plant.name} - {plant.elapsed}</h3>

          <div class="controls">
            <button on:click={() => handleWatered(plant.id)}>Watered!</button>
            <a href={`/plants/${plant.id}`}>Edit</a>
            <button on:click={() => handleDelete(plant.id)}>X</button>
          </div>
        </li>
      {/each}
    </ul>
  {:catch error}
    There was a problem fetching the list of plants
    {#if dev}{error.stack}{/if}
  {/await}
</main>
