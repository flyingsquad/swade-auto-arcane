/**	Automatically set the arcane trait on powers added to character sheets.
 */

export class SWADEAutoArcane {

	arcaneTraitMappings = [];
	initialized = false;
	registeredBackgrounds = [];

	setMappings() {
		// FIX: The SWID handles the ABs in other languages. What about the skill names?
		this.arcaneTraitMappings = [];
		this.arcaneTraitMappings["Arcane Background (Magic)"] = "Spellcasting";
		this.arcaneTraitMappings["arcane-background-magic"] = "Spellcasting";
		this.arcaneTraitMappings["Arcane Background (Gifted)"] = "Focus";
		this.arcaneTraitMappings["arcane-background-gifted"] = "Focus";
		this.arcaneTraitMappings["Arcane Background (Weird Science)"] = "Weird Science";
		this.arcaneTraitMappings["arcane-background-weird-science"] = "Weird Science";
		this.arcaneTraitMappings["Arcane Background (Psionics)"] = "Psionics";
		this.arcaneTraitMappings["arcane-background-psionics"] = "Psionics";
		this.arcaneTraitMappings["Arcane Background (Miracles)"] = "Faith";
		this.arcaneTraitMappings["arcane-background-miracles"] = "Faith";
		
		for (let m of this.registeredBackgrounds) {
			if (m.name)
				this.arcaneTraitMappings[m.name] = m.trait;
			if (m.swid)
				this.arcaneTraitMappings[m.swid] = m.trait;
		}
		
		const customMappings = game.settings.get('swade-auto-arcane', 'mappings');
		if (customMappings) {
			let values = customMappings.split(/ *; */);
			for (let mapping of values) {
				let m = mapping.split(/ *: */);
				if (m.length == 2) {
					this.arcaneTraitMappings[m[0].trim()] = m[1].trim();
				}
			}
		}
		this.initialized = true;
	}
	
	/**	Function for registering custom backgrounds. These will override
	 *	standard backgrounds.
	 */

	registerBackground(abname, abswid, trait) {
		this.registeredBackgrounds.push({name: abname, swid: abswid, trait: trait});
		this.initialized = false;
	}
	
	async selectBackground(actor, arcbgs) {
		let content = "";
		for (const arcbg of arcbgs) {
			let n = arcbg.name;
			if (arcbg.system.swid)
				n = arcbg.system.swid;
			content += `<label for="arcbg" style="width: 400"><input type="radio" name="arcbg" value="${n}">${arcbg.name}</input></label>\n`;
		}
		
		const actorName = actor.syntheticActor ? actor.syntheticActor.name : actor.name;

		try {
			let arcbg = await foundry.applications.api.DialogV2.wait({
			  window: {
				  title: `Choose Arcane Background for ${actorName}`,
				  position: {
					  width: 500
				  }
			  },
			  modal: true,
			  content: `<form width="500">${content}</form>\n`,
			  buttons: [
				{
					action: "choice",
					label: "Continue",
					callback: (event, button, dialog) => {
						return button.form.elements.arcbg.value;
					}
				},
				{
					action: "cancel",
					label: "Cancel",
					callback: (event, button, dialog) => null
				}
			  ]
			});
			
			return arcbg;

		} catch {
			return null;
		}

		return null;
	}

	async getArcaneTrait(actor) {
		let arcbgs = actor.items.filter(it => it.system.isArcaneBackground);
		if (arcbgs.length == 0)
			return null;
		let arcbg;
		if (arcbgs.length > 1) {
			// User selects desired background.
			let arcbgid = await this.selectBackground(actor, arcbgs);
			if (!arcbgid)
				return null;
			return this.arcaneTraitMappings[arcbgid];
		} else
			arcbg = arcbgs[0];
		let trait = this.arcaneTraitMappings[arcbg.system.swid];
		if (trait)
			return trait;
		return this.arcaneTraitMappings[arcbg.name];
	}

	async itemCreated(item, action, id) {
		if (item.type != 'power')
			return;

		let actor = action.parent;
		if (!actor || !(actor.type == 'character' || actor.type == 'npc'))
			return;

		if (!this.initialized)
			this.setMappings();

		let arcaneTrait = await this.getArcaneTrait(actor);
		if (!arcaneTrait)
			return;

		// If the trait is already set on a power (say, by a grant)
		// then don't set it.

		if (!item.system.actions.trait)
			await item.update({"system.actions.trait": arcaneTrait});
	}

	/**	Set the arcane trait on all powers for the selected tokens.
	 */

	async setArcaneTraits() {

		if (canvas.tokens.controlled.length == 0) {
			ui.notifications.warn('No tokens selected for setting arcane traits.');
			return;
		}

		if (!this.initialized)
			this.setMappings();

		let actors = '';
		let count = 0;
		let traits = '';

		for (const token of canvas.tokens.controlled) {
			let actor = token.actor;
			if (!actor)
				continue;

			let trait = await this.getArcaneTrait(actor);
			if (!trait)
				continue;

			let powers = actor.items.filter(it => it.type == 'power');
			if (powers.length == 0)
				continue;

			for (let power of powers) {
				power.update({"system.actions.trait": trait});
				count++;
			}
			if (actors)
				actors += ', ';
			actors += actor.name;
			if (traits)
				traits += ', ';
			traits += trait;
		}
		
		if (count == 0)
			ui.notifications.notify('The selected tokens had no powers or no configured arcane background.');
		else
			ui.notifications.notify(`Set ${traits} on ${count} power(s) for ${actors}`);	
	}
	
	static {
		console.log("SWADEAutoArcane | loaded.");
	}
	
}

Hooks.on("createItem", async (item, action, id) => {
	await game.SWADEAutoArcane.itemCreated(item, action, id);
});

Hooks.on("init", function() {
	console.log("SWADEAutoArcane | initialized.");
	if (!game.SWADEAutoArcane)
		game.SWADEAutoArcane = new SWADEAutoArcane();
});

Hooks.once('init', async function () {
	console.log("SWADEAutoArcane | register settings.");
	game.settings.register('swade-auto-arcane', 'mappings', {
	  name: 'Custom Arcane Background Traits',
	  hint: `Enter custom traits for Arcane Backgrounds in the form "Arcane Background (Magic): Spellcasting", separated by semicolons. These entries override the standard mappings. The SWID for the arcane background can also be used and has priority over the name.`,
	  scope: 'world',     // "world" = sync to db, "client" = local storage
	  config: true,       // false if you dont want it to show in module config
	  type: String,       // Number, Boolean, String, Object
	  default: "",
	  onChange: value => { // value is the new value of the setting
		game.SWADEAutoArcane.setMappings();
	  }
	});
});
