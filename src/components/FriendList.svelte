<script>
    import { getContext } from 'svelte'
    export let friends = []
    let activeChat = getContext("activeChat");
    let setActiveChat = (friendName, friendPublicKey) => {
        activeChat.set({
            "friendName": friendName,
            "friendPublicKey": friendPublicKey,
        });
    }
</script>

<div class="friend-list">
    {#each friends as friend}
        <div class="friend-card" on:click={() => setActiveChat(friend.name, friend.publicKey)} on:keyup={console.log("hello")}>
            <h3>{friend.name}</h3>
            <p>{friend.publicKey}</p>
        </div>
    {/each}
</div>

<style>
    .friend-list {
        display: flex;
        flex-direction: column;
        width: 30%;
    }

    .friend-card {
        display: flex;
        flex-direction: column;
        border: 1px solid black;
        background-color: #d1d1d1;
    }
</style>