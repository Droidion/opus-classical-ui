<script lang="ts">
  import { getSearchComposersData } from '@lib/apiClient'
  import Fuse from 'fuse.js'
  import type { FoundComposers } from '@models/FoundComposers'

  let searchData: FoundComposers = []
  let searchResults: FoundComposers = []
  let isSearchVisible = false
  let selectedSearchResultIndex = 0

  function search(q: string): void {
    const keys = ['firstName', 'lastName']
    const fuse = new Fuse(searchData, {
      keys,
    })

    searchResults = fuse
      .search(q)
      .map(result => result.item)
      .slice(0, 5)
  }

  async function fetchSearchData(): Promise<void> {
    searchData = await getSearchComposersData()
  }

  async function showSearch(): Promise<void> {
    await fetchSearchData()
    isSearchVisible = true
  }

  function hideSearch(): void {
    searchResults = []
    isSearchVisible = false
  }

  function focus(el: HTMLElement): void {
    el.focus()
  }

  function redirectOnSearchResult() {
    location.pathname = `/composer/${searchResults[selectedSearchResultIndex]?.slug}`
  }

  function moveSelectionUp() {
    selectedSearchResultIndex =
      selectedSearchResultIndex > 0
        ? selectedSearchResultIndex - 1
        : searchResults.length - 1
  }

  function moveSelectionDown() {
    selectedSearchResultIndex =
      selectedSearchResultIndex < searchResults.length - 1
        ? selectedSearchResultIndex + 1
        : (selectedSearchResultIndex = 0)
  }

  function clickOutside(
    node: HTMLElement,
    handler: () => void,
  ): { destroy: () => void } {
    const onClick = (event: MouseEvent) =>
      node &&
      !node.contains(event.target as HTMLElement) &&
      !event.defaultPrevented &&
      handler()

    document.addEventListener('click', onClick, true)

    return {
      destroy() {
        document.removeEventListener('click', onClick, true)
      },
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.code == 'ArrowUp' && searchResults.length > 0) {
      moveSelectionUp()
    } else if (event.code == 'ArrowDown' && searchResults.length > 0) {
      moveSelectionDown()
    } else if (event.code == 'Escape') {
      hideSearch()
    } else if (event.code == 'Enter' && searchResults.length > 0) {
      redirectOnSearchResult()
    }
  }

  function handleSearchInput(event: { currentTarget: HTMLInputElement }): void {
    const inputEvent = event.currentTarget.value.trim()
    if (searchData.length > 0) {
      search(inputEvent)
    }
  }

  function handleResultHover(index: number): void {
    selectedSearchResultIndex = index
  }
</script>

<div
  class="hover:scale-125 duration-150 search-button label cursor-pointer"
  role="button"
  aria-label="Search Icon"
  tabindex="0"
  on:click={showSearch}
  on:keypress={showSearch}
>
  <svg
    class="h-4 w-4 xl:h-5 xl:w-5 icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m23.809 21.646-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z"
    />
  </svg>
</div>

{#if isSearchVisible}
  <div
    role="link"
    tabindex="0"
    class="inset-0 fixed bg-black/35 backdrop-blur-sm"
    on:keydown={handleKeydown}
  >
    <div
      class="text-lg absolute top-32 w-80 left-[calc(50%-10rem)] rounded shadow-md bg-white dark:bg-mineshaft"
      use:clickOutside={hideSearch}
    >
      <input
        class="text-black dark:text-white/80 w-[calc(100%-0.8rem)] bg-black/10 border-0 rounded-sm h-8 m-1.5 px-1.5 py-4 appearance-none placeholder:font-light focus:outline-none"
        type="search"
        placeholder="Search composers by last name"
        on:input={handleSearchInput}
        use:focus
      />
      {#each searchResults as composer, i}
        <a
          href="/composer/{composer.slug}"
          on:mouseenter={() => handleResultHover(i)}
        >
          <div
            class={selectedSearchResultIndex == i
              ? 'bg-black/10 rounded-sm py-0.5 mx-1.5 px-2 my-1'
              : 'rounded-sm py-0.5 mx-1.5 px-2 my-1'}
          >
            {composer.lastName}, {composer.firstName}
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}
