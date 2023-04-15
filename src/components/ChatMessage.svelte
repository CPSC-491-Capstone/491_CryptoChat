<script>
    export let messageText;
    export let messageTime;
    export let messageAuthor;
</script>

<div class="message">
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
    .message {
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
    
    .message *{
        margin-left: 10px;
    }
    .message-user {
        font-weight: bold;
    }
</style>