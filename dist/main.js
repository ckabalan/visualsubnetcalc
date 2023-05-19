let subnetMap = {};
let subnetNotes = {};
let maxNetSize = 0;
let infoColumnCount = 5
// NORMAL mode:
//   - Smallest subnet: /30
//   - Two reserved addresses per subnet:
//     - Network Address (network + 0)
//     - Broadcast Address (last network address)
// AWS mode (future):
//   - Smallest subnet: /28
//   - Two reserved addresses per subnet:
//     - Network Address (network + 0)
//     - AWS Reserved - VPC Router
//     - AWS Reserved - VPC DNS
//     - AWS Reserved - Future Use
//     - Broadcast Address (last network address)
let operatingMode = 'NORMAL'
let noteTimeout;

$('input#network,input#netsize').on('input', function() {
    $('#input_form')[0].classList.add('was-validated');
})

$('#btn_go').on('click', function() {
    reset();
})

$('#btn_reset').on('click', function() {
    reset();
})

function reset() {
    let cidrInput = $('#network').val() + '/' + $('#netsize').val()
    let rootNetwork = get_network($('#network').val(), $('#netsize').val())
    let rootCidr = rootNetwork + '/' + $('#netsize').val()
    if (cidrInput !== rootCidr) {
        show_warning_modal('<div>Your network input is not on a network boundary for this network size. It has been automatically changed:</div><div class="font-monospace pt-2">' + $('#network').val() + ' -> ' + rootNetwork + '</div>')
    }
    $('#network').val(rootNetwork)
    subnetMap = {}
    subnetMap[rootCidr] = {}
    maxNetSize = parseInt($('#netsize').val())
    /*
    subnetMap = {
        '10.0.0.0/16': {
            '10.0.0.0/17': {},
            '10.0.128.0/17': {
                '10.0.128.0/18': {
                    '10.0.128.0/19': {},
                    '10.0.160.0/19': {
                        '10.0.160.0/20': {},
                        '10.0.176.0/20': {
                            '10.0.176.0/21': {
                                '10.0.176.0/22': {
                                    '10.0.176.0/23': {},
                                    '10.0.178.0/23': {}
                                },
                                '10.0.180.0/22': {}
                            },
                            '10.0.184.0/21': {}
                        }
                    }
                },
                '10.0.192.0/18': {
                    '10.0.192.0/19': {},
                    '10.0.224.0/19': {
                        '10.0.224.0/20': {},
                        '10.0.240.0/20': {
                            '10.0.240.0/21': {},
                            '10.0.248.0/21': {
                                '10.0.248.0/22': {},
                                '10.0.252.0/22': {
                                    '10.0.252.0/23': {},
                                    '10.0.254.0/23': {
                                        '10.0.254.0/24': {},
                                        '10.0.255.0/24': {}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    */
    renderTable();
}

$('#calcbody').on('click', 'td.split,td.join', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    mutate_subnet_map(this.dataset.mutateVerb, this.dataset.subnet, subnetMap)
    renderTable();
})

$('#calcbody').on('keyup', 'td.note input', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    let delay = 1000;
    clearTimeout(noteTimeout);
    noteTimeout = setTimeout(function(element) {
        console.log('CAP')
        subnetNotes[element.dataset.subnet] = element.value
    }, delay, this);
})

$('#calcbody').on('focusout', 'td.note input', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    clearTimeout(noteTimeout);
    console.log('CAP')
    subnetNotes[this.dataset.subnet] = this.value
})


function renderTable() {
    // TODO: Validation Code
    $('#calcbody').empty();
    let maxDepth = get_dict_max_depth(subnetMap, 0)
    addRowTree(subnetMap, 0, maxDepth)
}

function addRowTree(subnetTree, depth, maxDepth) {
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            addRowTree(subnetTree[mapKey], depth + 1, maxDepth)
        } else {
            let subnet_split = mapKey.split('/')
            addRow(subnet_split[0], parseInt(subnet_split[1]), (infoColumnCount + maxDepth - depth))
        }
    }
}

function addRow(network, netSize, colspan) {
    // TODO: do some checking here for smaller networks like /32, probably some edge cases to watch for.
    let addressFirst = ip2int(network)
    let addressLast = subnet_last_address(addressFirst, netSize)
    // Will need to adjust this for AWS mode
    let usableFirst = addressFirst + 1
    let usableLast = addressLast - 1
    let hostCount = 1 + usableLast - usableFirst
    let newRow =
        '            <tr id="row_' + network.replace('.', '-') + '_' + netSize + '">\n' +
        '                <td class="row_address">' + network + '/' + netSize + '</td>\n' +
        '                <td class="row_range">' + int2ip(addressFirst) + ' - ' + int2ip(addressLast) + '</td>\n' +
        '                <td class="row_usable">' + int2ip(usableFirst) + ' - ' + int2ip(usableLast) + '</td>\n' +
        '                <td class="row_hosts">' + hostCount + '</td>\n' +
        '                <td class="note"><label><input type="text" class="form-control shadow-none p-0" data-subnet="' + network + '/' + netSize + '" value="' + (subnetNotes[network + '/' + netSize] || '') + '"></label></td>\n' +
        '                <td rowspan="1" colspan="' + colspan + '" class="split rotate" data-subnet="' + network + '/' + netSize + '" data-mutate-verb="split"><span>/' + netSize + '</span></td>\n'
    if (netSize > maxNetSize) {
        // This is wrong. Need to figure out a way to get the number of children so you can set rowspan and the number
        // of ancestors so you can set colspan.
        // DONE: If the subnet address (without the mask) matches a larger subnet address
        // in the heirarchy that is a signal to add more join buttons to that row, since they start at the top row and
        // via rowspan extend downward.
        let matchingNetworkList = get_matching_network_list(network, subnetMap).slice(1)
        for (const i in matchingNetworkList) {
            let matchingNetwork = matchingNetworkList[i]
            let networkChildrenCount = count_network_children(matchingNetwork, subnetMap, [])
            newRow += '                <td rowspan="' + networkChildrenCount + '" colspan="1" class="join rotate" data-subnet="' + matchingNetwork + '" data-mutate-verb="join"><span>/' + matchingNetwork.split('/')[1] + '</span></td>\n'
        }
    }
    newRow += '            </tr>';

    $('#calcbody').append(newRow)
}


// Helper Functions
function ip2int(ip) {
    return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
}

function int2ip (ipInt) {
    return ( (ipInt>>>24) +'.' + (ipInt>>16 & 255) +'.' + (ipInt>>8 & 255) +'.' + (ipInt & 255) );
}

function subnet_last_address(subnet, netSize) {
    return subnet + subnet_addresses(netSize) - 1;
}

function subnet_addresses(netSize) {
    return 2**(32-netSize);
}

function get_dict_max_depth(dict, curDepth) {
    let maxDepth = curDepth
    for (let mapKey in dict) {
        let newDepth = get_dict_max_depth(dict[mapKey], curDepth + 1)
        if (newDepth > maxDepth) { maxDepth = newDepth }
    }
    return maxDepth
}


function get_join_children(subnetTree, childCount) {
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            childCount += get_join_children(subnetTree[mapKey])
        } else {
            return childCount
        }
    }
}

function count_network_children(network, subnetTree, ancestryList) {
    // TODO: This might be able to be optimized. Ultimately it needs to count the number of keys underneath
    // the current key are unsplit networks (IE rows in the table, IE keys with a value of {}).
    let childCount = 0
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            childCount += count_network_children(network, subnetTree[mapKey], ancestryList.concat([mapKey]))
        } else {
            if (ancestryList.includes(network)) {
                childCount += 1
            }
        }
    }
    return childCount
}

function get_matching_network_list(network, subnetTree) {
    let subnetList = []
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            subnetList.push.apply(subnetList, get_matching_network_list(network, subnetTree[mapKey]))
        }
        if (mapKey.split('/')[0] === network) {
            subnetList.push(mapKey)
        }
    }
    return subnetList
}

function get_network(networkInput, netSize) {
    let ipInt = ip2int(networkInput)
    netSize = parseInt(netSize)
    for (let i=31-netSize; i>=0; i--) {
        ipInt &= ~ 1<<i;
    }
    return int2ip(ipInt);
}

function split_network(networkInput, netSize) {
    let subnets = [networkInput + '/' + (netSize + 1)]
    let newSubnet = ip2int(networkInput) + 2**(32-netSize-1);
    subnets.push(int2ip(newSubnet) + '/' + (netSize + 1))
    return subnets;
}

function mutate_subnet_map(verb, network, subnetTree) {
    for (let mapKey in subnetTree) {
        if (Object.keys(subnetTree[mapKey]).length > 0) {
            mutate_subnet_map(verb, network, subnetTree[mapKey])
        }
        if (mapKey === network) {
            if (verb === 'split') {
                let netSplit = mapKey.split('/')
                // operatingMode NORMAL
                let minSubnetSize = 30
                if (operatingMode === 'AWS') {
                    minSubnetSize = 28
                }
                if (parseInt(netSplit[1]) < minSubnetSize) {
                    let new_networks = split_network(netSplit[0], parseInt(netSplit[1]))
                    subnetTree[mapKey][new_networks[0]] = {}
                    subnetTree[mapKey][new_networks[1]] = {}
                    // Copy note to both children and delete Delete parent note
                    subnetNotes[new_networks[0]] = subnetNotes[mapKey]
                    subnetNotes[new_networks[1]] = subnetNotes[mapKey]
                    delete subnetNotes[mapKey]
                }
            } else if (verb === 'join') {
                // Keep the note of the first subnet (which matches the network address) and lose the second subnet's note
                // Could consider changing this to concatenate the notes into the parent, but I think this is more intuitive
                subnetNotes[mapKey] = subnetNotes[Object.keys(subnetTree[mapKey])[0]]
                subnetNotes[Object.keys(subnetTree[mapKey])[0]] = ''
                subnetNotes[Object.keys(subnetTree[mapKey])[1]] = ''
                subnetTree[mapKey] = {}
            } else {
                // How did you get here?
            }
        }
    }
}
/*
function validate_cidr(network, netSize) {
    let returnObj = {
        'valid': false,
        'errorNetwork': true,
        'errorSize': true,
        'cidr': false,
        'network': false,
        'netSize': false
    }
    returnObj['network'] = validate_network(network)
    if (returnObj['network']) {
        returnObj['errorNetwork'] = false;
    }
    if (!/^\d+$/.test(netSize)) {
        returnObj['errorSize'] = true;
    } else {
        netSize = parseInt(netSize)
        if ((netSize > 32) || (netSize < 0)) {
            returnObj['errorSize'] = true;
        } else {
            returnObj['errorSize'] = false;
            returnObj['netSize'] = netSize.toString()
        }
    }
    if ((returnObj['errorNetwork'] === false) && (returnObj['errorSize'] === false)) {
        returnObj['cidr'] = returnObj['network'] + '/' + returnObj['netSize']
        returnObj['valid'] = true
    }
    return returnObj;
}

function validate_network(network) {
    // This can probably be done with Regex but this is better.
    let octets = network.split('.');
    if (octets.length !== 4) { return false }
    if (!/^\d+$/.test(octets[0])) { return false }
    if (!/^\d+$/.test(octets[1])) { return false }
    if (!/^\d+$/.test(octets[2])) { return false }
    if (!/^\d+$/.test(octets[3])) { return false }
    octets[0] = parseInt(octets[0])
    octets[1] = parseInt(octets[1])
    octets[2] = parseInt(octets[2])
    octets[3] = parseInt(octets[3])
    if ((octets[0] < 0) || (octets[0] > 255)) { return false }
    if ((octets[1] < 0) || (octets[1] > 255)) { return false }
    if ((octets[2] < 0) || (octets[2] > 255)) { return false }
    if ((octets[3] < 0) || (octets[3] > 255)) { return false }
    return octets.join('.')
}
*/

function show_warning_modal(message) {
    var notifyModal = new bootstrap.Modal(document.getElementById("notifyModal"), {});
    $('#notifyModal .modal-body').html(message)
    notifyModal.show()
}

$( document ).ready(function() {
    reset();
});
