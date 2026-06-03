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

		// Fantasy companion.

		this.arcaneTraitMappings["Alchemist"] = "Alchemy";
		this.arcaneTraitMappings["alchemist"] = "Alchemy";
		this.arcaneTraitMappings["Bard"] = "Performance";
		this.arcaneTraitMappings["bard"] = "Performance";
		this.arcaneTraitMappings["Cleric"] = "Faith";
		this.arcaneTraitMappings["cleric"] = "Faith";
		this.arcaneTraitMappings["Diabolist"] = "Spellcasting";
		this.arcaneTraitMappings["diabolist"] = "Spellcasting";
		this.arcaneTraitMappings["Druid"] = "Faith";
		this.arcaneTraitMappings["druid"] = "Faith";
		this.arcaneTraitMappings["Elementalist"] = "Spellcasting";
		this.arcaneTraitMappings["elementalist"] = "Spellcasting";
		this.arcaneTraitMappings["Illusionist"] = "Spellcasting";
		this.arcaneTraitMappings["illusionist"] = "Spellcasting";
		this.arcaneTraitMappings["Necromancer"] = "Spellcasting";
		this.arcaneTraitMappings["necromancer"] = "Spellcasting";
		this.arcaneTraitMappings["Shaman"] = "Faith";
		this.arcaneTraitMappings["shaman"] = "Faith";
		this.arcaneTraitMappings["Summoner"] = "Spellcasting";
		this.arcaneTraitMappings["summoner"] = "Spellcasting";
		this.arcaneTraitMappings["Tinkerer"] = "Repair";
		this.arcaneTraitMappings["tinkerer"] = "Repair";
		this.arcaneTraitMappings["Warlock/Witch"] = "Spellcasting";
		this.arcaneTraitMappings["Witch"] = "Spellcasting";
		this.arcaneTraitMappings["Warlock"] = "Spellcasting";
		this.arcaneTraitMappings["warlockwitch"] = "Spellcasting";
		this.arcaneTraitMappings["Wizard"] = "Spellcasting";
		this.arcaneTraitMappings["wizard"] = "Spellcasting";
		
		// Horror.

		this.arcaneTraitMappings["Mystic Powers"] = "Spirit";
		this.arcaneTraitMappings["mystic-powers"] = "Spirit";
		
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
		this.powerPoints["Alchemist"] = 15;
		this.powerPoints["Bard"] = 10;
		this.powerPoints["Cleric"] = 10;
		this.powerPoints["Diabolist"] = 10;
		this.powerPoints["Druid"] = 10;
		this.powerPoints["Elementalist"] = 10;
		this.powerPoints["Illusionist"] = 10;
		this.powerPoints["Mystic Powers"] = 10;
		this.powerPoints["Necromancer"] = 10;
		this.powerPoints["Shaman"] = 10;
		this.powerPoints["Sorcerer"] = 15;
		this.powerPoints["Summoner"] = 15;
		this.powerPoints["Tinkerer"] = 15;
		this.powerPoints["Warlock/Witch"] = 10;
		this.powerPoints["Warlock"] = 10;
		this.powerPoints["Witch"] = 10;
		this.powerPoints["Wizard"] = 15;

		this.powerPoints["arcane-background-magic"] = 10;
		this.powerPoints["arcane-background-gifted"] = 15;
		this.powerPoints["arcane-background-weird-science"] = 15;
		this.powerPoints["arcane-background-psionics"] = 10;
		this.powerPoints["arcane-background-miracles"] = 10;
		this.powerPoints["alchemist"] = 15;
		this.powerPoints["bard"] = 10;
		this.powerPoints["cleric"] = 10;
		this.powerPoints["diabolist"] = 10;
		this.powerPoints["druid"] = 10;
		this.powerPoints["elementalist"] = 10;
		this.powerPoints["illusionist"] = 10;
		this.powerPoints["mystic-powers"] = 10;
		this.powerPoints["necromancer"] = 10;
		this.powerPoints["shaman"] = 10;
		this.powerPoints["sorcerer"] = 15;
		this.powerPoints["summoner"] = 15;
		this.powerPoints["tinkerer"] = 15;
		this.powerPoints["warlockwitch"] = 10;
		this.powerPoints["wizard"] = 15;
		
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
	
	async selectBackground(actor, arcbgs, prompt = null) {
		let content = "";
		let prevABG = actor.getFlag('swade-auto-arcane', 'prevABG');
		for (const arcbg of arcbgs) {
			let checked = '';
			let n = arcbg.name;
			if (arcbg.system.swid)
				n = arcbg.system.swid;
			if (prevABG) {
				if (prevABG == n)
					checked = ' checked';
			} else
				checked = ' checked';
			content += `<div style="display: flex; flex-direction: row"><label><input type="radio" name="arcbg" value="${n}"${checked}>${arcbg.name}</label></div>\n`;
		}
		
		const actorName = actor.syntheticActor ? actor.syntheticActor.name : actor.name;

		try {
			if (!prompt)
				prompt = `${actor.name} has multiple arcane backgrounds. Pick one.`;
			let header = `<p>${prompt}</p>\n`;
			let arcbg = await foundry.applications.api.DialogV2.wait({
			  window: {
				  title: `Choose Arcane Background for ${actorName}`,
				  position: {
					  width: 500,
					  height: 400
				  }
			  },
			  modal: true,
			  content: `<form>${header}${content}</form>\n`,
			  buttons: [
				{
					action: "choice",
					label: "OK",
					callback: (event, button, dialog) => {
						actor.setFlag('swade-auto-arcane', 'prevABG', button.form.elements.arcbg.value);
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

	async getArcaneTrait(actor, prompt = null) {
		let arcbgs = actor.items.filter(it => it.system.isArcaneBackground);
		if (arcbgs.length == 0)
			return [null, null];
		let arcbg;
		if (arcbgs.length > 1) {
			// User selects desired background.
			let arcbgid = await this.selectBackground(actor, arcbgs, prompt);
			if (!arcbgid)
				return [null, null];
			arcbg = actor.items.find(it => it.system.swid == arcbgid);
		} else
			arcbg = arcbgs[0];
		let trait = arcbg.getFlag('swade-auto-arcane', 'trait');
		if (!trait)
			trait = this.arcaneTraitMappings[arcbg.system.swid];
		if (!trait)
			trait = this.arcaneTraitMappings[arcbg.name];
		if (!trait) {
			// Look in the arcane background description.
			let desc = arcbg.system.description.replaceAll(/\<\/p\>/g, "\n");
			desc = arcbg.system.description.replaceAll(/\<[^>]*\>/g, '');
			let m = desc.match(/Arcane Skill:[^A-Za-z]*([A-Za-z]+)/);
			if (m) {
				if (actor.items.find(it => it.name == m[1]))
					trait = m[1];
				else if (m[1] == 'Spirit' || m[1] == 'Smarts')
					trait = m[1];
			}			
		}
		if (!trait) {
			// Ask user to select trait.
			const attrlang={
				agility: "AttrAgi",
				spirit:"AttrSpr",
				strength: "AttrStr",
				smarts:  "AttrSma",
				vigor: "AttrVig"
			};
			const attributes=['agility','smarts','spirit','strength','vigor']

			let skillList=[]
			let content=`<div><div>
				<p>Select a Trait to use for ${arcbg.name}.</p>
				<p><label>${game.i18n.localize('SWADE.Trait')} </label> <select id="trait">\n`;

			content += `<optgroup label="${game.i18n.localize('SWADE.Attributes')}">\n`;
			attributes.map(att=>{
				content+=`<option value="att-${att}">${game.i18n.localize('SWADE.'+attrlang[att])}</option>\n`;
			})

			content+=`</optgroup>
			<optgroup label="${game.i18n.localize('SWADE.Skills')}">\n`

			actor.items.filter(el => el.type == 'skill').map(skill => {
				if (!skillList.includes(skill.name)){
					content += `<option value="${skill.name}">${skill.name}</option>\n`;
					skillList.push(skill.name);
				}
			});

			content += `</select></p>\n
			</div></div>`;

			await foundry.applications.api.DialogV2.wait({
				window: {
					title: "Select Trait",
				  position: {
					  width: 300,
					  height: 300
				  }
					
				},
				modal: true,
				content: content,
				buttons: [
					{
						action: "choice",
						label: "OK",
						callback: async (event, button, dialog) => {
							trait = button.form.elements.trait.value;
						}
					},
					{
						action: "cancel",
						label: "Cancel",
						callback: (event, button, dialog) => {
							trait = null;
						}
					}
				]
			});		
		}
		if (trait)
			arcbg.setFlag('swade-auto-arcane', 'trait', trait);
		return [arcbg.system.swid, trait];
	}

	async itemDeleted(item, action, id) {
		let actor = action.parent;
		if (item.system.swid == 'power-points') {
			let poolName = item.getFlag('swade-auto-arcane', 'poolName');
			if (!poolName || actor.system.powerPoints[poolName].max < 5)
				return;
			let powerPoints = actor.system.powerPoints;
			powerPoints[poolName].max -= 5;
			if (powerPoints[poolName].value >= 5)
				powerPoints[poolName].value -= 5;
			actor.update({"system.powerPoints": powerPoints});
			return;
		}
		if (item.system.isArcaneBackground) {
			let poolName = item.getFlag('swade-auto-arcane', 'poolName');
			if (!poolName || actor.system.powerPoints[poolName].max <= 0)
				return;
			let powerPoints = actor.system.powerPoints;
			powerPoints[poolName].max = 0;
			powerPoints[poolName].value = 0;
			actor.update({"system.powerPoints": powerPoints});
			return;
		}
	}

	async itemCreated(item, action, id) {
		let actor = action.parent;
		if (!actor || !(actor.type == 'character' || actor.type == 'npc'))
			return;

		if (!this.initialized)
			this.setMappings();

		if (item.system.isArcaneBackground) {
			// Create a second pool if there's already an arcane background.
			let poolName = 'general';
			const ab = actor.items.find(it => it.system.isArcaneBackground && it._id != item._id);
			if (ab) {
				const m = item.name.match(/[^(]+\((.+)\)/i);
				if (m) {
					poolName = m[1];
				} else
					poolName = item.name;
			}

			// Get the description without any HTML.
			let desc = item.system.description.replaceAll(/\<\/p\>/g, "\n");
			desc = desc.replaceAll(/\<[^>]*\>/g, '');

			// Look first for an defined AB with a swid, then the name.
			let pp = this.powerPoints[item.system.swid];
			if (pp === undefined) {
				pp = this.powerPoints[item.name];
				if (pp === undefined) {
					// Check for something like Mystic Powers (Demon--Tempter).
					let baseName = item.name.replace(/ *\(.+\)/, '');
					pp = this.powerPoints[baseName];
					if (pp === undefined) {
						// Search the text of the item to see if it specifies the PP.
						let m = desc.match(/Power Points:[^0-9]*([0-9]+)/);
						if (!m)
							return;
						pp = m[1];
					}
				}
			}
			let m = desc.match(/Power Point Pool: *([A-Za-z ]+)/i);
			if (m)
				poolName = m[1];
			let powerPoints = actor.system.powerPoints;
			const pool = {max: pp, value: pp};
			powerPoints[poolName] = pool;

			await actor.update({"system.powerPoints": powerPoints});
			item.setFlag('swade-auto-arcane', 'poolName', poolName);
			return;
		}
		
		if (item.system.swid == 'power-points') {
			const ABs = actor.items.filter(it => it.system.isArcaneBackground);
			let powerPool = 'general';
			let powerPoints = actor.system.powerPoints;
			if (ABs.length > 1) {
				let arcbgid = await this.selectBackground(actor, ABs,
					`${actor.name} has multiple arcane backgrounds. Choose the one to add the Power Points to.`);
				if (!arcbgid)
					return;
				let ab = actor.items.find(it => it.system.swid == arcbgid);
				if (ab) {
					const poolName = ab.getFlag('swade-auto-arcane', 'poolName')
					if (poolName)
						powerPool = poolName;
				}
			} else if (ABs.length == 1) {
				let pn = ABs[0].getFlag('swade-auto-arcane', 'poolName');
				if (pn)
					powerPool = pn;
			}
			powerPoints[powerPool].max += 5;
			powerPoints[powerPool].value += 5;
			actor.update({"system.powerPoints": powerPoints});
			item.setFlag('swade-auto-arcane', 'poolName', powerPool);
			return;
		}

		if (item.type != 'power')
			return;

		// If multiple ABs get the desired one and set the power pool.

		let [arcbgid, arcaneTrait] = await this.getArcaneTrait(actor,
			`${actor.name} has multiple arcane backgrounds. Select the background for this power.`);
		if (!arcaneTrait)
			return;

		// If the trait is already set on a power (say, by a grant)
		// then don't set it.

		if (!item.system.actions.trait) {
			let poolName = '';
			let ab = actor.items.find(it => it.system.swid == arcbgid);
			if (ab) {
				poolName = ab.getFlag('swade-auto-arcane', 'poolName');
				if (!poolName)
					poolName = '';
			}
			if (poolName == 'general')
				poolName = '';
			await item.update({"system.actions.trait": arcaneTrait, "system.arcane": poolName});
		}
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

			let [arcbgid, trait] = await this.getArcaneTrait(actor, `${actor.name} has multiple arcane backgrounds. Select the background to use for the character's powers.`);
			if (!trait)
				continue;

			let powers = actor.items.filter(it => it.type == 'power');
			if (powers.length == 0)
				continue;

			let ab = actor.items.find(it => it.system.swid == arcbgid);
			let poolName = '';
			const pn = ab.getFlag('swade-auto-arcane', 'poolName');
			if (pn)
				poolName = pn;
			if (poolName == 'general')
				poolName = '';

			for (let power of powers) {
				power.update({"system.actions.trait": trait, "system.arcane": poolName});
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
	
	async usePowerStone(actor, item) {
		const content = `<p>${item.name} has ${item.system?.charges.charges[0].value ? item.system.charges.charges[0].value : "no"} charges (quantity: ${item.system.quantity}).</p>
			<div style="display: table; width: 300px;">
				<div style="display: table-row-group">
					<div style="display: table-row;">
						<div style="display: table-cell">
							<label for="damage">Power Points:</label>
						</div>
						<div style="display: table-cell">
							<input type="number" id="pp" name="pp" maxlength="2" size="2">
						</div>
					</div>
				</div>
			</div>`;

		const dlg = new foundry.applications.api.DialogV2({
			window: { title: "Use Power Stone" },
			content: content,
			buttons: [
				{
					label: "OK",
					action: "ok",
					default: true,
					callback: async (event, button, dialog) => {
						use(actor, parseInt(button.form.elements.pp.valueAsNumber));
						return true;
					}
				},
				{
					action: "cancel",
					label: "Cancel",
					callback: (event, button, dialog) => { return false; }
				}
			]
		}).render(true);
		
		async function use(actor, pp) {
			if (!pp)
				return ui.notifications.notify("No power points specified.");
			if (!item.system.charges)
				return ui.notifications.notify(`${item.name} has no charges defined.`);
			if (item.system.quantity <= 0)
				return ui.notifications.notify(`${item.name} has a quantity of zero -- all charges used.`);
			let charges = item.system.charges.charges[0].value;
			if (charges <= 0)
				return ui.notifications.notify(`${item.name} is out of charges.`);
			if (pp > charges)
				return ui.notifications.notify(`${item.name} only has ${charges} charge(s).`);
			await item.consume(pp);
			await actor.update({
				"system.powerPoints.general.value": actor.system.powerPoints.general.value+pp
			});
			const detail = pp == charges ? "last " : "";
			ChatMessage.create({
			  speaker: ChatMessage.getSpeaker({ actor: actor }),
			content: `${actor.name} used ${detail}${pp} charges(s) from ${item.name}, increasing Power Points to ${actor.system.powerPoints.general.value}.`
			});
		}
	}
	
	static {
		console.log("SWADEAutoArcane | loaded.");
	}
	
}

Hooks.on("createItem", async (item, action, id) => {
	if (id != game.user.id || !item.parent || action.isItemGrant)
		return;
	
	await game.SWADEAutoArcane.itemCreated(item, action, id);
});

Hooks.on("deleteItem", async (item, action, id) => {
	if (id != game.user.id || !item.parent || action.isItemGrant)
		return;
	await game.SWADEAutoArcane.itemDeleted(item, action, id);
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
