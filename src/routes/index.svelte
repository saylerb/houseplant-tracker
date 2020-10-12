<script>
  import { onMount } from "svelte";
  import { getPlants, updatePlant, deletePlant } from "../api";
  import { Temporal } from "proposal-temporal/lib/index.mjs";

  const dev = true; // TODO: Be able to set this during build

  let plants = [];

  async function allPlants() {
    return getPlants().then(json =>
      json
        .map(plant => {
          const date = Temporal.DateTime.from(plant.lastWateredAt);

          return {
            ...plant,
            formattedDate: Temporal.Date.from(date).toString(),
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
</style>

<main>
  <h1>Name - Last Watered At</h1>

  {#await plants}
    loading...
  {:then data}
    <ul>
      {#each data as plant (plant.id)}
        <li>
          <div>{plant.name} - {plant.formattedDate}</div>
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
