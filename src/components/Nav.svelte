<script lang="ts">
  import { currentLoggedInUser } from "../stores";

  import { goto } from "@sapper/app";
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
        home
      </a>
    </li>
    <li>
      <a aria-current={segment === 'about' ? 'page' : undefined} href="about">
        about
      </a>
    </li>
    {#if $currentLoggedInUser}
      <li><a href="login">{$currentLoggedInUser.name}</a></li>
      <li>
        <button
          class="logout"
          on:click={() => {
            fetch('/logout.json').then((response) => {
              if (response.status === 200) {
                currentLoggedInUser.set(undefined);
                goto('./login');
              } else {
                throw Error('Could not log you out!');
              }
            });
          }}>log out</button>
      </li>
    {:else}
      <li><a href="login">log in</a></li>
    {/if}
  </ul>
</nav>
