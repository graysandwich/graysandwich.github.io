function ShowEnemy(enemy){
    ChangePage("enemyDescriptionPage");
    let sourceImage=document.getElementById("enemyShowcaseImage");
    let sourceText=document.getElementById("enemySourceText");
    let descriptionText=document.getElementById("enemyDescriptionText");
    let abilityText=document.getElementById("enemyAbilityText");
    switch(enemy){
        case 1:
            sourceImage.src="images/enemy.webp";
            sourceText.innerText="Source: MCSR Ranked logo"
            abilityText.innerText="Ability: None.";
            descriptionText.innerText="Had one too many of his opponents get lucky strays. Now he's out for vengeance.";
            break;
        case 2:
            sourceImage.src="images/shooterEnemy.webp";
            sourceText.innerText="Source: Dream's face reveal"
            abilityText.innerText="Ability: Shoots bullets, alternating between shooting horizontally and vertically.";
            descriptionText.innerText="Claimed to once be the most powerful being in this world. Turns out the time period he was referring to was back when only two enemy types existed.";
            break;
        case 3:
            sourceImage.src="images/aimingEnemy.webp";
            sourceText.innerText="Source: First Google image of \"Collatz Conjecture\""
            abilityText.innerText="Ability: Shoots 3 bullets at a time that are aimed at the player.";
            descriptionText.innerText="The Collatz conjecture is one of the most famous unsolved problems in mathematics. The conjecture asks whether repeating two simple arithmetic operations will eventually transform every positive integer into 1. It concerns sequences of integers in which each term is obtained from the previous term as follows: if a term is even, the next term is one half of it. If a term is odd, the next term is 3 times the previous term plus 1. The conjecture is that these sequences always reach 1, no matter which positive integer is chosen to start the sequence. The conjecture has been shown to hold for all positive integers up to 2.36×10^21, but no general proof has been found. It is named after the mathematician Lothar Collatz, who introduced the idea in 1937, two years after receiving his doctorate.[4] The sequence of numbers involved is sometimes referred to as the hailstone sequence, hailstone numbers or hailstone numerals (because the values are usually subject to multiple descents and ascents like hailstones in a cloud),[5] or as wondrous numbers.[6] Paul Erdős said about the Collatz conjecture: \"Mathematics may not be ready for such problems.\"[7] Jeffrey Lagarias stated in 2010 that the Collatz conjecture \"is an extraordinarily difficult problem, completely out of reach of present day mathematics\".[8] However, though the Collatz conjecture itself remains open, efforts to solve the problem have led to new techniques and many partial results.[8][9] Statement of the problem Consider the following operation on an arbitrary positive integer: If the number is even, divide it by two. If the number is odd, triple it and add one. In modular arithmetic notation, define the function f as follows: f ( n ) = { n / 2 if n ≡ 0 ( mod 2 ) , 3 n + 1 if n ≡ 1 ( mod 2 ) . {\displaystyle f(n)={\begin{cases}n/2&{\text{if }}n\equiv 0{\pmod {2}},\\3n+1&{\text{if }}n\equiv 1{\pmod {2}}.\end{cases}}} Now form a sequence by performing this operation repeatedly, beginning with any positive integer, and taking the result at each step as the input at the next. In notation: a i = { n for i = 0 , f ( a i − 1 ) for i > 0 {\displaystyle a_{i}={\begin{cases}n&{\text{for }}i=0,\\f(a_{i-1})&{\text{for }}i>0\end{cases}}}(that is: ai is the value of f applied to n recursively i times; ai = f i(n)). The Collatz conjecture is: This process will eventually reach the number 1, regardless of which positive integer is chosen initially. That is, for each n, there";
            break;
        case 4:
            sourceImage.src="images/homingEnemy.webp";
            sourceText.innerText="Source: Edgar from Brawl Stars"
            abilityText.innerText="Ability: Shoots homing bullets. Stops moving when close to player.";
            descriptionText.innerText="How is a short-ranged assassain shooting homing projectiles? idk he probably got reworked buffies or something";
            break;
        case 5:
            sourceImage.src="images/trapperEnemy.webp";
            sourceText.innerText="Source: Trapper Zombie from PvZ Heroes"
            abilityText.innerText="Ability: Creates traps that linger on the battlefield.";
            descriptionText.innerText="Forgot to bring his traps over with him, so he's making do by sharing with Ninja Monkey's caltrops.";
            break;
        case 6:
            sourceImage.src="images/zombieEnemy.webp";
            sourceText.innerText="Source: Zombie Doge from The Battle Cats"
            abilityText.innerText="Ability: Can revive itself after dying twice.";
            descriptionText.innerText="Lost his Burrow ability on the way to this world. Made up for it with one more revive. The Enemy Guide is his only place of familiarity here.";
            break;
        case 7:
            sourceImage.src="images/shieldEnemy.webp";
            sourceText.innerText="Source: Starr Drop from Brawl Stars"
            abilityText.innerText="Ability: Has a shield that protects it from all bullets.";
            descriptionText.innerText="For those who are wondering: He's a mythic Starr Drop that contains 500 credits inside. Has a Nokia shield that's still good as new.";
            break;
        case 8:
            sourceImage.src="images/chargingEnemy.webp";
            sourceText.innerText="Source: Ram Rider from Clash Royale"
            abilityText.innerText="Ability: Occasionally charges at the player.";
            descriptionText.innerText="Just be glad she doesn't have her evolution unlocked yet.";
            break;
        case 9:
            sourceImage.src="images/ghostEnemy.webp";
            sourceText.innerText="Source: Ghost Pepper from PvZ 2"
            abilityText.innerText="Ability: Sometimes goes into translucent form, ignoring bullets for a couple seconds.";
            descriptionText.innerText="Nobody tell him that if he stays invisible for more than 2 seconds at a time he can actually be a lot more dangerous.";
            break;
        case 10:
            sourceImage.src="images/poisonEnemy.webp";
            sourceText.innerText="Source: Twitter logo"
            abilityText.innerText="Ability: Throws poison potions that linger on the field.";
            descriptionText.innerText="He initially lost to Reddit when applying for this position. However, after weeks of unrelenting effort, he finally managed to get his rival cancelled and stole his job. Is an expert at launching toxicity.";
            break;
        case 11:
            sourceImage.src="images/blackHoleEnemy.webp";
            sourceText.innerText="Source: Vacuum cleaner image I found on Google"
            abilityText.innerText="Ability: Shoots black holes that pull the player in.";
            descriptionText.innerText="He was a space enthusiast who misunderstood what the vacuum of space meant. Still can launch black holes. Task Failed Sucessfully I guess.";
            break;
        case 12:
            sourceImage.src="images/mimicEnemyDead.webp";
            sourceText.innerText="Source: Skull Emoji"
            abilityText.innerText="Ability: Disguises himself as an XP potion.";
            descriptionText.innerText="He's sick of being used in brainrot messages. Now he conceals himself among the XP Potions so nobody can find him.";
            break;
        case 13:
            sourceImage.src="images/builderEnemy.webp";
            sourceText.innerText="Source: Roblox Bacon Hair default avatar"
            abilityText.innerText="Ability: Spawns walls that block the player from moving past them.";
            descriptionText.innerText="Is bullying bacon hairs still a thing? What happened to the guest666 stuff? He's still stuck in the past, building stud walls the old-fashioned way. (Now you may proceed to tell me about Roblox memes that existed before I was born and how the examples I listed here are actually not that old)";
            break;
        case 14:
            sourceImage.src="images/windupEnemy.webp";
            sourceText.innerText="Source: Filibuster Obstructa from The Battle Cats"
            abilityText.innerText="Ability: Charges up a large saw attack that deals high damage.";
            descriptionText.innerText="Takes 3-5 business days to attack (Still faster than the wizard from Hypixel Skyblock)";
            break;
        case 15:
            sourceImage.src="images/spawnerEnemy.webp";
            sourceText.innerText="Source: Starting form is windows folder icon. Spawner form is mob spawner from Minecraft. The + sign particles is the card Evolutionary Leap from PvZ Heroes. The image on death is the Teleport Pad from Hypixel Skyblock"
            abilityText.innerText="Ability: Spawns random enemies once killed. The amount of enemies spawned depends on how long it's kept alive.";
            descriptionText.innerText="He's tired of people calling it an enchanted end portal frame. It's a Teleport Pad, and it's TELEPORTING the stored enemies in. Thank You.";
            break;
        case 16:
            sourceImage.src="images/selfDestructEnemy.webp";
            sourceText.innerText="Source: Furnace Zombie from PvZ2 Chinese Edition"
            abilityText.innerText="Ability: Moves faster the more damage he takes. Explodes on death.";
            descriptionText.innerText="He seems to be enjoying his time here. With the amount of bugs this game has, he feels completely at home.";
            break;
        case 17:
            sourceImage.src="images/machineGunEnemy.webp";
            sourceText.innerText="Source: Arena Closer from diep.io"
            abilityText.innerText="Ability: Shoots a high amount of bullets. Stays still if too close to player.";
            descriptionText.innerText="Arena Closed: No players can join";
            break;
        case 18:
            sourceImage.src="images/smokeBombEnemy.webp";
            sourceText.innerText="Source: Air Sweeper from Clash of Clans"
            abilityText.innerText="Ability: Spawns smoke that blocks the player's vision and slowly increases in size.";
            descriptionText.innerText="He's angry at the Town Hall owner for being inactive for 2 years, so he's letting off some steam.";
            break;
        case 19:
            sourceImage.src="images/laserBoss.webp";
            sourceText.innerText="Source: Google Image of laptop"
            abilityText.innerText="Ability: Shoots lasers aimed at the player.";
            descriptionText.innerText="His laser cannons used to be powered by 20% of all the microchips that exist in this world. Unfortunately, he couldn't afford the electricity bill for that, so he's been forced to downgrade a little.";
            break;
        case 20:
            sourceImage.src="images/iceBoss.webp";
            sourceText.innerText="Source: Image of j*b application"
            abilityText.innerText="Ability: Has a frost radius that slows the player. Shoots icicles that split into smaller ice bullets.";
            descriptionText.innerText="His face strikes terror into the hearts of all unemployed people.";
            break;
        case 21:
            sourceImage.src="images/bouncyBoss.webp";
            sourceText.innerText="Source: Thwomp from Mario"
            abilityText.innerText="Ability: Bounces off the walls, gaining speed and spawning a mini version of itself after every bounce";
            descriptionText.innerText="Graysandwich LLC maintains that any reference to a certain video game character is purely coincidental and fictitious. The word \"thwomp\" refers to the onomatopoeia of an object falling on the ground. Please read our Terms of Service for further information. If a video game company from Japan would like to sue Graysandwich LLC, then I guess that means this game actually became popular so I would not complain.";
            break;
        case 22:
            sourceImage.src="images/mageFireMode.webp";
            sourceText.innerText="Source: All 3 forms are levels from Geometry Dash. Tidal wave is taken from the level itself while the others are taken from the video thumbnails of the level's completion"
            abilityText.innerText="Ability: Cycles between three forms. Fire form shoots fast, close range bullets. Water form shoots waves of water bullets that deal knockback. Rock form shoots giant golems that split into smaller rocks.";
            descriptionText.innerText="If this game was created a five years ago then all three forms would have been based off of Hell-themed levels...";
            break;
        case 23:
            sourceImage.src="images/bulletHellBoss.webp";
            sourceText.innerText="Source: McAfee icon. Virus mode is taken from the level \"Generation Retro\" from Geometry Dash"
            abilityText.innerText="Ability: Has three attacks: an attack that goes straight, an attack that spins in a circle, and a laser attack. Attacks twice as fast after reaching 33% of his max health.";
            descriptionText.innerText="Fun fact: He planned on having a fourth attack called \"Firewall\" that created walls of fire. Unfortunately, that attack was about as useful as his actual firewall, so he was told to stop using it.";
            break;
        case 24:
            sourceImage.src="images/gambleBoss.webp";
            sourceText.innerText="Source: Lowkey's MCSR Random Seed Glitchess world record thumbnail"
            abilityText.innerText="Ability: Each attack has a chance of being one of five outcomes. Attacks are chosen at random, but each possible attack has a rarity that differs depending on difficulty.\n\n Common: Shoots basic bullets in a circle. \nUncommon: Shoots homing bullets and black holes. \nRare: Spawns a Roblox enemy, a File Explorer enemy, and a Filibuster enemy. \nEpic: Shoots lasers in a circle around him. \nLegendary: Shoots a barrage of random projectiles at the player.";
            descriptionText.innerText="For some reason, he seemed to really want to gamble. I guess that's what RSG does to someone.";
            break;
        case 25:
            sourceImage.src="images/snakeBoss.webp";
            sourceText.innerText="Source: slither.io snake"
            abilityText.innerText="Ability: Has a head and a body. The head part is the only part that can take damage. Body section knocks the player back on contact. Decreases in length when taking damage.";
            descriptionText.innerText="Ran out of pixels. No further questions.";
            break;
        case 26:
            sourceImage.src="images/healingBoss.webp";
            sourceText.innerText="Source: A deck called Heal Midrose taken from the Database of decks in the PvZ Heroes Discord server"
            abilityText.innerText="Ability: Shoots two types of bullets: homing and straight shooting. Both projectiles will heal all enemies in a radius around her back to full health. Occasionally goes into healing mode where she can't attack but heals extremely quickly.";
            descriptionText.innerText="If you feel extremely frustrated fighting her, then she's being accurate to the source material. Spams Sunshrooms like Rustbolt mains were spamming Quarterly Bonus.";
            break;
        case 27:
            sourceImage.src="images/splitterEnemy.webp";
            sourceText.innerText="Source: The boss Splitty from the game \"Will You Snail?\""
            abilityText.innerText="Ability: Shoots bullets that split into smaller bullets that split into smaller bullets that split into smaller bullets.";
            descriptionText.innerText="He was voted \"Most Obscure Reference\", in his yearbook. Nobody seems to care though.";
            break;
        case 28:
            sourceImage.src="images/teleporterEnemy.webp";
            sourceText.innerText="Source: The \"Ender Conehead\" Variant of the conehead zombie in PvZ TD mod. Sunflower on the top left exists because that was the best image I could get."
            abilityText.innerText="Ability: Teleports closer to the player every time he takes damage.";
            descriptionText.innerText="He is honored to be joining from the PvZ BRUTAL MODE EX+ ULTRA MEGA IMPOSSIBLE EDITIO- wait wrong mod close enough though";
            break;
        case 29:
            sourceImage.src="images/iceEnemy.webp";
            sourceText.innerText="Source: Emoji from Discord server of Samen (a PvZ Youtuber)"
            abilityText.innerText="Ability: Shoots ice bullets that slow the player down on contact.";
            descriptionText.innerText="Don't worry, he's not always this murderous. He's just back from vacation a little earlier than he would have liked after someone identity theft fraud he had to deal with. The knife is just for decoration.";
            break;
        case 30:
            sourceImage.src="images/engineerBoss.webp";
            sourceText.innerText="Source: Engineer Paragon from BTD6"
            abilityText.innerText="Ability: Can build 1 of 4 different towers. The tower it builds is chosen at random.\n\n 40%: Sentry Tower \n 30%: Laser Cannon \n 20%: Bomb Tower \n 10%: Ice Tower"
            descriptionText.innerText="You might be asking: How is this a paragon if its ability is solely based on the top crosspath? Well, ";
            break;
        case 31:
            sourceImage.src="images/farmerBoss.webp";
            sourceText.innerText="Source: Farmer from Luck Be A Landlord. Cow image is the profile picture of the goat BenQ in Codeforces. If you understand this enemy's reference then you are cool."
            abilityText.innerText="Ability: Shoots grass bullets that bounce off walls and never disappear. When he dies, he spawns Bessie the cow in his place. Bessie will shoot bullets and eat the grass that Farmer John shoots. For each grass block Bessie eats, she will increase in both movement speed and attack speed."
            descriptionText.innerText="Farmer John scoffs at people in math problems. Bob has 594+125 apples? Amateur. He has 10^5 different farms, with each farm having up to 10^9 cows. Find the shortest path between them. Or else.";
            break;
    }
}