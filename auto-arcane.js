/**	Automatically set the arcane trait on powers added to character sheets.
 */

export class SWADEAutoArcane {

	arcaneTraitMappings = [];
	initialized = false;
	registeredBackgrounds = [];

	powerPoints = [];
	registeredPowerPoints = [];

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
		
		this.powerPoints["Arcane Background (Magic)"] = 10;
		this.powerPoints["Arcane Background (Gifted)"] = 15;
		this.powerPoints["Arcane Background (Weird Science)"] = 15;
		this.powerPoints["Arcane Background (Psionics)"] = 10;
		this.powerPoints["Arcane Background (Miracles)"] = 10;

		this.powerPoints["arcane-background-magic"] = 10;
		this.powerPoints["arcane-background-gifted"] = 15;
		this.powerPoints["arcane-background-weird-science"] = 15;
		this.powerPoints["arcane-background-psionics"] = 10;
		this.powerPoints["arcane-background-miracles"] = 10;
		
		for (let pp of this.registeredPowerPoints) {
			if (pp.name)
				this.powerPoints[pp.name] = pp.pp;
			if (pp.swid)
				this.powerPoints[pp.swid] = pp.pp;
		}

		const customPowerPoints = game.settings.get('swade-auto-arcane', 'powerPoints');
		if (customPowerPoints) {
			let values = customPowerPoints.split(/ *; */);
			for (let mapping of values) {
				let m = mapping.split(/ *: */);
				if (m.length == 2) {
					this.powerPoints[m[0].trim()] = parseInt(m[1]);
				}
			}
		}

		this.initialized = true;
	}
	
	/**	Functions for registering custom backgrounds. These will override
	 *	standard backgrounds.
	 */

	registerBackground(abname, abswid, trait) {
		this.registeredBackgrounds.push({name: abname, swid: abswid, trait: trait});
		this.initialized = false;
	}
	
	registerPowerPoints(abname, abswid, pp) {
		this.registeredPowerPoints.push({name: abname, swid: abswid, pp: pp});
		this.initialized = false;
	}
	
	async selectBackground(actor, arcbgs) {
		let content = "";
		for (const arcbg of arcbgs) {
			let n = arcbg.name;
			if (arcbg.system.swid)
				n = arcbg.system.swid;
			content += `<tr><td style="width: 20%"><input type="radio" name="arcbg" value="${n}"></td><td>${arcbg.name}</td></tr>\n`;
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
			  content: `<table>${content}</table>\n`,
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
		let actor = action.parent;
		if (!actor || !(actor.type == 'character' || actor.type == 'npc'))
			return;

		if (!this.initialized)
			this.setMappings();

		if (item.system.isArcaneBackground) {
			// Don't set the power points if there's already another
			// arcane background.
			const ab = actor.items.find(it => it.isArcaneBackground);
			if (ab)
				return;

			let pp = this.powerPoints[item.system.swid];
			if (pp === undefined) {
				pp = this.powerPoints[item.name];
				if (pp === undefined)
					return;
			}
			await actor.update({"system.powerPoints.general.max": pp});
			return;
		}

		if (item.type != 'power')
			return;


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
	game.settings.register('swade-auto-arcane', 'powerPoints', {
	  name: 'Custom Arcane Background Power Points',
	  hint: `Enter custom power points for Arcane Backgrounds in the form "Arcane Background (Magic): 15", separated by semicolons. These entries override the standard mappings. The SWID for the arcane background can also be used and has priority over the name.`,
	  scope: 'world',     // "world" = sync to db, "client" = local storage
	  config: true,       // false if you dont want it to show in module config
	  type: String,       // Number, Boolean, String, Object
	  default: "",
	  onChange: value => { // value is the new value of the setting
		game.SWADEAutoArcane.setMappings();
	  }
	});
});
