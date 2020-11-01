<script context="module">
  export async function preload(page) {
    const { slug } = page.params;

    const id = parseInt(slug);

    // this.fetch so that this works server side
    const plant = await this.fetch(`/plants/${id}.json`).then((response) =>
      response.json()
    );

    const formattedDateTimeForInputDateTimeLocal = new Date(plant.lastWateredAt)
      .toISOString()
      .substring(0, 16);

    return { plant, formattedDateTimeForInputDateTimeLocal };
  }
</script>

<script lang="ts">
  import { updatePlant } from "../../api";

  export let plant;
  export let formattedDateTimeForInputDateTimeLocal: string;

  let saved = false;

  async function markSaved() {
    saved = true;
    setTimeout(() => {
      saved = !saved;
    }, 2000);
  }

  async function handleSubmit(event: any) {
    const id = event.target.elements[0].value;
    const name = event.target.elements[1].value;
    const lastWateredAt = event.target.elements[2].value;
    const description = event.target.elements[3].value;

    console.log({ description });

    const data = { id, name, lastWateredAt, description };

    plant = await updatePlant(data);

    markSaved();
  }
</script>

<style>
  form {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 2fr 1fr;
  }

  label {
    grid-column: auto;
    grid-column-start: 1;
  }

  input {
    margin-bottom: 5px;
  }

  .description {
    grid-row-start: 4;
    grid-row-end: span 2;
    grid-column-start: 1;
    grid-column-end: 3;
  }

  input[type="submit"] {
    grid-column-start: 1;
    grid-row-start: 6;
    margin-right: 1rem;
  }

  h2 {
    display: inherit;
    margin-bottom: 1rem;
  }

  span {
    grid-row-start: -1;
    color: mediumseagreen;
  }
</style>

<h2>Edit {plant.name}</h2>

<form class="form" on:submit|preventDefault={handleSubmit}>
  <input type="hidden" value={plant.id} />
  <label for="name">Name</label>
  <input name="name" type="text" value={plant.name} />
  <label for="lastWateredAt">Last Watered</label>
  <input
    name="lastWateredAt"
    type="datetime-local"
    value={formattedDateTimeForInputDateTimeLocal} />
  <label for="description">Description</label>
  <input
    class="description"
    name="description"
    type="textarea"
    value={plant.description} />
  <input type="submit" />
  {#if saved}<span>Saved!</span>{/if}
</form>
