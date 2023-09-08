/**
 * parse version string
 * @param {{ version: string }|string} opt
 */
function semver(opt) {
  let version;
  if (typeof opt === 'string') {
    version = opt;
  } else {
    version = opt.version;
  }
  const rg =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
  const parse = rg.exec(version);
  return {
    major: parse[1],
    minor: parse[2],
    patch: parse[3]
  };
}

/**
 * increment version range
 * @param {Parameters<typeof semver>[0]} opt
 * @param {keyof ReturnType<typeof semver>} by
 */
function semverIncrement(opt, by) {
  const parse = semver(opt);
  parse[by] = String(parseInt(parse[by]) + 1);
  switch (by) {
    case 'major':
      // reset minor to zero
      parse['minor'] = '0';
      // reset patch to zero
      parse['patch'] = '0';
      break;

    case 'minor':
      // reset patch to zero
      parse['patch'] = '0';
      break;

    default:
      break;
  }
  return parse;
}

module.exports = { semver, semverIncrement };
