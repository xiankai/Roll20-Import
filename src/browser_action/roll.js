var type_name, touch = "", flat = "";

$('.roll').click(function() {
	touch = "", flat = "";

	switch ($(this).data('type')) {
		case 'attack':
			macro = "/roll 1d20+@{" + localStorage["Name"] + "|" + getAttackerType() + "}>@{selected|" + getTargetAC() + "}";
			macro += " " + type_name + touch + "attack against " + flat + localStorage["Name"];
			break;
		case 'spell':
			macro = "/roll";
	}

	chrome.tabs.query({url: "*://app.roll20.net/editor/"}, function(tabs) {
		if (tabs.length < 1) {
			return;
		}

		chrome.tabs.sendMessage(tabs[0].id, {
			action: "rollDie",
			macro: macro
		});
	});
});

function getAttackerType() {
	switch($('#attack_type')) {
		case 'range':
			type_name = 'Range ';
			return 'RBAB';
		case 'melee':
		default:
			type_name = 'Melee ';
			return 'MBAB';
	}
}

function getTargetAC() {
	switch($('#attack_mod').val()) {
		case 'touch':
			touch = "touch ";
			return 'ACTouch';
		case 'flat':
			flat = "flat-footed ";
			return 'ACFlat';
		case 'normal':
		default:
			return 'AC';
	}
}