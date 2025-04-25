import discord
from discord.ext import commands
import os

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Connecté en tant que {bot.user}')

@bot.command()
async def ping(ctx):
    latency = round(bot.latency * 1000)  # Latence en ms
    await ctx.send(f'Latence : {latency} ms')

@bot.command()
async def hello(ctx):
    await ctx.send(f'Hello {ctx.author.mention}!')

@bot.command()
@commands.has_permissions(manage_messages=True)
async def clear(ctx, amount: int = 5):
    """Supprime un nombre de messages du salon (par défaut 5)."""
    deleted = await ctx.channel.purge(limit=amount+1)
    await ctx.send(f"🧹 {len(deleted)-1} messages supprimés !", delete_after=3)

@bot.command(name="helpme")
async def helpme(ctx):
    embed = discord.Embed(title="📜 Commandes disponibles", color=discord.Color.blurple())
    embed.add_field(name="!ping", value="Affiche la latence du bot", inline=False)
    embed.add_field(name="!hello", value="Salue l'utilisateur", inline=False)
    embed.add_field(name="!clear [nombre]", value="Supprime un nombre de messages (par défaut 5, nécessite la permission)", inline=False)
    embed.add_field(name="!helpme", value="Affiche cette liste de commandes", inline=False)
    await ctx.send(embed=embed)

if __name__ == '__main__':
    bot.run("MTM2NTM2ODkyMDk5NDc0NjU1MA.GnhOi4.Y3enpllf2Myu3X-7xfel1HVbUPgn-ZhYID1O0w")