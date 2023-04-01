import { CacheType, ChatInputCommandInteraction, Collection } from "discord.js";

import { Command } from "~/types";

import ping from "~/commands/ping";
import display from "~/commands/display";

export let commands = new Collection<string, Command>();

// * register your commands here
addCommands([ping, display]);

export async function handleCommand(i: ChatInputCommandInteraction<CacheType>) {
  const command = commands.get(i.commandName);

  if (!command) {
    console.error(`No command matching ${i.commandName} was found.`);
    return;
  }

  try {
    await command.handler(i);
  } catch (error) {
    console.error(error);

    if (i.replied || i.deferred) {
      await i.followUp({
        content: "There was an error while executing this command",
        ephemeral: true,
      });
    } else {
      await i.reply({
        content: "There was an error while executing this command",
        ephemeral: true,
      });
    }
  }
}

function addCommand(com: Command) {
  commands.set(com.command.name!, com);
}

function addCommands(coms: Command[]) {
  for (let com of coms) {
    addCommand(com);
  }
}
