$('#export').on('click', function() {
	$('.loading').show();

	chrome.tabs.query({url: "*://app.roll20.net/editor/"}, function(tabs) {
		if (tabs.length < 1) {
			$('.loading').hide();
			$('#export_error').html("Could not export. Make sure your Roll20 campaign is open in a tab and refresh it.");	
			return;
		}

		chrome.tabs.sendMessage(tabs[0].id, {
			action: "loadAttributes",
			payload: localStorage,
			character: $('#character').val()
		}, function(response) {
			$('.loading').hide();

			if (chrome.runtime.lastError || !response) {
				$('#export_error').html("Could not export. Make sure your Roll20 campaign is open in a tab and refresh it.");
				return;
			} else {
				$('#export_error').html("");
			}

			$('#timestamp_export').html(getCurrentTime()).change();
		});
	});
});

$('#import').on('click', function() {
	chrome.tabs.query({url: "*://www.myth-weavers.com/sheetview.php?sheetid=" + getSheetID()}, function(tabs) {
		if (tabs.length < 1) {
			$('#import_error').html("Could not import. Make sure your myth-weavers sheet is open in a tab and refresh it.");
			return;
		}

		chrome.tabs.sendMessage(tabs[0].id, {
			action: "getAttributes"
		}, function(attributes) {
			if (chrome.runtime.lastError || !attributes) {
				$('#import_error').html("Could not import. Make sure your myth-weavers sheet is open in a tab and refresh it.");
				return;
			} else {
				$('#import_error').html("");
			}

			localStorage.clear();

			$('#character').val(attributes['Name']).change();

			for (var name in attributes) {
				localStorage.setItem(name, attributes[name]);
			}
			$('#timestamp_import').html(getCurrentTime()).change();
		});
	});
});

// Save functions
$('#character').on('change', function() {
	chromeSetItem('character', $(this).val());
});

$('#sheetid').on('change', function() {
	chromeSetItem('sheetid', getSheetID());
});

$('#timestamp_import').on('change', function() {
	chromeSetItem('timestamp_import', $(this).html());
});

$('#timestamp_export').on('change', function() {
	chromeSetItem('timestamp_export', $(this).html());
});

// Populate existing data
chromeGetItem('character');
chromeGetItem('sheetid');
chromeGetItem('timestamp_import');
chromeGetItem('timestamp_export');

function getSheetID() {
	var input = $('#sheetid').val();
	return (!isNaN(parseInt(input))) ? input : "*";
}

function getCurrentTime() {
	var currentdate = new Date(); 
	var datetime = currentdate.getFullYear() + "-" +
					pad(currentdate.getMonth()+1, 2)  + "-" +
					pad(currentdate.getDate(), 2) + " @ " +
					pad(currentdate.getHours(), 2) + ":" +
					pad(currentdate.getMinutes(), 2) + ":" +
					pad(currentdate.getSeconds(), 2);
    return datetime;
}

function chromeSetItem(key, val) {
	var data = {};
	data[key] = val;
	chrome.storage.local.set(data);
}

function chromeGetItem(key) {
	chrome.storage.local.get(key, function(item) {
		$('#' + key).html(item[key]).val(item[key]);
	});
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}