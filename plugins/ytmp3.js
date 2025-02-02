const config = require('../config');
const {
  cmd,
  commands
} = require('../command');
const fetch = require('node-fetch');

cmd({
  pattern: "ytmp3",
  category: "downloader",
  react: "🎥",
  desc: "Download YouTube audios as MP3",
  filename: __filename
},
async(conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        if (!q) return await reply('Please provide a YouTube audio URL.');

        const url = encodeURIComponent(q);
        const response = await fetch(`https://dark-shan-yt.koyeb.app/download/ytmp3?url=${url}`);
        const data = await response.json();

        if (!data.status) return await reply('Failed to fetch audio details. Please check the URL and try again.');

        const audio = data.data;
        const message = `
🎶 𝐘𝐓 𝐒𝐎𝐍𝐆 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 📥

╭━━━━━━━━━●●►
┢❑ 𝐓𝐢𝐭𝐥𝐞: ${audio.title}
┢❑ 𝐅𝐨𝐫𝐦𝐚𝐭: ${audio.format}
┢❑ 𝐓𝐢𝐦𝐞: ${audio.timestump || 'N/A'}
┢❑ 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝: ${audio.ago || 'N/A'}
┢❑ 𝐕𝐢𝐞𝐰𝐬: ${audio.views || 'N/A'}
┢❑ 𝐋𝐢𝐤𝐞𝐬: ${audio.likes || 'N/A'}
╰━━━━━━━━●●►
        `;

       
        await conn.sendMessage(from, {
            image: { url: audio.thumbnail },
            caption: message
        });

        await conn.sendMessage(from, {
            document: { url: audio.download },
            mimetype: 'audio/mp3',
            fileName: `${audio.title}.mp3`,
            caption: `|ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴀʜᴜʟ-xᴅ-ᴠ3`
        });

        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });
    } catch (e) {
        console.error(e);
        await reply(`📕 An error occurred: ${e.message}`);
    }
});





System({
      pattern: 'yta ?(.*)',
      fromMe: isPrivate,
      type: 'download',
      alias: ["song"],
      desc: 'YouTube audio downloader'
}, async (message, match) => {
      match = match || message.reply_message.text;
      if (!match) return await message.reply('_Give a YouTube video *Url* or *Query*_');
      const matchUrl = (await extractUrlsFromText(match))[0];
      if (isUrl(matchUrl)) {
          const { url } = await youtube(matchUrl);
          const { title, author, thumbnail } = await YtInfo(matchUrl);
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await getBuffer(url)), await getBuffer(thumbnail), { title: title, body: author });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
      } else {
          const { title, author, thumbnail, url } = (await yts(match))[0];
          await message.reply("_*" + "downloading " + title + "*_");
          const aud = await AddMp3Meta(await toAudio(await getBuffer((await youtube(url)).url)), await getBuffer(thumbnail), { title: title, body: author.name });
          await message.reply(aud, { mimetype: 'audio/mpeg' }, "audio");
     }
});

System({
    pattern: 'play ?(.*)',
    fromMe: isPrivate,
    desc: 'YouTube video player',
    type: 'download',
}, async (message, match) => {
      if (!match) return await message.reply('_Give a *Query* to play the song or video_');
      if (isUrl(match)) {
          let matchUrl = (await extractUrlsFromText(match))[0];
          const yt = await YtInfo(matchUrl);
          return await message.reply(`*_${yt.title}_*\n\n\n\`\`\`1.⬢\`\`\` *audio*\n\`\`\`2.⬢\`\`\` *video*\n\n_*Send a number as a reply to download*_`, { contextInfo: { externalAdReply: { title: yt.author, body: yt.seconds, thumbnail: await getBuffer(yt.thumbnail), mediaType: 1, mediaUrl: yt.url, sourceUrl: yt.url, showAdAttribution: false, renderLargerThumbnail: true }}});
      } else {
          const yt = (await yts(match))[0];
          return await message.reply(`*_${yt.title}_*\n\n\n\`\`\`1.⬢\`\`\` *audio*\n\`\`\`2.⬢\`\`\` *video*\n\n_*Send a number as a reply to download*_`, { contextInfo: { externalAdReply: { title: yt.author.name, body: yt.ago, thumbnail: await getBuffer(yt.image), mediaType: 1, mediaUrl: yt.url, sourceUrl: yt.url, showAdAttribution: false, renderLargerThumbnail: true }}});
      }
});
  
  System({
    on: 'text',
    fromMe: isPrivate,
    dontAddCommandList: true,
  }, async (message) => {
    if (message.isBot) return;
    if (!message.reply_message.fromMe || !message.reply_message.text) return;
    if (!message.body.includes('⬢')) return;
    let match = message.body.replace('⬢', '');
    if (message.body.includes('1')) {
      const ytAudio = (await yts(match))[0];
      const msg = await message.send(`_*Now playing : ${ytAudio.title} 🎶*_`);
      const data = config.AUDIO_DATA.split(';');
      const aud = await AddMp3Meta(await toAudio(await getBuffer((await youtube(ytAudio.url)).url), 'mp3'), await getBuffer(data[2]), { title: data[0], body: data[1], });
      await message.reply(aud, { mimetype: 'audio/mpeg', contextInfo: { externalAdReply: { title: ytAudio.author.name, body: ytAudio.ago, thumbnail: await getBuffer(ytAudio.image), mediaType: 1, mediaUrl: ytAudio.url, sourceUrl: ytAudio.url, showAdAttribution: false, renderLargerThumbnail: true } }, quoted: msg }, "audio");
    } else if (message.body.includes('2')) {
      const data = (await yts(match))[0];
      const q = await message.send(`_*Now playing : ${data.title} 🎶*_`);
      await message.send(
        await getBuffer((await youtube(data.url, "video")).url), { caption: `_*${data.title}*_`, quoted: q }, 'video');
    };
  });
