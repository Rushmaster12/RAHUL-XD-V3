 ${menu.owner}
╰─━━┈┉┉┅┅┅┅┅┅┅┅
╭─━━┄┄┄┅┅┉┈┈┈┈┈
 ⚙️ *𝐎𝐭𝐡𝐞𝐫 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.other}
╰─━━┈┉┉┅┅┅┅┅┅┅┅
╭─━━┄┄┄┅┅┉┈┈┈┈┈
 🛠️ *𝐓𝐨𝐨𝐥𝐬 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.tools}
╰─━━┈┉┉┅┅┅┅┅┅┅┅

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ RAHUL-MASTER*
`

await conn.sendMessage(from,{image:{url:config.ALIVE_IMG},caption:madeMenu},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})
