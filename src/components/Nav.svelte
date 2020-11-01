<script lang="ts">
  import { stores, goto } from "@sapper/app";

  const { session } = stores();

  let person = $session.person;

  // Re-render the nav when the logged in person changes
  $: {
    person = $session.person;
  }

  export let segment: string;
</script>

<style>
  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }

  /* remove default button styling for log out */
  button {
    display: inline-block;
    font-weight: 300;
    font-family: inherit;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    padding: 1em 0.5em;
    border: none;
    margin: 0;
    background: transparent;
    cursor: pointer;
    transition: background 250ms ease-in-out, transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
</style>

<nav>
  <ul>
    <li>
      <a aria-current={segment === undefined ? 'page' : undefined} href=".">
        houseplant 🌱 life
      </a>
    </li>
    <li>
      <a aria-current={segment === 'about' ? 'page' : undefined} href="about">
        about
      </a>
    </li>
    {#if person}
      <li>
        <a
          aria-current={segment === 'login' ? 'page' : undefined}
          href="login">{person.name}</a>
      </li>
      <li>
        <button
          class="logout"
          on:click={() => {
            fetch('/logout.json').then((response) => {
              if (response.status === 200) {
                session.update((session) => {
                  // remove person from store
                  const { person, ...rest } = session;

                  return rest;
                });
                goto('./login');
              } else {
                throw Error('Could not log you out!');
              }
            });
          }}>log out</button>
      </li>
    {:else}
      <li>
        <a
          aria-current={segment === 'login' ? 'page' : undefined}
          href="login">log in</a>
      </li>
    {/if}
  </ul>
</nav>
