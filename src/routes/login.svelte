<script type="ts">
  import { goto, stores } from "@sapper/app";

  const { session } = stores();

  let created;
  let loggedIn;

  function updateSession(person) {
    session.update((session) => {
      return {
        ...session,
        person,
      };
    });
  }

  async function handleSubmit(event) {
    const formElements: HTMLFormElement[] = event.currentTarget.elements;
    const body = {};

    for (let i = 0; i < formElements.length - 1; i++) {
      body[formElements[i].name] = formElements[i].value;
    }

    created = await fetch("/signup.json", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error("something went wrong when signing up");
        } else {
          return response.json();
        }
      })
      .then((person) => {
        updateSession(person);
        goto("/");
      });
  }

  async function handleSignIn(event) {
    const formElements: HTMLFormElement[] = event.currentTarget.elements;
    const body = {};

    for (let i = 0; i < formElements.length - 1; i++) {
      body[formElements[i].name] = formElements[i].value;
    }

    loggedIn = await fetch("/login.json", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error("something went logging in");
        } else {
          return response.json();
        }
      })
      .then((person) => {
        updateSession(person);
        goto("/");
      });
  }
</script>

<style>
  form {
    margin-bottom: 5rem;
  }
</style>

<h2>Log In</h2>

{#if loggedIn}
  {#await loggedIn}
    <p>Loading..</p>
  {:then data}
    <p>Logged in as {data.name}!</p>
  {:catch error}
    <p>Something went wrong! {error}</p>
  {/await}
{/if}

<form on:submit|preventDefault={handleSignIn}>
  <label for="email">Email</label>
  <input type="email" name="email" />

  <label for="password">Password</label>
  <input type="password" name="password" />
  <input type="submit" />
</form>

<h2>Sign Up</h2>

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
  <input type="password" name="password" />

  <label for="email">Email</label>
  <input type="email" name="email" />
  <input type="submit" />
</form>
