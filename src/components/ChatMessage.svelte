<script>
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
    <div class="message-text">
        {messageText}
    </div>
</div>

<style>
    .user, .friend {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin: 10px 0;
        width: auto;
        min-height: 2rem;
        border-radius: 8px;
        padding: 0 10px;
    }
    .user {
        color: white;
        background-color: #208ceb;
        margin-left: auto;
    }
    
    .friend {
        color: white;
        background-color: #242524;
        margin-right: auto;
    }
    
    .user *{
        margin-left: 10px;
    }
    .message-user {
        font-weight: bold;
    }
</style>