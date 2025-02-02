System({
    pattern: "pp$",
    fromMe: true,
    type: "whatsapp",
    alias: ['fullpp', 'setpp'],
    desc: "Set full screen profile picture",
}, async (message, match) => {
    if (match === "remove") {
        await message.client.removeProfilePicture(message.user.jid);
        return await message.reply("_Profile Picture Removed_");
    }
    if (!message.reply_message || !message.reply_message.image) return await message.reply("_Reply to a photo_");
    let media = await message.reply_message.download();
    await message.client.updateProfile(media, message.user.jid);
    return await message.reply("_Profile Picture Updated POWERED BY RAHUL-MASTER!_");
});
