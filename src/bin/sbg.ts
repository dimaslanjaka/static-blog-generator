#!/usr/bin/env node

// compiled location in dist/src/bin/sbg.js

import { existsSync } from 'fs';
import { join } from 'path';
import yargs from 'yargs';
import gulp from '../../gulpfile';
import {
  clean_db,
  clean_posts,
  clean_public,
  clean_tmp
} from '../gulp/tasks/clean';
import { copyAssets } from '../gulp/tasks/copy/assets';
import { copyPosts } from '../gulp/tasks/copy/posts';
import { gulpInlineStyle } from '../gulp/tasks/copy/remove-inline-style';
import { generateAssets } from '../gulp/tasks/generate-assets';
import { generateFeeds } from '../gulp/tasks/generate-feed';
import { generatePosts } from '../gulp/tasks/generate-posts';
import { generateTemplate } from '../gulp/tasks/generate-template';
import color from '../node/color';
import { write } from '../node/filemanager';
import { yamlBuild, yamlParse } from '../parser/yaml';
import config, { ProjectConfig, verbose } from '../types/_config';

yargs
  .scriptName('sbg')
  .usage('usage: sbg <command>')
  .command(
    '$0',
    'the default command',
    () => {},
    () => {
      yargs.showHelp();
    }
  )
  .command(
    'get <key>',
    'getter config',
    function (yargs) {
      yargs.positional(`key`, {
        type: `string`,
        describe: `property name`
      });
    },
    ({ key }) => {
      if (key) {
        if (config[<string>key]) {
          console.log(config[<string>key]);
        } else {
          console.log(
            `property ${color.redBright(key)} in config doesnt exists`
          );
        }
      } else {
        yargs.showHelp();
      }
    }
  )
  // config set
  .command(
    'set <key> <value>',
    'setter config',
    (yargs) => {
      yargs.positional(`key`, {
        type: `string`,
        describe: `property key`
      });
      yargs.positional(`value`, {
        type: `string`,
        describe: `new property value`
      });
    },
    ({ key, value }) => {
      if (key && value) {
        //console.log(set, key, value);
        const configPath = existsSync(join(process.cwd(), '_config.cached.yml'))
          ? join(process.cwd(), '_config.cached.yml')
          : null;
        let parse: Record<string, any> = {};
        if (configPath !== null) {
          parse = yamlParse<ProjectConfig>(configPath);
        }

        parse[<string>key] = value;
        if (verbose)
          console.log(
            `property ${color.greenBright(key)} settled`,
            config[<string>key]
          );
        write(join(process.cwd(), '_config.cached.yml'), yamlBuild(parse));
      } else {
        yargs.showHelp();
      }
    }
  )
  // copy
  .command(
    'copy [key]',
    `copy all source assets and posts to ${config.source_dir}/_posts`,
    (yargs) => {
      yargs.positional(`posts`, {
        type: `string`,
        describe: `copy source posts to ${config.source_dir}/_posts`
      });
      yargs.positional(`assets`, {
        type: `string`,
        describe: `copy source assets to ${config.source_dir}/_posts`
      });
      yargs.positional(`remove-inline-style`, {
        type: `string`,
        describe: `remove inline style from html ${config.source_dir}/_posts (useful for migrated from blogger)`
      });
      yargs.positional(`blogger`, {
        type: `string`,
        describe: `'<series>'('copy assets', 'copy posts', 'copy remove-inline-style')`
      });
    },
    async ({ key }) => {
      switch (key) {
        case 'posts':
          await copyPosts();
          break;
        case 'assets':
          await copyAssets();
          break;
        case 'remove-inline-style':
          await gulpInlineStyle();
          break;
        case 'blogger':
          await copyAssets();
          await copyPosts.call(null);
          await gulpInlineStyle();
          break;
        default:
          if (verbose)
            console.log(color.Asparagus('copying all posts and assets'));
          await copyAssets();
          copyPosts();
          break;
      }
    }
  )
  // generator
  .command(
    'generate [key]',
    `generate all ${config.source_dir} to ${config.public_dir}`,
    (yargs) => {
      yargs.positional(`posts`, {
        type: `string`,
        describe: `generate ${config.source_dir} posts to ${config.public_dir}`
      });
      yargs.positional(`assets`, {
        type: `string`,
        describe: `generate ${config.source_dir} assets to ${config.public_dir}`
      });
      yargs.positional(`template`, {
        type: `string`,
        describe: `generate ${config.source_dir} template assets to ${config.public_dir}`
      });
    },
    async ({ key }) => {
      switch (key) {
        case 'posts':
          await generatePosts();
          break;
        case 'assets':
          await generateAssets();
          break;
        case 'template':
          generateTemplate();
          break;
        case 'feeds':
          await generateFeeds();
          break;
        default:
          generateTemplate();
          await generateAssets();
          await generatePosts();
          await generateFeeds();
          break;
      }
    }
  )
  // cleaner
  .command(
    'clean [key]',
    'clean task',
    (yargs) => {
      yargs.positional(`tmp`, {
        type: `string`,
        describe: `clean temporarily folder`
      });
      yargs.positional(`db`, {
        type: `string`,
        describe: `clean databases folder`
      });
      yargs.positional(`public`, {
        type: `string`,
        describe: `clean ${config.public_dir} folder`
      });
      yargs.positional(`posts`, {
        type: `string`,
        describe: `clean ${config.public_dir}/_posts folder`
      });
    },
    ({ key }) => {
      switch (key) {
        case 'tmp':
          clean_tmp();
          break;

        case 'db':
          clean_db();
          break;

        case 'posts':
          clean_posts();
          break;

        case 'public':
          clean_public();
          break;

        default:
          clean_db();
          clean_posts();
          clean_public();
          clean_tmp();
          break;
      }
    }
  )
  // deployer
  .command(
    'deploy',
    'deploy to repository',
    () => {},
    () => {
      if ('deploy' in config)
        if ('type' in config.deploy) {
          gulp.series('deploy-' + config['deploy']['type'])(null);
        }
    }
  )
  .option('nocache', {
    describe: 'disable cache',
    demandOption: false
  })
  .help('help')
  .alias('help', 'h')
  .alias('help', '?')
  .wrap(null).argv;
