/**
 * parse version string
 */
class semver {
  result;

  /**
   * @param {{ version: string }|string} opt
   * @returns
   */
  constructor(opt) {
    let version;
    if (typeof opt === 'string') {
      version = opt;
    } else {
      version = opt.version;
    }
    const rg =
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
    const parse = rg.exec(version);
    this.result = {
      major: parse[1],
      minor: parse[2],
      patch: parse[3]
    };
  }
  toString() {
    return Object.values(this.result).join('.');
  }
}

/**
 * increment version range
 * @param {ConstructorParameters<typeof semver>[0]} opt
 * @param {keyof ReturnType<semver['getResult']>} by
 */
function semverIncrement(opt, by) {
  const core = new semver(opt);
  const parse = core.result;
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
  // update result
  core.result = parse;
  return core;
}

module.exports = { semver, semverIncrement };
