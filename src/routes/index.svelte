<script lange="ts">
  import { onMount } from "svelte";
  import { getPlants, updatePlant, deletePlant, createPlant } from "../api";
  import { Temporal } from "proposal-temporal/lib/index.mjs";

  const dev = true; // TODO: Be able to set this during build

  let plants = Promise.resolve([]);
  let value = "";

  async function allPlants() {
    return getPlants().then(json =>
      json
        .map(plant => {
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
            compare: date
          };
        })
        .sort((a, b) => Temporal.DateTime.compare(a.compare, b.compare))
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

  async function handleDelete(id) {
    await deletePlant(id);

    plants = allPlants();
  }

  async function handleNewPlantSubmit() {
    await createPlant({ name: value });

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

  form {
    display: inline;
  }

  ul {
    list-style-type: none;
  }
</style>

<main>
  <h1>Name - Last Watered At</h1>

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
          <div>{plant.name} - {plant.elapsed}</div>
          <form class="form" on:submit|preventDefault={handleSubmit}>
            <input type="hidden" value={plant.id} />
            <input type="datetime-local" />
            <input type="submit" />
          </form>
          <button on:click={() => handleDelete(plant.id)}>X</button>
        </li>
      {/each}
    </ul>
  {:catch error}
    There was a problem fetching the list of plants
    {#if dev}{error.stack}{/if}
  {/await}
</main>
