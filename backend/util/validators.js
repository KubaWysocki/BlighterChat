// alphanumeric with single '_' dashes allowed inside
exports.usernameRegex = /^(?!_)(?!.*_{2})[a-zA-Z0-9_]+(?<![_])$/
// lowercase alphanumeric with single '_' dashes allowed inside
exports.usernameSlugRegex = /^(?!_)(?!.*_{2})[a-z0-9_]+(?<![_])$/

exports.chatNameRegex = /^(?!_)(?!.*_{2})[a-zA-Z0-9_]+(?<![_])$/

exports.chatNameSlugRegex = /^(?!_)(?!.*_{2})[a-z0-9_]+(?<![_])$/