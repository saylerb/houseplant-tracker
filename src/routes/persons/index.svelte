<script type="ts">
  let created;

  async function handleSubmit(event) {
    const formElements: HTMLFormElement[] = event.currentTarget.elements;
    const body = {};

    for (let i = 0; i < formElements.length - 1; i++) {
      body[formElements[i].name] = formElements[i].value;
    }

    created = await fetch("/persons.json", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(
      (response) => response.json(),
      (error) => console.log(error)
    );
  }
</script>

<h2>Create An Account</h2>

{#if created}
  {#await created}
    <p>Loading..</p>
  {:then data}
    <p>Created {data.name}</p>
  {:catch error}
    <p>Something went wrong! {error}</p>
  {/await}
{/if}

<form on:submit|preventDefault={handleSubmit}>
  <label for="name">Name</label>
  <input type="text" name="name" />

  <label for="password">Password</label>
  <input type="text" name="password" />

  <label for="email">Email</label>
  <input type="text" name="email" />
  <input type="submit" />
</form>
