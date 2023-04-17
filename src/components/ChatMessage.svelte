<script>
    import { getContext } from "svelte";
    export let messageText;
    export let messageTime;
    export let messageAuthor;
    export let isUser;

    const senderStyle = () => {
        if (isUser) {
            return "user";
        } else {
           return "friend"
        }
    };
</script>

<div class={senderStyle()}>
    <div class="message-user">
        {messageAuthor}:
    </div>
    <div class="message-text">
        {messageText}
    </div>
    <div class="message-time">
        {messageTime}
    </div>
</div>

<style>
    .user {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin: 10px 0;
        color: white;
        background-color: #208ceb;
        width: 50%;
        min-height: 2rem;
        border-radius: 8px;
    }
    .friend {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin: 10px 0;
        color: white;
        background-color: #00ff8c;
        width: 50%;
        min-height: 2rem;
        border-radius: 8px;
    }
    
    .user *{
        margin-left: 10px;
    }
    .message-user {
        font-weight: bold;
    }
</style>