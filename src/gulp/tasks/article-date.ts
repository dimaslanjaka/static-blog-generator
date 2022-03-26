// fix article published and updated date

/*

              const mtime = stats.mtime;
              const modified_file = moment(mtime).format("YYYY-MM-DDTHH:mm:ssZ");
              // if modified today, try get modification date from git commit
              const isToday = moment(modified_file).isSame(moment(), "day"); // O/P : **true**

// only run this function on localhost (not github workflow)
              if (typeof process.env.GITFLOW === "undefined") {
              }
// get modified date from git commit date
                const stdout = execSync('git log -1 --pretty="format:%cD" ' + sourceFile, { encoding: "utf8" });
                const format_stdout = moment(stdout.trim()).format("YYYY-MM-DDTHH:mm:ssZ");
                // only run if existing post updated time is different with git modified time
                if (parse.metadata.updated != format_stdout) {
                  parse.metadata.updated = format_stdout;
                  // save the git modified time to source post file
                  const parseSource = parsePost(sourceFile);
                  parseSource.metadata.updated = format_stdout;
                  // only store modified time to original source post file when both modified date is different
                  if (parse.metadata.updated !== parseSource.metadata.updated) {
                    appendFileSync(
                      join(__dirname, "tmp/updated-time.log"),
                      `Update ${sourceFile} with ${format_stdout} from ${parseSource.metadata.updated}\n`
                    );
                    //saveParsedPost(parseSource, sourceFile);
                  }
                }*/
