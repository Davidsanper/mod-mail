const { QuickDB } = require('quick.db');
const colors = require('colors');
const ms = require('ms');
const db = new QuickDB();
const config = require("./config.js");
const projectVersion = require('./package.json').version || "Unknown";
// const Enmap = require('enmap');
const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  PermissionsBitField,
  Partials,
  REST,
  Routes,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  bold,
  italic,
  codeBlock
} = require('discord.js');

// Creating a new client:
const client = new Client(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.GuildMember,
      Partials.GuildScheduledEvent,
      Partials.User
    ],
    presence: {
      activities: [{
        name: "DM para abrir un ticket!1",
        type: 1,
        url: "https://twitch.tv/discord"
      }]
    },
    shards: "auto"
  }
);

// Host the bot:
require('http')
  .createServer((req, res) => res.end('Ready.'))
  .listen(3030);

// Cool message logger: (DO NOT REMOVE T.F.A#7524, YOU'VE BEEN WARNED.)
const asciiText = `
███╗░░░███╗░█████╗░██████╗░███╗░░░███╗░█████╗░██╗██╗░░░░░
████╗░████║██╔══██╗██╔══██╗████╗░████║██╔══██╗██║██║░░░░░
██╔████╔██║██║░░██║██║░░██║██╔████╔██║███████║██║██║░░░░░
██║╚██╔╝██║██║░░██║██║░░██║██║╚██╔╝██║██╔══██║██║██║░░░░░
██║░╚═╝░██║╚█████╔╝██████╔╝██║░╚═╝░██║██║░░██║██║███████╗
╚═╝░░░░░╚═╝░╚════╝░╚═════╝░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚══════╝
`.underline.blue + `Version ${projectVersion} By T.F.A#7524.
`.underline.cyan;

console.log(asciiText);

// Variables checker:
const AuthentificationToken = config.Client.TOKEN || process.env.TOKEN;

if (!AuthentificationToken) {
  console.error("[ERROR] You need to provide your bot token!".red);
  return process.exit();
}

if (!config.Client.ID) {
  console.error("[ERROR] You need to provide your bot ID!".red);
  return process.exit();
}

if (!config.Handler.GUILD_ID) {
  console.error("[ERROR] You need to provide your server ID!".red);
  return process.exit();
}

if (!config.Handler.CATEGORY_ID) {
  console.warn("[WARN] You should to provide the modmail category ID!".red);
  console.warn("[WARN] Use the slash command /setup to fix this problem without using the config.js file.".red);
}

if (!config.Modmail.INTERACTION_COMMAND_PERMISSIONS) {
  console.error("[ERROR] You need to provide at least one permission for the slash commands handler!".red);
  return process.exit();
};

// Creating some slash commands:
const commands = [
  {
    name: 'ping',
    description: 'Te dice la latencia del bot!',
  },

  {
    name: 'help',
    description: 'Menú de help del bot!'
  },

  {
    name: 'commands',
    description: 'Respondo con todos mis comandos!'
  },

  {
    name: 'ban',
    description: '<:corona:1025120712488398868> Añade a la blacklist a un usuario para que no pueda usar el modmail [OWNERS]',
    options: [
      {
        name: "user",
        description: "El usuario para añadir a la blacklist.",
        type: 6, // Guild "USER" type.
        required: true
      },
      {
        name: "razón",
        description: "La razón de la blacklist",
        type: 3 // "STRING" type.
      }
    ]
  },

  {
    name: 'unban',
    description: '<:corona:1025120712488398868> Le quita de la blacklist a un usuario. [OWNERS]',
    options: [
      {
        name: "usuario",
        description: "El usuario para quitar de la blacklist.",
        type: 6, // Guild "USER" type.
        required: true
      }
    ]
  },

  {
    name: 'setup',
    description: 'Setup para el modmail.'
  }
];

// Slash commands handler:
const rest = new REST({ version: '10' })
  .setToken(process.env.TOKEN || config.Client.TOKEN);

(async () => {
  try {
    console.log('[HANDLER] Started refreshing application (/) commands.'.brightYellow);

    await rest.put(
      Routes.applicationGuildCommands(config.Client.ID, config.Handler.GUILD_ID), { body: commands }
    );

    console.log('[HANDLER] Successfully reloaded application (/) commands.'.brightGreen);
  } catch (error) {
    console.error(error);
  }
})();

// Login to the bot:
client.login(AuthentificationToken)
  .catch(console.log);

// Client once it's ready:
client.once('ready', async () => {
  console.log(`[READY] ${client.user.tag} is up and ready to go.`.brightGreen);

  const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

  if (!guild) {
    console.error('[CRASH] Guild is Invalid, or probably valid but I\'m not there.'.red);
    return process.exit();
  } else return;
});

// If there is an error, this handlers it.
process.on('unhandledRejection', (reason, promise) => {
  console.error("[ANTI-CRASH] An error has occured and been successfully handled: [unhandledRejection]".red);
  console.error(promise, reason);
});

process.on("uncaughtException", (err, origin) => {
  console.error("[ANTI-CRASH] An error has occured and been successfully handled: [uncaughtException]".red);
  console.error(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error("[ANTI-CRASH] An error has occured and been successfully handled: [uncaughtExceptionMonitor]".red);
  console.error(err, origin);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  // If command is "Ping":
  if (command === "ping") {
    interaction.reply(
      {
        content: `${client.ws.ping} ms!`
      }
    ).catch(() => { });

  } else if (command === "help") {

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setAuthor(
              {
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(
                  {
                    dynamic: true
                  }
                )
              }
            )
            .setTitle("**Menú de ayuda de Reak Soporte**:")
            .setDescription(`Este es el menú de ayuda del ${bold("ModMail Bot v" + projectVersion)}.`)
            .addFields(
              {
                name: "**Configuración el sistema:**",
                value: "Si no se ha proporcionado el ID de categoría en el archivo porfavor contacte al desarrollador de lbot, use el comando de barra inclinada \`/setup\` en su lugar."
              },
              {
                name: "Creando un nuevo ticket/mail:",
                value: "Para crear un ticket, envíeme un mensaje privado y se debe crear automáticamente un canal del ticket con su ID de cuenta. Puedes cargar medios, deberían funcionar."
              },
              {
                name: "**Cerrando un Ticket:**",
                value: "Si desea cerrar un ticket de DM, haga clic en el botón gris \"Cerrar\". De lo contrario, si desea cerrar un ticket en el canal de texto, vaya al canal de ticket y haga clic en el botón rojo \"Cerrar\". Si responde con \"Esta interacción falló\", use el comando de barra inclinada \`/cerrar\` en su lugar."
              },
              {
                name: "banear/desbanear a un usuario del uso del sistema ModMail.",
                value: "Para prohibir a un usuario, use el comando de barra inclinada \`/ban\`. De lo contrario, use el comando de barra inclinada \`/unban\`."
              },
              {
                name: "¿Puedo compartir este bot?",
                value: "Desafortunadamente, no puedes añadir el bot de miicky#2321 a otros servidores.. Envíele un mensaje privado y solicite permiso para compartir, de lo contrario, recibirá una advertencia de blacklist. Gracias."
              }
            )
            .setColor('Blue')
            .setFooter(
              {
                text: "Desarrollado por: miicky#2321"
              }
            )
        ],
        ephemeral: true
      }
    ).catch(() => { });

    // If command is "Commands":
  } else if (command === "commands") {
    const totalCommands = [];

    commands.forEach((cmd) => {
      let arrayOfCommands = new Object();

      arrayOfCommands = {
        name: "/" + cmd.name,
        value: cmd.description
      };

      totalCommands.push(arrayOfCommands);
    });

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setAuthor(
              {
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(
                  {
                    dynamic: true
                  }
                )
              }
            )
            .setTitle("Lista de comandos disponibles:")
            .addFields(totalCommands)
        ]
      }
    ).catch(() => { });

    // If command is "Ban":
  } else if (command === "ban") {
    const user = interaction.options.get('user').value;

    let reason = interaction.options.get('razón');
    let correctReason;

    if (!reason) correctReason = 'No se proporcionó ninguna razón.';
    if (reason) correctReason = reason.value;

    if (!interaction.member.permissions.has(
      PermissionsBitField.resolve(config.Modmail.INTERACTION_COMMAND_PERMISSIONS || []))
    ) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setTitle('Permisos que faltan:')
            .setDescription(`Lo siento, no puedo dejarte usar este comando porque necesitas ${bold(config.Modmail.INTERACTION_COMMAND_PERMISSIONS.join(', '))} permisos!`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    const bannedCheck = await db.get(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`);

    if (bannedCheck) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription(`Ese usuario ya está baneado.`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    await db.add(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`, 1);
    await db.set(`banned_guild_${config.Handler.GUILD_ID}_user_${user}_reason`, correctReason);

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription(`Ese usuario ha sido prohibido con éxito. Razón: ${bold(correctReason)}`)
            .setColor('Green')
        ],
        ephemeral: true
      }
    );

    // If command is "Unban":
  } else if (command === "unban") {
    const user = interaction.options.getUser.value;

    if (!interaction.member.permissions.has(
      PermissionsBitField.resolve(config.Modmail.INTERACTION_COMMAND_PERMISSIONS || []))
    ) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setTitle('Permisos que faltan:')
            .setDescription(`Lo siento, no puedo dejarte usar este comando porque necesitas ${bold(config.Modmail.INTERACTION_COMMAND_PERMISSIONS.join(', '))} permisos!`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    const bannedCheck = await db.get(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`);

    if (!bannedCheck) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription(`Ese usuario ya no está baneado.`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    await db.delete(`banned_guild_${config.Handler.GUILD_ID}_user_${user}`);
    await db.delete(`banned_guild_${config.Handler.GUILD_ID}_user_${user}_reason`);

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription(`Ese usuario ha sido desbaneado con éxito.`)
            .setColor('Green')
        ],
        ephemeral: true
      }
    );

    // If command is "Setup":
  } else if (command === "setup") {
    if (!interaction.member.permissions.has(
      PermissionsBitField.resolve(config.Modmail.INTERACTION_COMMAND_PERMISSIONS || []))
    ) return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setTitle('Permisos que faltan:')
            .setDescription(`Lo siento, no puedo dejarte usar este comando porque necesitas ${bold(config.Modmail.INTERACTION_COMMAND_PERMISSIONS.join(', '))} permisos!`)
            .setColor('Red')
        ],
        ephemeral: true
      }
    );

    const guild = client.guilds.cache.get(config.Handler.GUILD_ID);
    const category = guild.channels.cache.find(CAT => CAT.id === config.Handler.CATEGORY_ID || CAT.name === "ModMail");

    // If category is found:
    if (category) {
      interaction.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Ya existe una categoría de modmail llamada "ModMail". ¿Reemplazar la categoría anterior por una categoría nueva?\n\n: advertencia: si hace clic en **Reemplazar**, todos los canales de texto de los correos estarán fuera de la categoría.`)
              .setColor('Red')
              .setFooter(
                {
                  text: "Esta solicitud caduca en 10 segundos, los botones no responderán a sus acciones después de 10 segundos."
                }
              )
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('replace_button_channel_yes')
                  .setLabel('Replace')
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId('replace_button_channel_no')
                  .setLabel('No')
                  .setStyle(ButtonStyle.Danger),
              )
          ],
          ephemeral: true
        }
      ).catch(() => { });

      const collectorREPLACE_CHANNEL = interaction.channel.createMessageComponentCollector({
        time: 10000
      });

      collectorREPLACE_CHANNEL.on('collect', async (i) => {
        const ID = i.customId;

        if (ID == "replace_button_channel_yes") {
          i.update(
            {
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Creando una nueva categoría... ¡Esto puede llevar un tiempo!`)
                  .setColor('Yellow')
              ],
              components: [
                new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId('replace_button_channel_yes')
                      .setLabel('Replace')
                      .setStyle(ButtonStyle.Success)
                      .setDisabled(true),
                    new ButtonBuilder()
                      .setCustomId('replace_button_channel_no')
                      .setLabel('No')
                      .setStyle(ButtonStyle.Danger)
                      .setDisabled(true),
                  )
              ]
            }
          ).catch(() => { });

          await category.delete()
            .catch(() => { });

          const channel = await guild.channels.create({
            name: "ModMail",
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
            ]
          }).catch(console.log);

          let roles = [];

          if (config.Modmail.MAIL_MANAGER_ROLES) {
            config.Modmail.MAIL_MANAGER_ROLES.forEach(async (role) => {
              const roleFetched = guild.roles.cache.get(role);
              if (!roleFetched) return roles.push('[INVALID ROLE]');

              roles.push(roleFetched);

              await channel.permissionOverwrites.create(roleFetched.id, {
                SendMessages: true,
                ViewChannel: true,
                AttachFiles: true
              })
            });
          } else {
            roles.push("No se agregaron roles al archivo! Porfavor contacte con el desarrollador!");
          }

          interaction.editReply(
            {
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Listo, se creó con éxito una categoría de correo llamada **ModMail**.`)
                  .addFields(
                    { name: "Roles", value: roles.join(', ') + "." }
                  )
                  .setFooter(
                    {
                      text: "ADVERTENCIA: Verifique los roles en el canal de categoría, los errores pueden ocurrir en cualquier momento."
                    }
                  )
                  .setColor('Green')
              ]
            }
          ).catch(() => { });

          return collectorREPLACE_CHANNEL.stop();
        } else if (ID == "replace_button_channel_no") {
          i.update(
            {
              embeds: [
                new EmbedBuilder()
                  .setDescription(`Cancelado.`)
                  .setFooter(
                    {
                      text: "Ahora puede hacer clic en \"Descartar mensaje\" debajo de este mensaje incrustado."
                    }
                  )
                  .setColor('Green')
              ],
              components: [
                new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId('replace_button_channel_yes')
                      .setLabel('Replace')
                      .setStyle(ButtonStyle.Success)
                      .setDisabled(true),
                    new ButtonBuilder()
                      .setCustomId('replace_button_channel_no')
                      .setLabel('No')
                      .setStyle(ButtonStyle.Danger)
                      .setDisabled(true),
                  )
              ],
            }
          ).catch(() => { });

          return collectorREPLACE_CHANNEL.stop();
        } else return;
      })

      // If category is not found:
    } else {
      interaction.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Creando una nueva categoría... ¡Esto puede llevar un tiempo!`)
              .setColor('Yellow')
          ]
        }
      ).catch(() => { });

      const channel = await guild.channels.create({
        name: "ModMail",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
        ]
      }).catch(console.log);

      let roles = [];

      if (config.Modmail.MAIL_MANAGER_ROLES) {
        config.Modmail.MAIL_MANAGER_ROLES.forEach(async (role) => {
          const roleFetched = guild.roles.cache.get(role);
          if (!roleFetched) return roles.push('[INVALID ROLE]');

          roles.push(roleFetched);

          await channel.permissionOverwrites.create(roleFetched.id, {
            SendMessages: true,
            ViewChannel: true,
            AttachFiles: true
          })
        });
      } else {
        roles.push("No se agregaron roles al archivo! Porfavor contacte con el desarrollador!");
      }

      return interaction.editReply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Listo, creó con éxito una categoría de correo llamada **ModMail**.`)
              .addFields(
                { name: "Roles", value: roles.join(', ') + "." }
              )
              .setFooter(
                {
                  text: "ADVERTENCIA: Verifique los roles en el canal de categoría, los errores pueden ocurrir en cualquier momento."
                }
              )
              .setColor('Green')
          ]
        }
      ).catch(() => { });
    }

  } else return;
});

// ModMail System:
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

  if (!guild) {
    console.error('[CRASH] Guild is not valid.'.red);
    return process.exit();
  }

  const category = guild.channels.cache.find(CAT => CAT.id === config.Handler.CATEGORY_ID || CAT.name === "ModMail");

  const channel = guild.channels.cache.find(
    x => x.name === message.author.id && x.parentId === category.id
  );

  const bannedUserCheck = await db.get(`banned_guild_${config.Handler.GUILD_ID}_user_${message.author.id}`);

  // If the message in a DM channel:
  if (message.channel.type == ChannelType.DM) {
    if (bannedUserCheck) {
      const reason = await db.get(`banned_guild_${config.Handler.GUILD_ID}_user_${message.author.id}_reason`);

      return message.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setTitle("Error al crear el ticket:")
              .setDescription(`Lo sentimos, no pudimos crear un ticket para ti porque eres ${bold('banned')} de usar el sistema modmail!`)
              .addFields(
                { name: 'Razón por el baneo:', value: italic(reason) }
              )
          ]
        }
      );
    };

    if (!category) return message.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setDescription("El sistema no esta listo!")
            .setColor("Red")
        ]
      }
    );

    // The Modmail system:
    if (!channel) {
      let embedDM = new EmbedBuilder()
        .setTitle("Creación de ticket:")
        .setDescription(`Su ticket ha sido creado con éxito con estos detalles a continuación:`)
        .addFields(
          { name: "Mensaje:", value: `${message.content || italic("(No se envió ningún mensaje, probablemente se envió un mensaje multimedia/incrustado o se produjo un error)")}` }
        )
        .setColor('Green')
        .setFooter(
          {
            text: "Puede hacer clic en el botón \"Cerrar\" para cerrar este ticket."
          }
        )

      if (message.attachments.size) {
        embedDM.setImage(message.attachments.map(img => img)[0].proxyURL);
        embedDM.addFields(
          { name: "Media(s)", value: italic("(Debajo de esta línea de mensaje)") }
        )
      };
      
      message.reply(
        {
          embeds: [
            embedDM
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('close_button_created_mail_dm')
                  .setLabel('Close')
                  .setStyle(ButtonStyle.Secondary),
              )
          ]
        }
      );

      const channel = await guild.channels.create({
        name: message.author.id,
        type: ChannelType.GuildText,
        parent: category,
        topic: `Un canal de correo creado por ${message.author.tag} para pedir ayuda u otra cosa.`
      }).catch(console.log);

      let embed = new EmbedBuilder()
        .setTitle("Nuevo Ticket Creado!")
        .addFields(
          { name: "Usuario", value: `${message.author.tag} (\`${message.author.id}\`)` },
          { name: "Mensaje", value: `${message.content.substr(0, 4096) || italic("(No se envió ningún mensaje, probablemente se envió un mensaje multimedia/incrustado o se produjo un error)")}` },
          { name: "Fue creado:", value: `${new Date().toLocaleString()}` },
        )
        .setColor('Blue')

      if (message.attachments.size) {
        embed.setImage(message.attachments.map(img => img)[0].proxyURL);
        embed.addFields(
          { name: "Media(s)", value: italic("(Debajo de esta línea de mensaje)") }
        )
      };

      const ROLES_TO_MENTION = [];
      config.Modmail.MAIL_MANAGER_ROLES.forEach((role) => {
        if (!config.Modmail.MAIL_MANAGER_ROLES || !role) return ROLES_TO_MENTION.push('[ERROR: No se proporcionaron roles]')
        if (config.Modmail.MENTION_MANAGER_ROLES_WHEN_NEW_MAIL_CREATED == false) return;

        const ROLE = guild.roles.cache.get(role);
        if (!ROLE) return;
        ROLES_TO_MENTION.push(ROLE);
      });

      return channel.send(
        {
          content: config.Modmail.MENTION_MANAGER_ROLES_WHEN_NEW_MAIL_CREATED ? ROLES_TO_MENTION.join(', ') : "** **",
          embeds: [
            embed
          ],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('close_button_created_mail_channel')
                  .setLabel('Close')
                  .setStyle(ButtonStyle.Danger),
              )
          ]
        }
      ).then(async (sent) => {
        sent.pin()
          .catch(() => { });
      });

    } else {
      let embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(message.content.substr(0, 4096) || italic("(No se envió ningún mensaje, probablemente se envió un mensaje multimedia/incrustado o se produjo un error))"))
        .setColor('Green');

      if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

      message.react("📨")
        .catch(() => { });

      return channel.send(
        {
          embeds: [
            embed
          ]
        }
      );
    }

    // If the message is in the modmail category:
  } else if (message.channel.type === ChannelType.GuildText) {
    if (!category) return;

    if (message.channel.parentId === category.id) {
      const requestedUserMail = guild.members.cache.get(message.channel.name);

      let embed = new EmbedBuilder()
        .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(message.content.substr(0, 4096) || italic("(No se envió ningún mensaje, probablemente se envió un mensaje multimedia/incrustado o se produjo un error)"))
        .setColor('Red');

      if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

      message.react("📨")
        .catch(() => { });

      return requestedUserMail.send(
        {
          embeds: [
            embed
          ]
        }
      ).catch(() => { });
    } else return;
  }
});

// Buttons & Modals Handler:
client.on('interactionCreate', async (interaction) => {

  // BUTTONS:
  if (interaction.isButton()) {
    const ID = interaction.customId;

    // Close Button in Text channels:
    if (ID == "close_button_created_mail_channel") {
      const modal = new ModalBuilder()
        .setCustomId('modal_close')
        .setTitle('Cerrando Ticket:');

      const REASON_TEXT_INPUT = new TextInputBuilder()
        .setCustomId('modal_close_variable_reason')
        .setLabel("Razón por el ticket cerrado:")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const ACTION_ROW = new ActionRowBuilder()
        .addComponents(REASON_TEXT_INPUT);

      modal.addComponents(ACTION_ROW);

      await interaction.showModal(modal)
        .catch(() => { });

      // Close Button in DMs:
    } else if (ID == "close_button_created_mail_dm") {
      const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

      const category = guild.channels.cache.find(CAT => CAT.id === config.Handler.CATEGORY_ID || CAT.name === "ModMail");

      const channelRECHECK = guild.channels.cache.find(
        x => x.name === interaction.user.id && x.parentId === category.id
      );

      if (!channelRECHECK) return interaction.reply(
        {
          embeds: [
            new EmbedBuilder()
              .setDescription(`Ya cerrado por un miembro del personal o por usted.`)
              .setColor('Yellow')
          ],
          ephemeral: true
        }
      );

      await channelRECHECK.delete()
        .catch(() => { })
        .then(async (ch) => {
          if (!ch) return; // THIS IS 101% IMPORTANT. IF YOU REMOVE THIS LINE, THE "Mail Closed" EMBED WILL DUPLICATES IN USERS DMS. (1, and then 2, 3, 4, 5 until Infinity)

          return interaction.reply(
            {
              embeds: [
                new EmbedBuilder()
                  .setTitle('Ticket Cerrado:')
                  .setDescription(`Su correo ha sido cerrado con éxito.`)
                  .setColor('Green')
              ]
            }
          ).catch(() => { });
        });
    } else return;

    // MODALS:
  } else if (interaction.type === InteractionType.ModalSubmit) {
    const ID = interaction.customId;

    if (ID == "modal_close") {
      const guild = client.guilds.cache.get(config.Handler.GUILD_ID);

      const requestedUserMail = guild.members.cache.get(interaction.channel.name);

      let reason = interaction.fields.getTextInputValue('modal_close_variable_reason');
      if (!reason) reason = "No se proporcionó ninguna razón.";

      interaction.reply(
        {
          content: "Cerrando..."
        }
      ).catch(() => { });

      return interaction.channel.delete()
        .catch(() => { })
        .then(async (ch) => {
          if (!ch) return; // THIS IS 101% IMPORTANT. IF YOU REMOVE THIS LINE, THE "Mail Closed" EMBED WILL DUPLICATES IN USERS DMS. (1, and then 2, 3, 4, 5 until Infinity)

          return await requestedUserMail.send(
            {
              embeds: [
                new EmbedBuilder()
                  .setTitle('Ticket cerrado:')
                  .setDescription(`Su correo ha sido cerrado con éxito.`)
                  .addFields(
                    { name: "Razón", value: `${italic(reason)}` }
                  )
                  .setColor('Green')
              ]
            }
          ).catch(() => { });
        });
    } else return;
  } else return;
});

/*
* DiscordJS-V14-ModMail-Bot
* Yet Another Discord ModMail Bot made with discord.js v14, built on Repl.it and coded by T.F.A#7524.
* Developer: T.F.A#7524
* Support server: dsc.gg/codingdevelopment
* Please DO NOT remove these lines, these are the credits to the developer.
* Sharing this project without giving credits to me (T.F.A) ends in a Copyright warning. (©)
*/
