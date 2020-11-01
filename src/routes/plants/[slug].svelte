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
  import { goto } from "@sapper/app";
  import { updatePlant } from "../../api";

  export let plant;
  export let formattedDateTimeForInputDateTimeLocal: string;

  async function handleSubmit(event: any) {
    const id = event.target.elements[0].value;
    const name = event.target.elements[1].value;
    const lastWateredAt = event.target.elements[2].value;

    const data = { id, name, lastWateredAt };

    plant = await updatePlant(data);

    goto("/");
  }
</script>

<h2>Edit {plant.name}</h2>

<form class="form" on:submit|preventDefault={handleSubmit}>
  <input type="hidden" value={plant.id} />
  <input type="text" value={plant.name} />
  <input type="datetime-local" value={formattedDateTimeForInputDateTimeLocal} />
  <input type="submit" />
</form>
