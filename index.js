const Discord = require('discord.js');
//1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣//
const config = require("config.json");
const mongoose = require('mongoose');
const ms = require('ms');
const { CanvasSenpai } = require("canvas-senpai")
const humanizeDuration = require('humanize-duration');
const canva = new CanvasSenpai();
const bot = new Discord.Client();
const { Client, MessageEmbed } = require('discord.js');
const prefix = '!'
const ytdl = require("ytdl-core");
const client = new Client();
require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 60;
var canal_id = '706901554908889219';
var comun = '706901554908889219';
var pre = "!!";
var servers = {};

var msg_id;
const keepAlive = require('./server');
const Monitor = require('ping-monitor');

keepAlive();
const monitor = new Monitor({
	website: 'https://lutor-host.gabrilyopexx.repl.co/',
	title: 'secundario',
	interval: 5
});
monitor.on('up', res => console.log(`${res.website} está encedido.`));
monitor.on('down', res =>
	console.log(`${res.website} se ha caído - ${res.statusMessage}`)
);
monitor.on('stop', website => console.log(`${website} se ha parado.`));
monitor.on('error', error => console.log(error));

client.on('ready', () => {
	console.log(`${client.user.tag} esta logeado`);
	client.user.setPresence({
		status: 'online',
		activity: {
			name: 'Usuarios en Wintercraft.',
			type: 'WATCHING'
		}
	});

 
	var canal = client.channels.cache.get(canal_id);
	canal.bulkDelete(1);
	crearMsgTicket(canal);
});
function crearMsgTicket(canal) {
	const embed = new Discord.MessageEmbed()
		.setTitle('**Soporte Tickets **')
		.setDescription(
			'Para abrir un Ticket, Reacciona con el emoji, tu ticket de soporte aparecerá en la parte superior de todos los canales.'
		)
		.setThumbnail(
			client.user.displayAvatarURL({ format: 'png', dynamic: true })
		)
		.setFooter(client.user.tag, client.user.displayAvatarURL())
		.setColor('ff8000')
		.setTimestamp();
	canal.send(embed).then(msg => {
		msg_id = msg.id;
		msg.react('🎫');
	});
}

function EnviarMensaje(canal, user) {
    const soporte = new Discord.MessageEmbed()
        .setTitle('**__Soporte__**')
        .setDescription('Bienvenido a tu ticket,por favor se pacient esperando a un staff para que te atienda. \n\n Reacciona con 🏛️ Si es un Problema o Duda acerca de compra de rangos.\n \n Reacciona con 🔰 Si es una Duda o reporte. \n \n Reacciona con ✅ Si es Para Apelar una Sancion.')
        .setFooter('WinterCraft Network - Soporte')
        .setColor('ff8000')
    const auto = new Discord.MessageEmbed()
        .setTitle('**__Soporte Automatico__**')
        .setDescription('Si deseas usar el soporte automatico, reacciona con ❄️')
        .setFooter('WinterCraft Network - Soporte')
        .setColor('ff8000')
	canal
		.send(soporte).then(msg => {
			msg.react('🏛️');
			msg.react('✅');
			msg.react('🔰');
		});
        canal
		.send(auto).then(msg => {
			msg.react('❄️');
		});
}
function crearTicket(message, user) {
	var canal = message.guild.channels.cache.find(
		c => c.name == `ticket-${user.tag}`
	);
	if (!canal) {
		message.guild.channels
			.create(`ticket-${user.username}`, { reason: 'ticket' })
			.then(channel => {
				EnviarMensaje(channel, user);

				var rol = message.guild.roles.cache.find(r => r.name === '@everyone');
                var soporte = message.guild.roles.cache.find(r => r.name === '❄️ | Soporte')
                var soporte1 = message.guild.roles.cache.find(r => r.name === '👮‍♂️| Trial Helper')

				channel.createOverwrite(user, {
					SEND_MESSAGES: true,
					VIEW_CHANNEL: true,
					READ_MESSAGE_HISTORY: true
				});

				channel.createOverwrite(rol, {
					SEND_MESSAGES: false,
					VIEW_CHANNEL: false
				});
                	channel.createOverwrite(soporte, {
					SEND_MESSAGES: true,
					VIEW_CHANNEL: true
				});
                	channel.createOverwrite(soporte1, {
					SEND_MESSAGES: true,
					VIEW_CHANNEL: true,
					READ_MESSAGE_HISTORY: true
				});
			});
	}
}

client.on('message', async message => {
	if (message.content === '!!borrar') {
		if (message.channel.name.startsWith('ticket-')) message.channel.delete();
     if(!message.member.hasPermission("ADMINISTRATOR") )return;
      message.send('No tienes permisos de cerrar tickets');
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
    const compra = new Discord.MessageEmbed()
        .setTitle('**__Soporte de Compras__**')
        .setDescription('Las compras suelen Llegar de plazo inmediato al nick puesto en nuestra tienda. \n Aunque a veces tarda un poco, si ya esperaste una cantidad de tiempo considerable, y aun no recibiste tu(s) articulos comprados, envia una captura y/o foto del comprobante de pago realizado y la lista de articulos comprados.')
        .setFooter('WinterCraft Network - Soporte')
        .setColor('ff8000')
    const reporte = new Discord.MessageEmbed()
        .setTitle('**__Reportar a un Jugador__**')
        .setDescription('En caso de Reporte, sigue la siguiente plantilla. \n **__Ejemplo__** \n Nick: MyNameIsFab \n Reportado: UfoScience \n Razón: Uso de Hacks. \n Pruebas : (Fotos o Videos)\n\n Recuerda Rellenar esta plantilla con tus datos ,y describe la situación tan detallada como sea posible.')
        .setFooter('WinterCraft Network - Soporte')
        .setColor('ff8000')
    const apelar = new Discord.MessageEmbed()
        .setTitle('**__Apelación De Sanciones__**')
        .setDescription('Para apelar una sancion, Debes seguir la siguiente plantilla.\n **__Ejemplo__** \n Nick: SquareCircles_ \n Staff Que te sanciono: UfoScience \n Tipo y duracion de la sancion: Ban Permanente \n Razon de sancion: Uso de bugs \n\n Recuerda Rellenar esta plantilla con tus datos ,y describe la situación tan detallada como sea posible.')
        .setFooter('WinterCraft Network - Soporte')
        .setColor('ff8000')
    const auto1 = new Discord.MessageEmbed()
        .setTitle('**__Soporte Automatico__**')
        .setDescription('Bienvenido Al soporte Automatico. \n ¿Cual es Tu problema? \n\n-Problemas De inicio Sesión. \n\n-Problemas Para entrar a Una modalidad. \n\n-Postulacion a Staff \n\n-Rangos de Creador de Contenido. \n\n -Otros.')
        .setFooter('WinterCraft Network - Soporte')
        .setColor('ff8000')
    const auto2 = new Discord.MessageEmbed()
        .setTitle('**__Problemas Con iniciar Sesión__**')
        .setDescription('Problemas Frecuentes con Cuentas. \n\n-**Contraseña Olvidada.** \nDebes Enviar todas las pruebas que puedas de que la cuenta te pertenece, por ejemplo fotos jugando con ella, en caso de ser premium y no tener activado el modo de ingreso **premium**, debes mandar una foto de tu pestaña de inicio en **https://minecraft.net** \n\n-**Actividad No autorizada en tu Cuenta.**\n Si notas actividad que no realizaste tu dentro de tu cuenta, te recomendamos cambiar tu contraseña. utilizando\n **__/changepassword <tu contraseña> <nueva contraseña>__** Estas, son privadas y no debes compartirlas a tus amigos o a un staff. \n\n**-Problemas con el Modo Premium.**\n Si Perdiste acceso a tu cuenta Premium y tenias activado el modo de acceso **premium** Debes enviar fotos y/o videos Demostrando que eres el propietario de la cuenta. ')
        .setFooter('¿Solucionaste tu problema? , Reacciona con 📛 para que un staff cierre el ticket. en caso de que no, espera a que uno te atienda.')
        .setColor('ff8000')
    const auto3 = new Discord.MessageEmbed()
        .setTitle('**__Problemas para entrar a una modalidad__**')
        .setDescription('Problemas Frecuentes con modalidades. \n\n**Mantenimientos** \n Si al intentar entrar a una modalidad te aparece el siguiente mensaje en el chat, **__[Maintenance] The server is currently under maintenance! try again later__** Significa que la modalidad esta en mantenimiento ya sea para arreglar bugs, problemas internos o mantenimientos de rutina. se paciente hasta que la modalidad vuelva a estar online. \n\n**Version incorrecta** \n Hay modalidades que debes entrar con una version especifica, por ejemplo para el survival 1.16 y survivl 1.8 , En caso no estes usando la version correcta, se te mandara al AuthLobby y en unos segundos , devuelta al Lobby principal, Para poder entrar debes lanzar la version correspondiente con tu launcher **(para survival 1.16 , la 1.16 y para survival 1.8, la 1.8)**')
        .setFooter('¿Solucionaste tu problema? , Reacciona con 📛 para que un staff cierre el ticket. en caso de que no, espera a que uno te atienda.')
        .setColor('ff8000')
    const auto4 = new Discord.MessageEmbed()
        .setTitle('**__Postulaciones a Staff__**')
        .setDescription('Las postulaciones para ser miembro del staff de la Network estan disponibles durante poco tiempo. Y normalmente tienen una duracion de 2 semanas, y se anuncian en <#696746525837099069>, para recibir el formulario de postulacion, escribe **__!!postulacion__**')
        .setColor('ff8000')
    const auto5 = new Discord.MessageEmbed()
     .setTitle('**WinterCraft Network - Creador de Contenido**')
     .setDescription('¿Eres creador de contenido en la plataforma Youtube?, Aqui estan los requisitos para obtener un rango de colaboradoren nuestra network.')
     .addField("__**Mini YT**__",'No Necesitas subs solo Review del Servidor.', true)
     .addField("__**Youtuber**__",' 500 Subs como minimo + Review del Servidor con : 50 vistas y 10 likes.', true)
     .addField("__**Famoso**__",'1000 Subs como minimo + Review del Servidor con 150 vistas y 30 likes.', true)
     .setColor('ff8000')
     .setFooter('\n Todos los rangos correspondientes a creadores de contenido, se entregan previo cumplimiento de requisitos.')

     const surv = new Discord.MessageEmbed()
  .setTitle('**__Modalidad : Survival 1.8__**')
  .setDescription('**__Kit inicial__** - puedes reclamar el kit starter utilizando el comando /kit starter *Recuerda que solo puedes reclamar este kit una vez*.\n\n **__Random Teleport__** - Puedes hacer un teletransporte a un lugar al azar del mapa usando el comando */rtp*, puedes conseguir recursos , items e incluso encontrar a otros jugadores. \n\n **__Protecciones__** - Puedes Comprar protecciones usando el comando */warp protecciones*, Clickando al cartel correspondiente a la proteccion que deseas obtener **Cada una te pedira cierta cantidad de dinero para comprarla** \n\n **__Warps__** - En la modalidad existen diferentes warps para diferentes usos, desde warp pvp hasta warp comida. \n\n Puedes ver la lista de warp pulsando al ncp frente al spawn o escribiendo */warps* \n\n **__Eventos__** - Existen diferentes tipos de eventos especiales, desde la aparición de mounstros en el spawn hasta koths. Cada uno con una recompenza diferente. Algunos eventos y sus localizaciones que puedes encontrar son los siguientes.\n-Golem de Evento / Spawn \n-Envoys / Spawn /n-Eventos Drop / Spawn \n-Koths / *Usa el comando */koths* \n\n**__Consejos__** \n1-Haz tu casa o base lejos del spawn, este es lugar de aparicion para todos los jugadores y pueden encontrarte facilmente. \n2-Protege tus zonas usando una proteccion, las puedes encontrar en */warp protecciones* \n3-Juega en equipo,la diversion y probabilidad de no morir aumentan!')
  .setFooter('Wintercraft Network - Guía')
  .setColor('ff8000')
    
	if (user.bot) return;
	if (!msg_id) return;

	if (reaction.message.id == msg_id && reaction.emoji.name == '🎫') {
		crearTicket(reaction.message, user);
		reaction.message.reactions.removeAll();
		reaction.message.react('🎫');
	}
	if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '🏛️'
	) {
		reaction.message.channel.send(compra);
	}

	if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '🔰'
	) {
		reaction.message.channel.send(reporte);
	}

    if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '❄️'
	) {
		reaction.message.channel.send(auto1).then(msg => {
        	msg.react('1️⃣');
			msg.react('2️⃣');
			msg.react('3️⃣');
            msg.react('4️⃣');
            msg.react('5️⃣');
        })
    }
    if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '1️⃣'
	) {
		reaction.message.channel.send(auto2).then(msg => {
        	msg.react('📛');
        })
    }
    if (reaction.emoji.name == '🧡'
	) {
		reaction.message.channel.send(surv);
	}
    if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '2️⃣'
	) {
		reaction.message.channel.send(auto3).then(msg => {
        	msg.react('📛');
        })
    }
    if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '3️⃣'
	) {
		reaction.message.channel.send(auto4).then(msg => {
        	msg.react('📛');
        })
    } 
    if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '4️⃣'
	) {
		reaction.message.channel.send(auto5).then(msg => {
        	msg.react('📛');
        })
    } 
    if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '5️⃣'
	) {
		reaction.message.channel.send('Espera a que un staff te atienda :)').then(msg => {
        	msg.react('📛');
        })
    } 

	if (
		reaction.message.channel.name.startsWith('ticket-') &&
		reaction.emoji.name == '✅'
	) {
		reaction.message.channel.send(apelar);
	}

});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'rename' && message.channel.name.startsWith('ticket-')){
	 var canal = message.channel
	 let member = message.author	  
   let as = args.slice(0).join(' ');
	 const embed = new Discord.MessageEmbed()
	 .setTitle('Cambios en Ticket')
	 .setDescription(`se han hecho los siguientes cambios:\n\n**__Autor de la accion__**: ${message.author}. \n**__Cambio realizado__**: Renombre de ticket.\n**__Nuevo Valor__**: ticket-${args}.`)
	 .setColor('ff8000')
	 .setFooter('Wintercraft - Soporte')
	 message.channel.send(embed);
	 canal.setName(`ticket-${as}`)
 }
});


client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'cerrar' && message.channel.name.startsWith('ticket-')){
	 var canal = message.channel
	 let member = message.author	  
	 const embed = new Discord.MessageEmbed()
	 .setTitle('Cambios en Ticket')
	 .setDescription(`Cierre de ticket \n**__Autor de la Accion__**: ${message.autor}.\n**__Cambio realizado__**: Cierre de ticket.`)
	 .setColor('ff8000')
	 .setFooter('Wintercraft - Soporte')
	 message.channel.send(embed);
	 canal.setName(`ticket-cerrado-${canal.name}`)
	 canal.updateOverwrite(canal.guild.roles.everyone, { VIEW_CHANNEL: false });
 }
});


client.on('message', message => {
	if (message.author.bot) return;
	if (message.content.startsWith('!!ip')) {
		const embed = new Discord.MessageEmbed()
			.setTitle('**wintercraft Network**')
			.setDescription('Nuestra ip es \n **mc.wintercraft.es** \n \n ')
			.setColor('ff8000')
			.setThumbnail(
				'https://cdn.discordapp.com/icons/696741487739928645/a_02bc74e0e433c5bf0d88673562c1069e.gif?size=512'
			)
			.setFooter(
				`Comando !!ip`,
				message.author.displayAvatarURL()
			)
			.setTimestamp();
		message.channel.send(embed);
	}
});

client.on('message', message => {
	if (message.author.bot) return;
	if (message.content.startsWith('!!foro')) {
		const embed = new Discord.MessageEmbed()
			.setTitle('**wintercraft Network**')
			.setDescription('Nuestra ip es \n **https://wintercraft.es** ')
			.setColor('ff8000')
			.setThumbnail(
				'https://cdn.discordapp.com/icons/696741487739928645/a_02bc74e0e433c5bf0d88673562c1069e.gif?size=512'
			)
			.setFooter(
				`Comando !!Foro`,
				message.author.displayAvatarURL()
			)
			.setTimestamp();
		message.channel.send(embed);
	}
});

client.on('message', message => {
	if (message.author.bot) return;
	if (message.content.startsWith("ip")) {
		const embed = new Discord.MessageEmbed()
			.setTitle('**wintercraft Network**')
			.setDescription('Nuestra ip es \n **mc.wintercraft.es ** ')
			.setColor('ff8000')
			.setThumbnail(
				'https://cdn.discordapp.com/icons/696741487739928645/a_02bc74e0e433c5bf0d88673562c1069e.gif?size=512'
			)
			.setFooter(
				`Comando !!ip}`,
				message.author.displayAvatarURL()
			)
			.setTimestamp();
		message.channel.send(embed);
	}
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'redes') {
		let embe = new Discord.MessageEmbed()
			.setColor('ff8000')
			.setTitle('**Nuestras Redes!**')
			.setURL('')
			.setDescription('In dev')
			.setThumbnail('a')
			.setTimestamp()
			.setFooter(
				`Comando !!redes`,
				message.author.displayAvatarURL()
			);

		message.channel.send(embe);
	}
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'tienda') {
		let usuario = message.mentions.members.first();
		let embed = new Discord.MessageEmbed()
			.setColor('ff8000')
			.setTitle('**wintercraft Network**')
			.setDescription(`Nuestra Tienda es \n\ **https://tienda.wintercraft.es**`)
			.setThumbnail(
				'https://cdn.discordapp.com/icons/696741487739928645/a_02bc74e0e433c5bf0d88673562c1069e.gif?size=512'
			)
			.setTimestamp()
			.setFooter(
				`Comando !!tienda`,
				message.author.displayAvatarURL()
			);
		message.channel.send(embed);
	}
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'reglas') {
		let usuario = message.mentions.members.first();
		let embed = new Discord.MessageEmbed()
			.setColor('ff8000')
			.setTitle('**wintercraft Network**')
			.setDescription(`Las reglas son las Siguientes \n\ \n\ 1.- No Flood. \n\ 2.-No Spam. \n\ 3.-No mensajes / Imagenes con contenido sexualmente sugerente.\n\ 4.- Usar Adecuadamente los Canales. \n\ 5.- No usar comandos en canales no permitidos. \n\ 6.- Usar Adecuadamente el sistema de soporte por tickets. \n\ 7.- No Spamear Comandos. \n\ 8.- Evita el uso exagerado de emojis. \n\ 9.- Evita Tagear Rol.\n10.-Evita tagear Sin motivo. \n\ 11.- No menciones al staff si no es algo importante .\n\ 12.- No envies Links / invitaciones por Mensaje Directo (MD). \n\ 13.- No Envies Links externos. \n\ 14.- Evita el uso constante de Mayusculas. \n\ 15.- No pidas rangos. \n\ 16.- No Amenazes. \n\ 17.- No Anuncies Ventas. \n\ 18.- No Des informacion personal tuya o de alguien. \n\ 19.- No causes Polemica. \n\ 20.- No te hagas pasar por alguien mas. \n\ 22.-No faltes el respeto al staff / otros usuarios. \n\ 23.- No acoses. \n\ 24.- No uses Multicuentas. \n\ 25.- No Vendas Rangos. \n\ No publicites Tu canal de youtube / facebook / otros servidores. \n\  \n\ \n\ **El incumplimiento de cualquiera de estas reglas sera sancionado**  `)
			.setThumbnail(
				'https://cdn.discordapp.com/icons/696741487739928645/a_02bc74e0e433c5bf0d88673562c1069e.gif?size=512'
			)
			.setTimestamp()
			.setFooter(
				`comando !!reglas`,
				message.author.displayAvatarURL()
			);
		message.author.send(embed);
	}
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'reglas') {
		let usuario = message.mentions.members.first();
		let embed = new Discord.MessageEmbed()
			.setColor('ff8000')
			.setTitle('**wintercraft Network**')
			.setDescription(`Las Reglas fueron enviadas a tu Md`)
			.setThumbnail(
				'https://cdn.discordapp.com/icons/696741487739928645/a_02bc74e0e433c5bf0d88673562c1069e.gif?size=512'
			)
			.setTimestamp()
			.setFooter(
				`Comando !!reglas`,
				message.author.displayAvatarURL()
			);
		message.channel.send(embed);
	}
});





client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'informacion') {
		let usuario = message.mentions.members.first();
		let embed = new Discord.MessageEmbed()
			.setColor('ff8000')
			.setTitle('**__Informacion General__** \n\ ')
			.setDescription(`\n\ **Canales** \n\ Tenemos variedad canales para diferentes Cosas ,Puedes Hablar en \n\ <#772644472555044864>, Usa adecuadamente los canales de Multimedia ( envio de imagenes / videos) , comandos, musica , etc estos no son para charlar. \n\ \n\ **Salas de Voz/Musica** \n\ Los Canales de Voz o musica son ambientes en los que los usuarios pueden interactuar entre si , respetando las reglas , y expresandose de una manera etica , ¿Alguien te esta acosando, o faltando el respeto? , Reportalo usando el comando !reporte <tag> <Razon>. \n\ **Soporte** \n\ \n\ Si necesitas Soporte administrativo , Para solicitar un rango de creador de contenido , Problemas con compras o reportar algun Fallo o bug , dirigete al canal de Soporte Admin , si tu problema no esa definido en ese canal , dirigete a Soporte comun , el mal uso de esta herram
		8	ienta sera sancionada. \n\ \n\ **Equipo Staff** \n\ Estos son los encargados de mantener segura la comunidad , Brindar soporte y ayuda a los usuarios que lo necesiten y sancionar a usuarios que rompan reglas , ¿Alguno no cumple bien su función? , Reportalo !reporte <tag> <razon>. \n\ \n\ **Reportes** \n\ Los medios para reportar a un usuario , ya sea por el uso de trampas , incumplimiento de normas , Toxicidad , Spam , o algun otro motivo , debes digirte al canal de Soporte comun , comunicarte con un staff mediante MD o simplemente usar el comando !reporte <tag> <razon> (ten encuenta que para el uso del comando reporte , todas las pruebas , ya sean capturas de pantalla , videos , etc , deben ser mediante links. \n\ \n\ **Compras de rango** \n\ Si quieres apoyarnos ,a seguir mejorando la comunidad , puedes contribuir en nuestra tienda ( usa el comando !tienda ) , recibiras rangos , articulos , roles , etc ,deacuerdo a tu importe . **Recuerda** No comprar rangos a usuarios , Ya que existe la posibilidad de salir estafado. Si tienes alguna duda o problema sobre este tema , dirigete a Soporte Admin.`)
			.setTimestamp()
			.setFooter(
				`Comando !!informacion`,
				message.author.displayAvatarURL()
			);
		message.channel.send(embed);
	}
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'decir') {
		let texto = args.join(' ');
		if (!texto)
			return message.channel
				.send('**Debes poner algo para repetir**')
				.then(msg => msg.delete({ timeout: 5000 }));
		const embed = new Discord.MessageEmbed()
			.setTitle('**Repitiendo Mensaje**')
			.setDescription(texto)
			.setColor('ff8000')
			.setFooter(
				`pedido por ${message.author.username}`,
				message.author.displayAvatarURL()
			)
			.setTimestamp();
		message.channel.send(embed);
		message.delete().catch();
	}
});




client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command === '8ball') {
		var rpts = [
			'Definitivamente Si',
			'Definitivamente No',
			'No estoy Seguro',
			'No lo se',
			'Podria ser',
			'De Ninguna Manera',
			'Probablemente si',
			'Probablemente no',
			'Tal vez',
			'Puedes Apostar a que siguientes'
		];
		let pregunt = args.slice(1).join(' ');
		if (!pregunt) return message.channel.send('Falta la pregunta.');

		const embed = new Discord.MessageEmbed()
			.setTitle('wintercraft 8Ball')
			.setThumbnail(message.author.avatarURL)
			.setColor('ff8000')
			.addField('Su pregunta es:', args, true)
			.addField(
				'Mi respuesta es:',
				rpts[Math.floor(Math.random() * rpts.length)],
				true
			)
			.setFooter(
				`Comando !!8ball`,
				message.author.displayAvatarURL()
			)
			.setTimestamp();
		message.channel.send(embed);
	}
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'autorol') {
    if(!message.member.hasPermission("ADMINISTRATOR") )return message.reply('No tienes permisos ');
		let texto = args.join(' ');
		if (!texto)
			return message.channel
				.send('**Debes Ingresar Algo para Repetir**')
				.then(msg => msg.delete({ timeout: 5000 }));
		const embed = new Discord.MessageEmbed()
			.setTitle('**Nuevo Auto-Rol**')
			.setDescription(texto)
			.setColor('ff8000')
			.setFooter(
				`pedido por ${message.author.username}`,
				message.author.displayAvatarURL()
			)
			.setTimestamp();
		message.channel.send(embed);
		message.delete().catch();
	}
});


client.on('guildMemberRemove', async member => {
	const canal = member.guild.channels.cache.find(
		c => c.id === '770353105270996992'
	);
	if (!canal) return;
	const embed = new MessageEmbed()
		.setAuthor(
			member.user.username,
			member.user.displayAvatarURL({ format: 'png', dynamic: true })
		)
		.setDescription(`**${member.user.username} Salio del servidor**`)
		.setThumbnail(
			member.user.displayAvatarURL({ format: 'png', dynamic: true })
		)
		.setThumbnail(
			member.user.displayAvatarURL({ format: 'png', dynamic: true })
		)
		.setColor('RED')
		.setTimestamp()
		.setFooter(member.guild.name);
	canal.send(embed);
}
);

  client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'serverinfo') {
var server = message.guild;
const embed = new Discord.MessageEmbed()
.setThumbnail(server.iconURL)
.setAuthor(server.name, server.iconRL)
.addField('**ID de servidor**', server.id, true)
.addField('**Region**', server.region, true)
.addField('Creado el', server.joinedAt.toDateString(), true)
.addField('Dueño del Servidor', server.owner.user.tag, true)
.addField('**Miembros**', server.memberCount, true)
.addField('**Numero de Roles**', server.roles.size, true)
.setColor('ff8000')
.setFooter(
`Hecho por ${message.author.username}`,	message.author.displayAvatarURL()	)
.setTimestamp();
message.channel.send(embed);
}
});
    

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if (command === "kick") { 
	let user = message.mentions.users.first(); 
	if (!user) return message.channel.send('Debes mencionar a alguien....')
		
        let razon = args.slice(1).join(' ');

        var perms = message.member.hasPermission("KICK_MEMBERS"); 
        if(!perms) return message.channel.send("Alguien quiere un warn....");

        if (!razon) return message.channel.send('Razon no especificada'); 
        if (!message.guild.member(user).kickable) return message.reply(' Usuario no puede ser expulsado'); 
     
        message.guild.member(user).kick(razon); 
        message.channel.send(`:white_check_mark: | Usuario Kickeado: ${user.username} | Por : ${razon}.`); 
}
});


client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
    if (command === "sugerencia") {

        let tema = args[0];

        let sugerencia = args.slice(0).join(' ');
        let canal = client.channels.cache.get('742989519481077821');
        if (!tema) return message.channel.send('¿Cual es la sugerencia?')

      const sugerenciaa = new MessageEmbed()

        .setAuthor(`Autor: ${message.author.tag}`, message.author.displayAvatarURL())

        .setDescription(`${sugerencia} \n\ \n\ ¿Estas deacuerdo con esta sugerencia? **Vota!**`)
        .setColor("ff8000")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter("wintercraft Network -Sugerencia ")
        message.reply("sugerencia enviada con exito!").then(msg => msg.delete({timeout: 5000}));


        canal.send(sugerenciaa).then(m => {
            m.react('✅')
            m.react('❎')
         })

         message.delete()
    }
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
    if (command === "strikestaff") {
      if(!message.member.hasPermission("ADMINISTRATOR") )return message.reply('No tienes permisos ');

        let tema = args[0];

        let strike = args.slice(1).join(' ');
	      let usuario = message.mentions.members.first();
        let canal = client.channels.cache.get('771136565300297738');


        const strikea = new MessageEmbed()

        .setAuthor(`Staff: ${message.author.tag} `, message.author.displayAvatarURL())
        .setDescription(` **Strike ** \n\ **Staff Sancionado ------------------->** \n\ **Razon :**  ${strike}  \n\  \n\ ¿Estas deacuerdo con esta decision?`)
        .setColor("RED")
        .setThumbnail(usuario.user.displayAvatarURL())
        
        .setFooter("wintercraft Network - Strike ");


        message.reply("strike enviado con exito! ").then(msg => msg.delete({timeout: 5000}));


        canal.send(strikea).then(m => {
            m.react('✅')
            m.react('❎')
         })

         message.delete()
    }
});


client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
    if (command === "anuncio") {
      if(!message.member.hasPermission("MANAGE_MESSAGES") )return message.reply('No tienes permisos ');

        let tema = args[0];

        let anuncio = args.slice(0).join(' ');
	      let usuario = message.mentions.members.first();
        let canal = client.channels.cache.get('390646327882547201');


        const anuncioa = new MessageEmbed()

        .setAuthor(`Autor: ${message.author.tag} `, message.author.displayAvatarURL())
        .setDescription(` ** Nuevo Anuncio** \n\  ${anuncio} `)
        .setColor("ff8000")
        .setThumbnail(client.user.displayAvatarURL())
        
        .setFooter("wintercraft Network - Anuncio ");


        message.reply("anuncio enviado con exito! ").then(msg => msg.delete({timeout: 5000}));


        canal.send(anuncioa).then(m => {
            m.react('✅')
         })

         message.delete()
    }
});


client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if (command == "kiss") {

let gifs = ["https://media.giphy.com/media/bGm9FuBCGg4SY/giphy.gif", "https://media.giphy.com/media/nyGFcsP0kAobm/giphy.gif", "https://media.giphy.com/media/MQVpBqASxSlFu/giphy.gif","https://media.giphy.com/media/sS7Jac8n7L3Ve/giphy.gif"]
 var enlace = gifs[Math.floor(Math.random() * gifs.length)]
        const tag = message.mentions.users.first();
    if (!tag) return message.reply("Mencione que quieres besar"); 
     
    const embed = new Discord.MessageEmbed()


      .setDescription( "**" +
              message.author.username +
              "** le dio un beso a **" +
              tag.username +
              "**" )

      .setColor("ff8000")
    .setImage(enlace)
      
    message.channel.send({ embed });
  }
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if (command == "punch") {

let gifs = ["https://media.giphy.com/media/iWEIxgPiAq58c/giphy.gif","https://media.giphy.com/media/vxXLJxa2gDaord2eib/giphy.gif","https://media.giphy.com/media/oOF9ZfLJgkoUg/giphy.gif", "https://media.giphy.com/media/YrfARBZkReL8Q/giphy.gif", "https://media.giphy.com/media/oxbNORcXx76F2/giphy.gif","https://media.giphy.com/media/DuVRadBbaX6A8/giphy.gif","https://media.giphy.com/media/6EBqHQ3asZ2rm/giphy.gif"]
 var enlace = gifs[Math.floor(Math.random() * gifs.length)]
    const tag = message.mentions.users.first();
    if (!tag) return message.reply("Mencione que quieres golpear"); 
     
    const embed = new Discord.MessageEmbed()


      .setDescription( "**" +
              message.author.username +
              "** golpeo a **" +
              tag.username +
              "**" )

      .setColor("ff8000")
    .setImage(enlace)
      
    message.channel.send({ embed });
  }
});


client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if (command == "hug") {

let gifs = ["https://media.giphy.com/media/du8yT5dStTeMg/giphy.gif", "https://media.giphy.com/media/IRUb7GTCaPU8E/giphy.gif", "https://media.giphy.com/media/wnsgren9NtITS/giphy.gif","https://media.giphy.com/media/143v0Z4767T15e/giphy.gif","https://media.giphy.com/media/QFPoctlgZ5s0E/giphy.gif","https://media.giphy.com/media/svXXBgduBsJ1u/giphy.gif", "https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif", ""]
 var enlace = gifs[Math.floor(Math.random() * gifs.length)]
    const tag = message.mentions.users.first();
    if (!tag) return message.reply("Mencione que quieres abrazar"); 
     
    const embed = new Discord.MessageEmbed()


      .setDescription( "**" +
              message.author.username +
              "** le dio un abrazo a **" +
              tag.username +
              "**" )

      .setColor("ff8000")
    .setImage(enlace)
      
    message.channel.send({ embed });
  }
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
    if (command === "reporte") {
      if(!message.member.hasPermission("SEND_MESSAGES") )return message.reply('No tienes permisos ');

        let tema = args[0];

        let reporte = args.slice(0).join(' ');
	      let usuario = message.mentions.members.first();
        let canal = client.channels.cache.get('751194413593657384');


        const reportea = new MessageEmbed()

        .setAuthor(`Autor: ${message.author.tag} `, message.author.displayAvatarURL())
        .setDescription(` ** Nuevo reporte** \n\  ${reporte} `)
        .setColor("ff8000")
        
        .setFooter("wintercraft Network - Reporte");
        message.author.send(`**Tu reporte fue :  \n\  **${reporte} `)
        canal.send(reportea).then(m => {
          
         })

         message.delete()
    }
});

client.on("guildMemberAdd", (member) => {
  const welcome = new MessageEmbed()

  .setTitle(`${member.guild.name}`)
  .setDescription(`Hola ${member.user}, Bienvenido al Servidor de discord de wintercraft Network\n Por favor lee estas reglas. `)
  .setColor("GREEN")
  .setFooter("wintercraft Network | Bienvenida", client.user.avatarURL())
  .setThumbnail(client.user.displayAvatarURL());
  let embed1 = new Discord.MessageEmbed()
			.setColor('ff8000')
			.setTitle('**wintercraft Network**')
			.setDescription(`Las reglas son las Siguientes \n\ \n\ 1.- No Flood. \n\ 2.-No Spam. \n\ 3.-No mensajes / Imagenes con contenido sexualmente sugerente.\n\ 4.- Usar Adecuadamente los Canales. \n\ 5.- No usar comandos en canales no permitidos. \n\ 6.- Usar Adecuadamente el sistema de soporte por tickets. \n\ 7.- No Spamear Comandos. \n\ 8.- Evita el uso exagerado de emojis. \n\ 9.- Evita Tagear Rol.\n10.-Evita tagear Sin motivo. \n\ 11.- No menciones al staff si no es algo importante .\n\ 12.- No envies Links / invitaciones por Mensaje Directo (MD). \n\ 13.- No Envies Links externos. \n\ 14.- Evita el uso constante de Mayusculas. \n\ 15.- No pidas rangos. \n\ 16.- No Amenazes. \n\ 17.- No Anuncies Ventas. \n\ 18.- No Des informacion personal tuya o de alguien. \n\ 19.- No causes Polemica. \n\ 20.- No te hagas pasar por alguien mas. \n\ 22.-No faltes el respeto al staff / otros usuarios. \n\ 23.- No acoses. \n\ 24.- No uses Multicuentas. \n\ 25.- No Vendas Rangos. \n\ No publicites Tu canal de youtube / facebook / otros servidores. \n\  \n\ \n\ **El incumplimiento de cualquiera de estas reglas sera sancionado**  `)
			.setThumbnail(
				'https://cdn.discordapp.com/icons/696741487739928645/a_02bc74e0e433c5bf0d88673562c1069e.gif?size=512'
			)

 member.send(welcome)
 member.send(embed1);
});



client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'mutear') {

 message.delete() 
 let user = message.mentions.members.first() 
 let razon = args.slice(1).join(" ") || "Razon no definida" 
 let permiso = message.member.hasPermission("MANAGE_MESSAGES")
 let canal1 = client.channels.cache.get('738879288756928614'); 


 if(!permiso){ 
    const NoPermiso = new Discord.MessageEmbed()
        .setDescription("No Tienes permisos")
        .setColor("ff8000")
        message.channel.send(NoPermiso)
        return NoPermiso
     }


 if(!user){ 
    const Notag = new Discord.MessageEmbed()
        .setDescription("Debes mencionar a alguien para mutear")
        .setColor("Gff8000")
        message.channel.send(Notag)
        return Notag
     }


 if(user === message.author){ 
    const Auto = new Discord.MessageEmbed()
        .setDescription("No puedes Auto-Mutearte")
        .setColor("Gff8000")
        message.channel.send(Auto)
        return Auto 

    }

if(user.roles.highest.comparePositionTo(message.member.roles.highest) >= 0){ 
    const MayorRol = new Discord.MessageEmbed()
        .setDescription("El usuario a mutear tiene un rango mayor o igual al tuyo")
        .setColor("ff8000")
        message.channel.send(MayorRol)
        return MayorRol 
     }

 user.roles.add("696929186069217362").catch(e => message.reply("Ocurrió un **error**")) 

 const Muted = new Discord.MessageEmbed() 
    .setTitle(`**Sancion | Muteo Permanente **`)
    .addField('**__Usuario__**',  `\n\ ${user}`, true)
    .addField('**__Staff__**',  `\n\ ${message.author}`, true)
    .addField('**__Razon__**',  `\n\ ${razon}`, true)
    .setColor("ff8000")
    message.channel.send(Muted) 
    canal1.send(Muted)
 }

});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'desmutear') {

 message.delete() 
 let member = message.mentions.members.first() 
 let razon = args.slice(1).join(" ") || "No definida" 
 let canal = client.channels.cache.get('738879288756928614');
 let permisos = message.member.hasPermission("MANAGE_MESSAGES") 


 if(!permisos){ 
    const NoPermiso1 = new Discord.MessageEmbed()
        .setDescription("No Tienes permisos")
        .setColor("ff8000")
        message.channel.send(NoPermisos)
        return NoPermisos
     }


 if(!member){ 
    const Notag1 = new Discord.MessageEmbed()
        .setDescription("Debes mencionar a alguien para desmutear")
        .setColor("ff8000")
        message.channel.send(Notag1)
        return Notag1
     }


 if(member === message.author){ 
    const Auto1 = new Discord.MessageEmbed()
        .setDescription("No puedes Auto-desmutearte")
        .setColor("ff8000")
        message.channel.send(Auto1)
        return Auto1
    }

if(member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0){ 
    const Rolmas = new Discord.MessageEmbed()
        .setDescription("El usuario a desmutear tiene un rango mayor o igual al tuyo")
        .setColor("ff8000")
        message.channel.send(Rolmas)
        return Rolmas
     }

 member.roles.remove("696929186069217362").catch(e => message.reply("Ocurrió un **error**")) 

 const Muted1 = new Discord.MessageEmbed() 
    .setTitle(`**Sancion | Desmuteo **`)
    .addField('**__Usuario__**',  `\n\ ${member}`, true)
    .addField('**__Staff__**',  `\n\ ${message.author}`, true)
    .setColor("ff8000")
    message.channel.send(Muted1)
    canal.send(Muted1)
 }

});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
    if (command == 'say') {
         if(!message.member.hasPermission("ADMINISTRATOR") )return message.reply('No tienes permisos ');
        const channel = message.mentions.channels.first()
        let sendch = message.guild.channels.cache.find(channel => channel.name === `${channel}`)
        let as = args.slice(1).join(' ');
        if (!channel) return message.channel.send('¿En que canal debo decir esto? , El uso correcto es : !say <#canal> <Mensaje>')
        if (!as) return message.channel.send('¿Que debo decir?, El uso correcto es : !say <#canal> <Mensaje>');
        channel.send(as);
        message.delete()
    }
});
client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
    if (command == 'repeat') {
        const channel = message.mentions.channels.first() || message.channel
        let sendch = message.guild.channels.cache.find(channel => channel.name === `${channel}`)
        let as = args.slice(0).join(' ');
        if (!channel) return message.channel.send('¿En que canal debo decir esto? , El uso correcto es : !say <#canal> <Mensaje>')
        if (!as) return message.channel.send('¿Que debo decir?, El uso correcto es : !say <#canal> <Mensaje>');
        channel.send(as);
        message.delete()
    }
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if (command == "blush") {

let thumb = ["https://media.giphy.com/media/klmpEcFgXzrYQ/giphy.gif","https://media.giphy.com/media/6CBGoJnEBbEWs/giphy.gif","https://media.giphy.com/media/1gbQIeNzZxcSk/giphy.gif","https://media.giphy.com/media/UxR7XvbAFqS6Q/giphy.gif"]
 var enlace = thumb[Math.floor(Math.random() * thumb.length)]
        const userm = message.mentions.users.first();
     
    const embed = new Discord.MessageEmbed()


      .setDescription( "**" +
              message.author.username +
              "** esta sonrojad@")

      .setColor("ff8000")
    .setImage(enlace)
      
    message.channel.send({ embed });
  }
}); 
client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if (command == "think") {

let thumb = ["https://media.giphy.com/media/ztpMY1t5VYWlO/giphy.gif","https://media.giphy.com/media/Id0IZ49MNMzKHI9qpV/giphy.gif","https://media.giphy.com/media/kQ3FSVoJrkYWk/giphy.gif", "https://media.giphy.com/media/13Z5kstwARnPna/giphy.gif", "https://media.giphy.com/media/rFYJI0RDXASxW/giphy.gif", "https://media.giphy.com/media/123t0dxx3bQdCE/giphy.gif"]
 var enlace = thumb[Math.floor(Math.random() * thumb.length)]
        const userm = message.mentions.users.first();
     
    const embed = new Discord.MessageEmbed()


      .setDescription( "**" +
              message.author.username +
              "** esta pensando")

      .setColor("ff8000")
    .setImage(enlace)
      
    message.channel.send({ embed });
  }
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if (command === "banear") { 
        let member = message.mentions.members.first() 
        let permsBot = message.guild.me.hasPermission("BAN_MEMBERS") 
          
        let perms = message.member.hasPermission("BAN_MEMBERS") 
        if (!perms) return message.channel.send("¿Quieres un Warn?")

        let persona = message.mentions.members.first() 
        if(!persona) return message.channel.send('¿A Quien debo Banear?') 
		
        if(member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0){
            return message.channel.send("El usuario tiene un rol mas alto o igual al tuyo")
        } return;
        
        var razon = args.slice(1).join(' ') 
        if(!razon) {
          razon = `Razon no especificada` 
        }
				
        razon = razon+`, Sancionado por ${message.author.tag}`
            
        member.ban(razon).catch(e => message.reply("Error")) 
        message.channel.send(` ${persona.user.tag} Fue Baneado exitosamente!`) 
	}
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if(command === 'among') { 

const mencionado = message.mentions.members.first() 

let random = [
"No era el impostor","No era el impostor","era el impostor","no era el impostor","no era el impostor","no era el impostor"
] 


if(!mencionado)

 return message.channel.send(`. 　　　。　　　　•　 　ﾟ　　。 　　.

　　　.　　　 　　.　　　　　。　　 。　. 　

.　　 。　　　　　 ඞ 。 . 　　 • 　　　　•

　　ﾟ　　 ${message.author.username} ${random[Math.floor(Math.random() * random.length)]} 　 。　
　　'　　　1 Impostores restantes 　 　　。

　　ﾟ　　　.　　　. ,　　　　.　 .`) 

message.channel.send(`. 　　　。　　　　•　 　ﾟ　　。 　　.

　　　.　　　 　　.　　　　　。　　 。　. 　

.　　 。　　　　　 ඞ 。 . 　　 • 　　　　•

　　ﾟ　　 ${mencionado.user.username} ${random[Math.floor(Math.random() * random.length)]} 　 。　.
　　'　　　 1 Impostores restantes 　 　　。

　　ﾟ　　　.　　　. ,　　　　.　 .`)
message.delete()
}
});

client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.cache.find(
		c => c.id === '696741488360685610'
	);
    if (!channel) return;
 
   let data = await canva.welcome(member, { link: "https://cdn.discordapp.com/attachments/770359057588420628/775085795035578399/maxresdefault.jpg" })
 
    const attachment = new Discord.MessageAttachment(
      data,
      "welcome-image.png"
    );
 
    channel.send(
      `${member.user.tag} Bienvenido al servidor oficial de wintercraft network, recuerda usar el comando !!reglas para estar informado acerca de ellas.`,
      attachment
    );   
});
client.snipes = new Map();
client.on("messageDelete", (message) => {

client.snipes.set(message.channel.id, {
      content: message.content,
      delete: message.author,
      canal: message.channel
    });
client.on("message", (message) => {

 if(message.author.bot || !message.content.startsWith(prefix)) return;
});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if(command === "snipe"){

 const channel = message.mentions.channels.first() || message.channel;


const msg = client.snipes.get(channel.id);

if (!msg){
message.channel.send("No hay ningun mensaje borrado reciente")
 .then(m => m.delete({timeout: 1000}));
}else{
 const embed = new MessageEmbed()
 .setColor("ff8000")
 .setAuthor(`Autor del mensaje: ${msg.delete.tag}`)
 .setDescription(`Contenido del mensaje borrado : \n\ ${msg.content}`)  
 message.channel.send(embed);
 return}
 }
 });
});


client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if(command === "ayuda"){
let user = message.guild.roles.cache.find((r) => r.name === "👤 | Usuario");
  const staff = message.guild.roles.cache.find((r) => r.name === "📌 | Staff");

                
  if (message.member.roles.cache.has(user.id)) {

    let ayudadefault = new Discord.MessageEmbed()
    .setTitle('**wintercraft Network - Comandos**')
    .setDescription('Ayuda de comandos | Usuario')
    .addField('**__Diversion__**', "kiss, hug, Punch, blush, think, repeat, troleo  ", true)
    .addField('**__Soporte__**', "ayuda, sugerencia", true)
    .addField('**__Interaccion__**', "decir, 8ball, snipe, among", true)
    .addField('**__Informacion__**', "ip, redes, tienda, reglas, informacion, serverinfo", true)
    .setColor("ff8000")
      message.channel.send(ayudadefault); return
      
} else {

                    
    if (message.member.roles.cache.has(staff.id)) {
    let ayudastaff = new Discord.MessageEmbed()
    .setTitle('**wintercraft Network - Comandos**')
    .setDescription('Ayuda de Comandos | Staff ')
    .addField('**__Diversion__**', "kiss, hug, Punch, blush, think, repeat, troleo ", true)
    .addField('**__Soporte__**', "ayuda, sugerencia, reporte, ticket", true)
    .addField('**__Interaccion__**', "decir, 8ball, snipe, among, snipe", true)
    .addField('**__Informacion__**', "ip, foro, redes, tienda, reglas, postulacion, informacion, serverinfo", true)
    .addField('**__Sanciones__**', "mute, desmute, ban kick,strikestaff", true)
    .addField('**__especial__**', "anuncio, snipe, autorol", true)
    .addField('**__Otros__**', "msg",true)
    .setColor("ff8000")
      message.channel.send(ayudastaff);

      
    }
  } 

}});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
if(command === "lenguaje"){
let esp = message.guild.roles.cache.find((r) => r.name === "español");
  const ing = message.guild.roles.cache.find((r) => r.name === "ingles");

                
  if (message.member.roles.cache.has(esp.id)) {

    let pruebaesp = new Discord.MessageEmbed()
    .setTitle('**Andrés Gei en español**')
    .setColor("ff8000")
      message.channel.send(pruebaesp); return
      
} else {

                    
    if (message.member.roles.cache.has(ing.id)) {
    let pruebaing = new Discord.MessageEmbed()
    .setTitle('**Andrés is gei but In english**')
    .setColor("ff8000")
      message.channel.send(pruebaing);

      
    }
  } 

}});
 
 client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'lenguaje') {
		let usuario = message.mentions.members.first();
	
		let embed = new Discord.MessageEmbed()
			.setColor('ff8000')
			.setTitle('**wintercraft Network**')
			.setDescription(`**Por Favor seleccióna un idioma**`)
			.setThumbnail(
				'https://cdn.discordapp.com/icons/696741487739928645/a_02bc74e0e433c5bf0d88673562c1069e.gif?size=512'
			)
			.setTimestamp()
			.setFooter(
				`pedido por ${message.author.username}`,
				message.author.displayAvatarURL()
			);
		message.channel.send(embed);
	}
});

client.on("message", message => {
    const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.author.bot) return;
if (message.content.startsWith("!!msg")){
let permisos = message.member.hasPermission("ADMINISTRATOR")
if(!permisos) return message.reply("No tienes permisos") 
    const mencionado = message.mentions.users.first();
    if(!mencionado) return message.reply('¿ A quien debo mandar el mensaje? ');
    let id = mencionado.id;
  let texto = args.slice(1).join(' ');
if(!texto) return message.channel.send(`¿Que debo decir? .`);
mencionado.send(texto) 
message.delete()
}})

client.on("message", message => {
    const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.author.bot) return;
if (message.content.startsWith("!!troleo")){
 const troleo = new Discord.MessageEmbed()
 .setImage('https://media1.tenor.com/images/f79b3609264224ccb1e33ecaf4600fd6/tenor.gif?itemid=19001392')
 .setColor('ff8000');
 message.channel.send(troleo);
 message.delete();
}});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'youtuber') {
 const embed = new Discord.MessageEmbed()
 .setTitle('**WinterCraft Network - Creador de Contenido**')
 .setDescription('¿Eres creador de contenido en la plataforma Youtube?, Aqui estan los requisitos para obtener un rango de colaboradoren nuestra network.')
 .addField("__**Mini YT**__",'No Necesitas subs solo Review del Servidor.', true)
 .addField("__**Youtuber**__",' 500 Subs como minimo + Review del Servidor con : 50 vistas y 10 likes.', true)
 .addField("__**Famoso**__",'1000 Subs como minimo + Review del Servidor con 150 vistas y 30 likes.', true)
 .setColor('ff8000')
 .setFooter('\n Todos los rangos correspondientes a creadores de contenido, se entregan previo cumplimiento de requisitos.')
message.channel.send(embed)
message.delete();
}});

client.on('message', message => {
	let prefix = '!!';
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	if (command == 'postulacion') {
const postulacion = new Discord.MessageEmbed()
.setTitle('**__Formulario de Postulacion - Wintercraft Network__**')
.addField(
'Para Ir Al Enlace de postulacion Da Click : ',
'[Aqui](https://forms.gle/1kDSSxrwn4WqLQ5n7)',
	true
)
.setColor('ff8000')
message.delete();
message.channel.send(postulacion)
}});




 client.login(process.env.TOKEN); 