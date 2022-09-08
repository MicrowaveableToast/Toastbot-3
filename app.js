const Discord = require("discord.js");
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});
const settings = {
    prefix: 't/',
    
};

const { Player } = require("@jadestudios/discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: false, // This options are optional.
});
// You can define the Player as *client.player* to easily access it.
client.player = player;

client.on("ready", () => {
    console.log("I am ready to Play with DMP ??");
});
const { RepeatMode } = require('@jadestudios/discord-music-player');

client.on('messageCreate', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    
    client.play
        // Emitted when channel was empty.
        .on('channelEmpty', (queue) => {
            console.log(`Everyone left the Voice Channel, queue ended.`),
                message.channel.send(`Everyone left the Voice Channel, queue ended.`)
        })
        // Emitted when a song was added to the queue.
        .on('songAdd', (queue, song) => {
            console.log(`Song ${song} was added to the queue.`),
                message.channel.send(`Song ${song} was added to the queue.`)
        })
        // Emitted when a playlist was added to the queue.
        .on('playlistAdd', (queue, playlist) => {
            console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`),
                message.channel.send(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`)
        })
        // Emitted when there was no more music to play.
        .on('queueDestroyed', (queue) => {
            console.log(`The queue was destroyed.`),
                message.channel.send(`The queue was destroyed.`)
        })
        // Emitted when the queue was destroyed (either by ending or stopping).    
        .on('queueEnd', (queue) => {
            message.channel.send(`The queue has ended.`),
                console.log(`The queue has ended.`)
        })
        // Emitted when a song changed.
        .on('songChanged', (queue, newSong, oldSong) => {
            console.log(`${newSong} is now playing.`),
                message.channel.send(`${newSong} is now playing.`)
        })
        // Emitted when a first song in the queue started playing.
        .on('songFirst', (queue, song) => {
            console.log(`Started playing ${song}.`),
                message.channel.send(`Started playing ${song}.`)
        })
        // Emitted when someone disconnected the bot from the channel.
        .on('clientDisconnect', (queue) => {
            console.log(`I was kicked from the Voice Channel, queue ended.`),
                message.channel.send(`I was kicked from the Voice Channel, queue ended.`)
        })
        // Emitted when deafenOnJoin is true and the bot was undeafened
        .on('clientUndeafen', (queue) => {
            console.log(`I got undefeanded.`),
                message.channel.send(`I got undefeanded.`)
        })
        // Emitted when there was an error in runtime
        .on('error', (error, queue) => {
            console.log(`Error: ${error} in ${queue.guild.name}`)
            message.channel.send(`Error: ${error} in ${queue.guild.name}`);
        });

    let guildQueue = client.player.getQueue(message.guild.id);
    if (command === 'play' || 'p') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' ')).catch(_ => {
            if (!guildQueue)
                queue.stop();
        });
    }

    if (command === 'playlist' || 'pl') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(_ => {
            if (!guildQueue)
                queue.stop();
        });
    }

    if (command === 'skip') {
        guildQueue.skip();
    }

    if (command === 'stop') {
        guildQueue.stop();
    }

    if (command === 'noloop') {
        guildQueue.setRepeatMode(RepeatMode.DISABLED);
    }

    if (command === 'loop') {
        guildQueue.setRepeatMode(RepeatMode.SONG);
    }

    if (command === 'loopqueue') {
        guildQueue.setRepeatMode(RepeatMode.QUEUE);
    }

    if (command === 'volume') {
        guildQueue.setVolume(parseInt(args[0]));
    }

    if (command === 'seek') {
        guildQueue.seek(parseInt(args[0]) * 1000);
    }

    if (command === 'clearqueue') {
        guildQueue.clearQueue();
    }

    if (command === 'shufflequeue') {
        guildQueue.shuffle();
    }

    if (command === 'queue') {
        message.channel.send(guildQueue);
    }

    if (command === 'getVolume') {
        message.channel.send(guildQueue.volume)
    }

    if (command === 'nowplaying || np') {
        message.channel.send(`Now playing: ${guildQueue.nowPlaying}`);
    }

    if (command === 'pause') {
        guildQueue.setPaused(true);
    }

    if (command === 'resume') {
        guildQueue.setPaused(false);
    }

    if (command === 'remove') {
        guildQueue.remove(parseInt(args[0]));
    }

    if (command === 'createprogressbar') {
        const ProgressBar = guildQueue.createProgressBar();

        // [======>              ][00:35/2:20]
        message.channel.send(ProgressBar.prettier);
    }
    if (command === 'help') {
        message.channel.send('play/p: plays song/ adds it to queue, playlist/pl: plays selected playlist, skip: skips current song, stop: stops music and disconnects bot, loop/noloop: loops and unloops current song, queue: shows current queue, loopqueue: toggles if the queue if looped, clearqueue: clears queue, shufflequeue: shuffles queue, volume: changes current volume (1-100), getvolume: shows current volume, nowplaying/np shows what song is currently playing, pause: pauses all music, resume: resumes paused music, remove: removes the selected song from queue (1-99), createprogressbar/pb: shows current songs progress     ')



    }
    });

client.login(process.env.TOKEN); 

