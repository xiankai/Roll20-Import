Roll20-Import
=============

This is a chrome extension that allows for the export of [Myth-weavers character sheets][1] to [Roll20's character journals][2]. This in turn, can be used for [Roll20's macros][3]. Optionally, it can be used for macros as well.

This is not meant to circumvent [Roll20's API][4], which is a thing of beauty in itself. This is merely to provide a cross-site export-import utility script.

As an example, after exporting and importing, you can reference your character's attributes directly in the following macro:

    /roll 1d20 + @{MyCharacter|StrMod}

Which would roll a d20 and add your character's strength modifier.

How does it work?
=================

The extension essentially scrapes the Myth-weavers character sheet page for relevant attributes (usually numerical modifiers) and stores them temporarily - and then inputs them into the Roll20 journal on the campaign page using the normal actions one may use to edit a journal (open the journal window, click the edit attribute, etc.). 

To prevent information overload, only the final modifiers are included when exporting stats.

It is currently tailored around `DnD 3.5` ruleset, because that is what I'm running my current campaign under.

How to use?
===========

 - To install as a chrome extension from source, first clone a copy of this repository. Then go to the Extensions page and turn on Developer Mode. Then click on "Load unpacked extension..." and select the folder of your local repository. The extension will now be loaded.

 - An icon should now appear to the right of your address bar. Clicking on it reveals a pop-up that will allow for Export and Import actions. You need to have a successful export before you can do an import.

 - To export, make sure you have just one Myth-weavers character sheet open as a webpage. If you have multiple, you can specify the one you want in the `MW Sheet ID` field. Then click the Export button. **Note that this will also extract your character's name, which is assumed to be the same for your Roll20 character journal.**

 - To import, make sure that Roll20 is open as a webpage and the campaign is active. Then you can begin the import. The character dialog may flash for a second, but that is the result of the script opening it up to edit and closing it real quick.

Roll Helper
===========

Although the main purpose of this extension was to extend the power of Roll20's macros and use them directly, I quickly realized that for common actions, an interface would be easier than making several macros and having to (re)create them each campaign/player.

The roll helper at the moment just contains the fields for a single action - making an attack roll against a selected enemy.

Clicking on `Attack Roll` will try to send a macro to your Roll20 campaign's chat input, using your character's total attack bonus and any modifiers, against a selected token's AC.

`Attack Type` can toggle between your melee or range attack bonus.

`Attack Modifier` can let you roll against the target's Flat-Footed AC or Touch AC instead.

 Make sure that your character's journal has the entries `MBAB` and `RBAB` for melee and range attack bonus respectively, and that your DM has set up `AC`, `ACTouch` and `ACFlat` for AC, Touch AC nad Flat-footed AC respectively for the enemy tokens.

The resulting roll is made with a brief description of the roll and immediately computes a success or failure:

    rolling {1d20+8}>12 Melee touch attack against Mr. Fists

Roadmap
=======

While this started as a personal utility script, I can see how the need for synchronizing external character sheets outside of Roll20 can get useful. If you have any suggestions or bugs to report, I would appreciate it a lot if you could raise a GitHub issue!

	[1]:http://www.myth-weavers.com/sheetindex.php
	[2]:https://wiki.roll20.net/Journal
	[3]:http://help.roll20.net/macros/
	[4]:https://wiki.roll20.net/API:Introduction