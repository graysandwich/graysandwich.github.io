function ShowEnemy(enemy){
    ChangePage("enemyDescriptionPage");
    let sourceImage=document.getElementById("enemyShowcaseImage");
    let sourceText=document.getElementById("enemySourceText");
    let descriptionText=document.getElementById("enemyDescriptionText");
    switch(enemy){
        case 1:
            sourceImage.src="images/Enemy.webp";
            sourceText.innerText="Source: MCSR Ranked logo"
            descriptionText.innerText="Had one too many of his opponents get lucky strays. Now he's out for vengeance.";
            break;
        case 2:
            sourceImage.src="images/shooterEnemy.webp";
            sourceText.innerText="Source: Dream's face reveal"
            descriptionText.innerText="Claimed to once be the most powerful being in this world. Turns out the time period he was referring to was back when only two enemy types existed.";
            break;
        case 3:
            sourceImage.src="images/aimingEnemy.webp";
            sourceText.innerText="Source: Emoji from Discord server of Samen (a PvZ Youtuber)"
            descriptionText.innerText="His dagger is just for decoration. So is his face. Is actually Threepeater in disguise.";
            break;
        case 4:
            sourceImage.src="images/homingEnemy.webp";
            sourceText.innerText="Source: Edgar from Brawl Stars"
            descriptionText.innerText="How is a short-ranged assassain shooting homing projectiles? idk he probably got reworked buffies or something";
            break;
        case 5:
            sourceImage.src="images/trapperEnemy.webp";
            sourceText.innerText="Source: Trapper Zombie from PvZ Heroes"
            descriptionText.innerText="Forgot to bring his traps over with him, so he's making do by sharing with Ninja Monkey's caltrops.";
            break;
        case 6:
            sourceImage.src="images/zombieEnemy.webp";
            sourceText.innerText="Source: Zombie Doge from The Battle Cats"
            descriptionText.innerText="Lost his Burrow ability on the way to this world. Made up for it with one more revive. The Enemy Guide is his only place of familiarity here.";
            break;
        case 7:
            sourceImage.src="images/shieldEnemy.webp";
            sourceText.innerText="Source: Starr Drop from Brawl Stars"
            descriptionText.innerText="For those who are wondering: He's a mythic Starr Drop that contains 500 credits inside. Has a Nokia shield that's still good as new.";
            break;
        case 8:
            sourceImage.src="images/chargingEnemy.webp";
            sourceText.innerText="Source: Ram Rider from Clash Royale"
            descriptionText.innerText="Just be glad she doesn't have her evolution unlocked yet.";
            break;
        case 9:
            sourceImage.src="images/ghostEnemy.webp";
            sourceText.innerText="Source: Ghost Pepper from PvZ 2"
            descriptionText.innerText="Nobody tell him that if he stays invisible for more than 2 seconds at a time he can actually be a lot more dangerous.";
            break;
        case 10:
            sourceImage.src="images/poisonEnemy.webp";
            sourceText.innerText="Source: Reddit logo"
            descriptionText.innerText="Fought with Twitter for weeks to get this job. Turns out, he's a natural at throwing toxicity.";
            break;
        case 11:
            sourceImage.src="images/blackHoleEnemy.webp";
            sourceText.innerText="Source: Vacuum cleaner image I found on Google"
            descriptionText.innerText="He was a space enthusiast who misunderstood what the vacuum of space meant. Still can launch black holes. Task Failed Sucessfully I guess.";
            break;
        case 12:
            sourceImage.src="images/mimicEnemyDead.webp";
            sourceText.innerText="Source: Skull Emoji"
            descriptionText.innerText="He's sick of being used in brainrot messages. Now he conceals himself among the XP Potions so nobody can find him.";
            break;
        case 13:
            sourceImage.src="images/builderEnemy.webp";
            sourceText.innerText="Source: Roblox Bacon Hair default avatar"
            descriptionText.innerText="Is bullying bacon hairs still a thing? What happened to the guest666 stuff? He's still stuck in the past, building stud walls the old-fashioned way. (Now you may proceed to tell me about Roblox memes that existed before I was born and how the examples I listed here are actually not that old)";
            break;
        case 14:
            sourceImage.src="images/windupEnemy.webp";
            sourceText.innerText="Source: Filibuster Obstructa from The Battle Cats"
            descriptionText.innerText="Takes 3-5 business days to attack (Still faster than the wizard from Hypixel Skyblock)";
            break;
        case 15:
            sourceImage.src="images/spawnerEnemy.webp";
            sourceText.innerText="Source: Starting form is windows folder icon. Spawner form is mob spawner from Minecraft. The + sign particles is the card Evolutionary Leap from PvZ Heroes. The image on death is the Teleport Pad from Hypixel Skyblock"
            descriptionText.innerText="He's tired of people calling it an enchanted end portal frame. It's a Teleport Pad, and it's TELEPORTING the stored enemies in. Thank You.";
            break;
        case 16:
            sourceImage.src="images/selfDestructEnemy.webp";
            sourceText.innerText="Source: Furnace Zombie from PvZ2 Chinese Edition"
            descriptionText.innerText="He seems to be enjoying his time here. With the amount of bugs this game has, he feels completely at home.";
            break;
        case 17:
            sourceImage.src="images/machineGunEnemy.webp";
            sourceText.innerText="Source: Arena Closer from diep.io"
            descriptionText.innerText="Arena Closed: No players can join";
            break;
        case 18:
            sourceImage.src="images/smokeBombEnemy.webp";
            sourceText.innerText="Source: Air Sweeper from Clash of Clans"
            descriptionText.innerText="He's angry at the Town Hall owner for being inactive for 2 years, so he's letting off some steam.";
            break;
        case 19:
            sourceImage.src="images/laserBoss.webp";
            sourceText.innerText="Source: Google Image of laptop"
            descriptionText.innerText="His laser cannons used to be powered by 20% of all the microchips that exist in this world. Unfortunately, he couldn't afford the electricity bill for that, so he's been forced to downgrade a little.";
            break;
        case 20:
            sourceImage.src="images/iceBoss.webp";
            sourceText.innerText="Source: Image of j*b application"
            descriptionText.innerText="His face strikes terror into the hearts of all unemployed people.";
            break;
        case 21:
            sourceImage.src="images/bouncyBoss.webp";
            sourceText.innerText="Source: Thwomp from Mario"
            descriptionText.innerText="Graysandwich LLC maintains that any reference to a certain video game character is purely coincidental and fictitious. The word \"thwomp\" refers to the onomatopoeia of an object falling on the ground. Please read our Terms of Service for further information. If a video game company from Japan would like to sue Graysandwich LLC, then I guess that means this game actually became popular so I would not complain.";
            break;
        case 22:
            sourceImage.src="images/mageFireMode.webp";
            sourceText.innerText="Source: All 3 forms are levels from Geometry Dash. Tidal wave is taken from the level itself while the others are taken from the video thumbnails of the level's completion"
            descriptionText.innerText="If this game was created a five years ago then all three forms would have been based off of Hell-themed levels...";
            break;
        case 23:
            sourceImage.src="images/bulletHellBoss.webp";
            sourceText.innerText="Source: McAfee icon. Virus mode is taken from the level \"Generation Retro\" from Geometry Dash"
            descriptionText.innerText="Fun fact: He planned on having a fourth attack called \"Firewall\" that created walls of fire. Unfortunately, that attack was about as useful as his actual firewall, so he was told to stop using it.";
            break;
        case 24:
            sourceImage.src="images/gambleBoss.webp";
            sourceText.innerText="Source: Lowkey's MCSR Random Seed Glitchess world record thumbnail"
            descriptionText.innerText="For some reason, he seemed to really want to gamble. I guess that's what RSG does to someone.";
            break;
        case 25:
            sourceImage.src="images/snakeBoss.webp";
            sourceText.innerText="Source: slither.io snake"
            descriptionText.innerText="Ran out of pixels from the pixel store. No further questions.";
            break;
        case 26:
            sourceImage.src="images/healingBoss.webp";
            sourceText.innerText="Source: A deck called Heal Midrose taken from the Database of decks in the PvZ Heroes Discord server"
            descriptionText.innerText="If you feel extremely frustrated fighting her, then she's being accurate to the source material. Spams Sunshrooms like Rustbolt mains were spamming Quarterly Bonus.";
            break;
        case 27:
            sourceImage.src="images/splitterEnemy.webp";
            sourceText.innerText="Source: The boss Splitty from the game \"Will You Snail?\""
            descriptionText.innerText="He was voted \"Most Obscure Reference\", in his yearbook. Nobody seems to care though.";
            break;
    }
}