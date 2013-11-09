chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "loadAttributes") {
        fillAttributes(request.payload, request.character);
        sendResponse(true);
    }

    if (request.action == "getAttributes") {
        sendResponse(getAttributes());
    }

    if (request.action == 'rollDie') {
        rollDie(request.macro);
    }
});

function rollDie(macro) {
    var input_area = $('#textchat-input');
    var textarea = input_area.find('textarea');
    var temp = textarea.val();
    textarea.val(macro);
    input_area.find('button:contains(Send)').click();
    textarea.val(temp);
}

function getAttributes() {
    // HERE, I DECLARE, MINE VARS
    var skill_hash = {},
        attributes = {},
        i, j, k, m,
        name, val, skill
        whitelist = [
            'Name',
            'Level',
            'HP',
            'AC',
            'ACTouch',
            'ACFlat',
            'Init',
            'Speed',
            'Fort',
            'Reflex',
            'Will',
            'MBAB',
            'RBAB'
        ],
        abilities = ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha'];

    // Abilities
    for (i in abilities) {
        var ability = abilities[i];
        whitelist.push(ability);
        whitelist.push(ability + 'Mod');
    }

    // Skills
    for (j = 1; j <= 38; j++) {
        whitelist.push('Skill' + j);
        whitelist.push('Skill' + j + 'Mod');
    }

    for (k in whitelist) {
        name = whitelist[k];
        val = $('input[name=' + name + ']').val();

        if (typeof val === 'string') {
            val = val.replace('+', '');
        }

        if (name.substr(0, 5) === 'Skill') {
            // Discard all non-numbers to get the index
            var index = name.replace(/\D+/g, "");

            if (!skill_hash.hasOwnProperty(index)) {
                skill_hash[index] = {};
            }

            if (name.substr(-3) === 'Mod') {
                // Skill value
                skill_hash[index]['val'] = val;
            } else {
                // Skill name
                skill_hash[index]['name'] = val;
            }

            // Add skills later
            continue;
        }

        attributes[name] = val;
    }

    // Add back the skills
    for (m in skill_hash) {
        skill = skill_hash[m];
        attributes[skill.name] = skill.val;
    }

    return attributes;
}

function fillAttributes(attributes, character) {
    var parent_window, char_id;

    $('.character .namecontainer').each(function() {
        if ($.trim($(this).text()).substr(0, character.length) === character) {
            // Get char ID for future reference
            char_id = $(this).parents('.character').data('characterid');

            if ($('.dialog[data-characterid=' + char_id + ']').length < 1) {
                // Create new dialog
                $(this).parents('.character').click();
            }

            // Store dialog reference
            target_window = $('.dialog[data-characterid=' + char_id + ']');
            parent_window = target_window.parents('.ui-dialog');
            return false;
        }
    });

    // Edit character
    parent_window.find('.ui-dialog-titlebar .editcharacter').click();

    // Edit attributes
    target_window.find('a[data-tab="attributesabilities"]').click();
    
    // Clear attributes
    target_window.find('.deleteattr').click();

    // Fill in attributes
    for (var name in attributes) {
        addAttribute.call(target_window, name, attributes[name]);
    }

    // Save
    target_window.find("button:contains('Save Changes')").click();

    // Close
    closeWindow();

    setTimeout(closeWindow, 500);
}

function closeWindow() {
    $(".ui-icon-closethick").click();
}

function addAttribute(key, val) {
    if (key === "Name") {
        return;
    }

    $(this).find('.addattrib').click();

    // Recently added attribute
    $(this).find('.attrib:last').find('.attrname').find('input').val(key);
    $(this).find('.attrib:last').find('.current').find('input').val(val);
}