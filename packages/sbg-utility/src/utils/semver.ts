/**
 * parse version string
 */
class semver {
  result: { [s: string]: any } | ArrayLike<any> = {};

  /**
   * @param opt
   * @returns
   */
  constructor(opt: string | { version: string }) {
    let version: string;
    if (typeof opt === 'string') {
      version = opt;
    } else {
      version = opt.version;
    }
    const rg =
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm;
    const parse = rg.exec(version);
    if (parse)
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
 * @param opt
 * @param by
 */
function semverIncrement(opt: { version: string } | string, by: string | number) {
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

export { semver, semverIncrement };
