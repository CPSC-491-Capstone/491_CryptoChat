<script>
    import { getContext } from 'svelte'
    export let friends = []
    export let reload;
    let activeChat = getContext("activeChat");
    let setActiveChat = (friendName, friendPublicKey) => {
        activeChat.set({
            "friendName": friendName,
            "friendPublicKey": friendPublicKey,
        });
        reload();
    }
</script>

<div class="friend-list">
    {#each friends as friend}
        <div class="friend-card" on:click={() => setActiveChat(friend.name, friend.publicKey)} on:keyup={()=>{}}>
            <img src="https://images.squarespace-cdn.com/content/v1/5a41ce1129f187de5f70506d/1515104526219-CTC9ND914ZD62K9D3ZSW/placeholder-person.jpg" alt="Avatar">
            <div class="card-text">
                <h3>{friend.name}</h3>
                <p>{friend.publicKey}</p>
            </div>
            <div class="activity-dot"></div>
        </div>
    {/each}
</div>

<style>
    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .friend-list {
        display: flex;
        flex-direction: column;
        width: 30%;
        background-color: #4e4e4e;
    }

    .card-text {
        display: flex;
        flex-direction: column;
        color: rgb(202, 202, 202);
    }
    .card-text * {
        margin: 0;
        margin-left: 1rem;
    }

    .friend-card {
        display: flex;
        align-items: center;
        padding: 1rem;
        width: 100%;
        border: 1px solid #000;
    }
</style>